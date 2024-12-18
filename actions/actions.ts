"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebase-admin";
import { redirect } from "next/navigation";
import liveblocks from "@/lib/liveblocks";

export async function createNewDocument() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in"); // Clerk's default sign-in route
  }

  const { sessionClaims } = await auth();
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  const userEmail = sessionClaims?.email ?? "unknown@example.com";

  await adminDb
    .collection("users")
    .doc(userEmail)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: userEmail,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  console.log("deleteDocument", roomId);

  try {
    // Delete the document reference itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    // Delete the room reference in the user's collection for every user in the room
    const batch = adminDb.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete room in liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  console.log("inviteUserToDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId: roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  console.log("removeUserFromDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
