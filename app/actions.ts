"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createSession, clearSession, getSession } from "@/lib/session";
import { getConversation } from "@/lib/messages";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function isAdult(dob: string): boolean {
  const dobDate = new Date(dob);
  if (Number.isNaN(dobDate.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - dobDate.getFullYear();
  const monthDiff = now.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dobDate.getDate())) age--;
  return age >= 18;
}

export async function signupAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "");
  const lookingFor = String(formData.get("looking_for") || "");
  const dateOfBirth = String(formData.get("date_of_birth") || "");
  const timeOfBirth = String(formData.get("time_of_birth") || "");
  const city = String(formData.get("city") || "").trim();
  const confirmAdult = formData.get("is_adult") === "on";

  if (!USERNAME_RE.test(username)) {
    fail("/signup", "Username must be 3-20 characters: lowercase letters, numbers, or underscore.");
  }
  if (password.length < 8) fail("/signup", "Password must be at least 8 characters.");
  if (!name) fail("/signup", "Please enter your name.");
  if (gender !== "male" && gender !== "female") fail("/signup", "Please select your gender.");
  if (lookingFor !== "male" && lookingFor !== "female") fail("/signup", "Please select who you're looking for.");
  if (!dateOfBirth || !timeOfBirth) fail("/signup", "Date and time of birth are both required for the chart.");
  if (!city) fail("/signup", "Please enter your city.");
  // The checkbox is a UX nudge; the real gate is the date-of-birth check below,
  // which can't be bypassed by simply ticking a box.
  if (!confirmAdult || !isAdult(dateOfBirth)) fail("/signup", "You must be 18 or older to use this site.");

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) fail("/signup", "That username is already taken.");

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: inserted, error } = await supabase
    .from("users")
    .insert({
      username,
      password_hash: passwordHash,
      name,
      gender,
      looking_for: lookingFor,
      date_of_birth: dateOfBirth,
      time_of_birth: timeOfBirth,
      city,
      is_adult: true,
    })
    .select("id, username")
    .single();

  if (error || !inserted) fail("/signup", "Something went wrong creating your account. Please try again.");

  await createSession({ userId: inserted.id, username: inserted.username });
  redirect("/matches");
}

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const { data: user } = await supabase
    .from("users")
    .select("id, username, password_hash")
    .eq("username", username)
    .maybeSingle();

  if (!user) fail("/login", "Incorrect username or password.");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) fail("/login", "Incorrect username or password.");

  await createSession({ userId: user.id, username: user.username });
  redirect("/matches");
}

export async function logoutAction(): Promise<void> {
  clearSession();
  redirect("/login");
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

// ---------- Messaging ----------

export async function sendMessageAction(
  recipientUsername: string,
  content: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not logged in." };

  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Message is empty." };
  if (trimmed.length > 2000) return { ok: false, error: "Message is too long." };

  const { data: recipient } = await supabase
    .from("users")
    .select("id")
    .eq("username", recipientUsername)
    .maybeSingle();
  if (!recipient) return { ok: false, error: "That user doesn't exist." };
  if (recipient.id === session.userId) return { ok: false, error: "You can't message yourself." };

  const { error } = await supabase.from("messages").insert({
    sender_id: session.userId,
    recipient_id: recipient.id,
    content: trimmed,
  });

  if (error) return { ok: false, error: "Message could not be sent. Try again." };
  return { ok: true };
}

export async function fetchConversationAction(otherUsername: string) {
  const session = await getSession();
  if (!session) return [];

  const { data: other } = await supabase
    .from("users")
    .select("id")
    .eq("username", otherUsername)
    .maybeSingle();
  if (!other) return [];

  return getConversation(session.userId, other.id);
}
