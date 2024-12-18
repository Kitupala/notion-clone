"use client";

import { cn } from "@/lib/utils";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "@/components/TranslateDocument";
import ChatToDocument from "@/components/ChatToDocument";

type BlockNoteProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: BlockNoteProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToColor(userInfo.email),
      },
    },
  });

  return (
    <div className="relative mx-auto max-w-6xl">
      <BlockNoteView
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        className="min-h-screen"
      />
    </div>
  );
}

const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex items-center justify-end gap-2">
        <TranslateDocument doc={doc} />
        <ChatToDocument doc={doc} />

        {/*  Dark Mode*/}
        <Button
          className={cn(
            "text-gray-700",
            darkMode
              ? "bg-gray-300 hover:bg-gray-100"
              : "bg-gray-200 hover:bg-gray-300",
          )}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};

export default CollaborativeEditor;
