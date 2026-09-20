"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { fetchConversationAction, sendMessageAction } from "@/app/actions";
import type { Message } from "@/lib/messages";

const POLL_MS = 4000;

export default function ChatThread({
  meId,
  otherUsername,
  otherName,
  initialMessages,
}: {
  meId: string;
  otherUsername: string;
  otherName: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await fetchConversationAction(otherUsername);
      setMessages(fresh);
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [otherUsername]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    setError(null);
    setDraft("");
    startTransition(async () => {
      const result = await sendMessageAction(otherUsername, text);
      if (!result.ok) {
        setError(result.error || "Could not send.");
        return;
      }
      const fresh = await fetchConversationAction(otherUsername);
      setMessages(fresh);
    });
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white border border-cardLine rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-inkSoft text-sm mt-8">
            Say hi to {otherName} 👋
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === meId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={
                  "max-w-[75%] px-4 py-2 rounded-2xl text-sm " +
                  (mine
                    ? "bg-gradient-to-r from-accent to-accent2 text-white rounded-br-sm"
                    : "bg-accentSoft text-ink rounded-bl-sm")
                }
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 pb-1 text-xs text-bad">{error}</p>}

      <div className="border-t border-cardLine p-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1"
        />
        <button
          onClick={handleSend}
          disabled={isPending || !draft.trim()}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-bold text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
