"use client";

import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import CollaborativeEditor from "@/components/CollaborativeEditor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "@/components/DeleteDocument";
import InviteUser from "@/components/InviteUser";
import ManageUsers from "@/components/ManageUsers";
import Avatars from "@/components/Avatars";

const Document = ({ id }: { id: string }) => {
  const [data] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const handleUpdateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="h-full flex-1 bg-white p-5">
      <div className="mx-auto flex max-w-6xl justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={handleUpdateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between pb-5">
        <ManageUsers />
        <Avatars />
      </div>
      <hr className="pb-10" />

      <CollaborativeEditor />
    </div>
  );
};
export default Document;
