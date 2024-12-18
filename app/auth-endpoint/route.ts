import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "@/firebase-admin";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(<string>sessionClaims?.email, {
    userInfo: {
      name: sessionClaims?.fullName ?? "Anonymous",
      email: sessionClaims?.email ?? "unknown@example.com",
      avatar: sessionClaims?.image ?? "/default-avatar.png",
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);
  console.log("userInRoom", userInRoom);

  if (userInRoom) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 },
    );
  }
}
