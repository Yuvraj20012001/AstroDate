import Link from "next/link";
import { loginAction } from "@/app/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-cardLine rounded-2xl p-7 shadow-lg shadow-pink-100">
        <h1 className="font-display text-3xl font-bold gradient-text mb-5">🔮 Log in</h1>

        {searchParams.error && (
          <p className="mb-4 rounded-xl bg-red-50 border border-red-200 text-bad text-sm px-3 py-2">
            {searchParams.error}
          </p>
        )}

        <form action={loginAction} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">Username</label>
            <input name="username" type="text" required autoFocus />
          </div>
          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">Password</label>
            <input name="password" type="password" required />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-bold shadow-lg shadow-pink-200 hover:opacity-90 transition-opacity"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-inkSoft mt-4 text-center">
          New here?{" "}
          <Link href="/signup" className="text-accent2 font-bold">Create a profile</Link>
        </p>
      </div>
    </main>
  );
}
