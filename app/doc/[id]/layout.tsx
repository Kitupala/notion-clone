import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RoomProvider from "@/components/RoomProvider";

type Params = Promise<{ id: string }>;

export default async function DocLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { id } = await props.params;

  return <RoomProvider roomId={id}>{props.children}</RoomProvider>;
}
