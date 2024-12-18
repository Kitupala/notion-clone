"use client";

import * as Y from "yjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";

type TranslationLanguage =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "portuguese"
  | "japanese"
  | "swedish"
  | "italian";

const translationLanguages: TranslationLanguage[] = [
  "english",
  "spanish",
  "french",
  "german",
  "chinese",
  "arabic",
  "portuguese",
  "japanese",
  "swedish",
  "italian",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        },
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Translated summary successfully!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the document</DialogTitle>
          <DialogDescription>
            Select a language and AI will translate a summary of the document in
            the selected language.
          </DialogDescription>

          <hr className="mt-5" />
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
              {isPending ? <p>Thinking...</p> : <Markdown>{summary}</Markdown>}
            </div>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>

            <SelectContent>
              {translationLanguages.map((language) => (
                <SelectItem value={language} key={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default TranslateDocument;
