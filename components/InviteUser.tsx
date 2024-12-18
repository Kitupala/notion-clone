"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const InviteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const pathName = usePathname();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathName.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User added to document successfully!");
      } else {
        toast.error("Failed to add user to document.");
      }
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline">
          <DialogTrigger>Invite</DialogTrigger>
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a User to collaborate!</DialogTitle>
            <DialogDescription>
              Enter the email of the user you want to invite.
            </DialogDescription>
          </DialogHeader>
          <form className="flex gap-2" onSubmit={handleInvite}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={isPending || !email}>
              {isPending ? "Inviting..." : "Invite"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteUser;
