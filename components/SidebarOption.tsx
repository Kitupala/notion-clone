"use client";

import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { db } from "@/firebase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  const [data] = useDocumentData(doc(db, "documents", id));
  const pathName = usePathname();
  const isActive = href.includes(pathName) && pathName !== "/";

  if (!data) return null;

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border p-2 text-gray-800",
        isActive ? "border-gray-400 bg-gray-300 font-bold" : "border-gray-300",
      )}
    >
      <p className="truncate">{data.title}</p>
    </Link>
  );
};

export default SidebarOption;
