import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { getConversation } from "@/lib/messages";
import ChatThread from "./ChatThread";

export default async function ChatPage({ params }: { params: { username: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: other } = await supabase
    .from("users")
    .select("id, username, name")
    .eq("username", params.username)
    .maybeSingle();
  if (!other) notFound();

  const initialMessages = await getConversation(session.userId, other.id);

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/messages" className="text-highlight text-sm">&larr; All chats</Link>
        <span className="font-display font-bold">{other.name}</span>
        <Link href={`/matches/${other.username}`} className="text-highlight text-sm">
          Profile
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <ChatThread
          meId={session.userId}
          otherUsername={other.username}
          otherName={other.name}
          initialMessages={initialMessages}
        />
      </div>
    </main>
  );
}
