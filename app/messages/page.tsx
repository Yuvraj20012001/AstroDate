import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getConversationsList } from "@/lib/messages";

export default async function InboxPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const conversations = await getConversationsList(session.userId);

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/matches" className="text-highlight text-sm">&larr; Matches</Link>
        <span className="font-display text-xl font-bold">Chats</span>
        <span className="w-16" />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {conversations.length === 0 ? (
          <div className="bg-white border border-cardLine rounded-2xl p-8 text-center text-inkSoft">
            No conversations yet — open a match's profile and say hi.
          </div>
        ) : (
          <div className="bg-white border border-cardLine rounded-2xl overflow-hidden divide-y divide-cardLine">
            {conversations.map((c) => (
              <Link
                key={c.otherUserId}
                href={`/messages/${c.otherUsername}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-accentSoft"
              >
                <div>
                  <div className="font-bold text-ink">{c.otherName}</div>
                  <div className="text-sm text-inkSoft truncate max-w-xs">{c.lastMessage}</div>
                </div>
                <div className="text-xs text-inkSoft whitespace-nowrap ml-3">
                  {new Date(c.lastAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
