import Link from "next/link";
import { signupAction } from "@/app/actions";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-cardLine rounded-2xl p-7 shadow-lg shadow-pink-100">
        <h1 className="font-display text-3xl font-bold gradient-text mb-1">Create your profile</h1>
        <p className="text-sm text-inkSoft mb-5">
          Your birth details are used only to calculate your chart — nothing else is required.
        </p>

        {searchParams.error && (
          <p className="mb-4 rounded-xl bg-red-50 border border-red-200 text-bad text-sm px-3 py-2">
            {searchParams.error}
          </p>
        )}

        <form action={signupAction} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">Your name</label>
            <input name="name" type="text" required placeholder="e.g. Arjun" />
          </div>

          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">Username</label>
            <input
              name="username"
              type="text"
              required
              pattern="[a-z0-9_]{3,20}"
              title="3-20 characters: lowercase letters, numbers, underscore"
              placeholder="lowercase, no spaces"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">Password</label>
            <input name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-inkSoft mb-1">I am</label>
              <select name="gender" required defaultValue="">
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-inkSoft mb-1">Looking for</label>
              <select name="looking_for" required defaultValue="">
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-inkSoft mb-1">Date of birth</label>
              <input name="date_of_birth" type="date" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-inkSoft mb-1">Time of birth</label>
              <input name="time_of_birth" type="time" required />
            </div>
          </div>
          <p className="text-xs text-inkSoft -mt-2">Assumed to be Indian Standard Time (UTC+5:30).</p>

          <div>
            <label className="block text-xs font-bold text-inkSoft mb-1">City</label>
            <input name="city" type="text" required placeholder="e.g. Hyderabad" />
          </div>

          <label className="flex items-start gap-2 text-sm text-ink pt-1">
            <input type="checkbox" name="is_adult" required className="mt-1 w-auto" />
            I confirm I am 18 years of age or older.
          </label>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-bold shadow-lg shadow-pink-200 hover:opacity-90 transition-opacity"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-inkSoft mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-accent2 font-bold">Log in</Link>
        </p>
      </div>
    </main>
  );
}
