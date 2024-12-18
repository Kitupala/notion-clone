"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { useUser } from "@clerk/nextjs";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      if (!user && isLoaded) {
        // Redirect the user to the sign-in page
        router.push("/sign-in");
        return;
      }

      // Create a new document
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
};

export default NewDocumentButton;
