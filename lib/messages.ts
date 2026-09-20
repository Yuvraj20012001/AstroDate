import { supabase } from "./supabase";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ConversationPreview {
  otherUserId: string;
  otherUsername: string;
  otherName: string;
  lastMessage: string;
  lastAt: string;
}

/** All messages between two user ids, oldest first. */
export async function getConversation(userId: string, otherId: string): Promise<Message[]> {
  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${userId})`
    )
    .order("created_at", { ascending: true });

  return (data || []).map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
  }));
}

/** One row per person this user has exchanged messages with, most recent first. */
export async function getConversationsList(userId: string): Promise<ConversationPreview[]> {
  const { data } = await supabase
    .from("messages")
    .select("sender_id, recipient_id, content, created_at")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return [];

  const seen = new Map<string, { content: string; createdAt: string }>();
  for (const m of data) {
    const otherId = m.sender_id === userId ? m.recipient_id : m.sender_id;
    if (!seen.has(otherId)) {
      seen.set(otherId, { content: m.content, createdAt: m.created_at });
    }
  }

  const otherIds = Array.from(seen.keys());
  const { data: people } = await supabase
    .from("users")
    .select("id, username, name")
    .in("id", otherIds);

  return (people || [])
    .map((p) => ({
      otherUserId: p.id,
      otherUsername: p.username,
      otherName: p.name,
      lastMessage: seen.get(p.id)!.content,
      lastAt: seen.get(p.id)!.createdAt,
    }))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
}
