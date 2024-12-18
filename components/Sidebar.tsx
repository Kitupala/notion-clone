"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  DocumentData,
  collectionGroup,
  query,
  where,
} from "@firebase/firestore";

import NewDocumentButton from "@/components/NewDocumentButton";
import { MenuIcon } from "lucide-react";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "@/components/SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: Date;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });

  const [data] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString()),
      ),
  );

  useEffect(() => {
    if (!user || !data) {
      setGroupedData({ owner: [], editor: [] });
      return;
    }

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, cur) => {
        const roomData = cur.data() as RoomDocument;

        if (roomData.role === "owner") {
          acc.owner.push({ id: cur.id, ...roomData });
        } else {
          acc.editor.push({ id: cur.id, ...roomData });
        }

        return acc;
      },
      { owner: [], editor: [] },
    );

    setGroupedData(grouped);
  }, [user, data]);

  const menuOptions = (
    <>
      <NewDocumentButton />

      <div className="flex flex-col space-y-4 py-4 md:max-w-36">
        {/*  My documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-sm font-semibold text-gray-500">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-gray-500">
              My documents
            </h2>
            {groupedData.owner.map((doc: RoomDocument) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}

        {/*  Shared with me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-500">
              Shared with Me
            </h2>
            {groupedData.editor.map((doc: RoomDocument) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="relative bg-zinc-200 p-2 md:p-5">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon
              className="rounded-lg p-2 transition duration-300 hover:opacity-30"
              size={40}
            />
          </SheetTrigger>
          <SheetContent side="left" aria-describedby={undefined}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
};

export default Sidebar;
