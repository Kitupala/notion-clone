"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Y from "yjs";
import React, { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentData,
            question: input,
          }),
        },
      );

      if (res.ok) {
        const { message } = await res.json();
        setInput("");
        setSummary(message);
        toast.success("Question asked successfully!");
      }
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline" disabled={true}>
          <DialogTrigger>
            <MessageCircleCode className="mr-2" />
            Chat to document
          </DialogTrigger>
        </Button>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat to the document!</DialogTitle>
            <DialogDescription>
              Ask a question and chat to the document with AI.
            </DialogDescription>
            <hr className="mt-5" />

            {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
          </DialogHeader>

          {summary && (
            <div className="flex max-h-96 flex-col items-start gap-2 overflow-y-scroll bg-gray-100 p-5">
              <div className="flex">
                <BotIcon className="w-10 flex-shrink-0" />
                <p className="font-semibold">
                  GPT {isPending ? "is thinking..." : "says:"}
                </p>
              </div>
              <div>
                {isPending ? (
                  <p>Thinking...</p>
                ) : (
                  <Markdown>{summary}</Markdown>
                )}
              </div>
            </div>
          )}

          <form className="flex gap-2" onSubmit={handleAskQuestion}>
            <Input
              type="text"
              placeholder="i.e. what is this about?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={isPending || !input}>
              {isPending ? "Asking..." : "Ask question"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatToDocument;
