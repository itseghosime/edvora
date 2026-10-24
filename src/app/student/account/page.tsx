"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/query/hooks";
export default function StudentAccount() {
  const router = useRouter();
  const cache = useQueryClient();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <section className="max-w-xl rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 space-y-5">
      <h1 className="text-2xl font-bold">Account security</h1>
      <p className="text-sm text-on-surface-variant">
        Changing the password signs out every session for this Student account.
        Sign in again with your new password.
      </p>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (password !== confirm) {
            setError("Passwords do not match.");
            return;
          }
          setPending(true);
          try {
            await api("/api/auth/student-password", {
              currentPassword: current,
              password,
            });
            cache.clear();
            router.replace("/login");
            router.refresh();
          } catch (err) {
            setError(
              (err instanceof Error
                ? err.message
                : "Unable to change password.") +
                " If the save completed, sign in with your new password.",
            );
            setPending(false);
          }
        }}
      >
        {error && (
          <p role="alert" className="text-error text-sm">
            {error}
          </p>
        )}
        {[
          ["Current password", current, setCurrent, "current-password"],
          ["New password", password, setPassword, "new-password"],
          ["Confirm password", confirm, setConfirm, "new-password"],
        ].map(([label, value, setter, autocomplete]) => (
          <label key={label as string} className="block space-y-1">
            <span>{label as string}</span>
            <input
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3"
              type="password" disabled={pending}
              required
              autoComplete={autocomplete as string}
              minLength={autocomplete === "new-password" ? 12 : 1}
              maxLength={128}
              value={value as string}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
            />
          </label>
        ))}
        <button
          className="rounded-xl bg-primary px-5 py-3 text-on-primary font-semibold disabled:opacity-50"
          disabled={pending}
        >
          {pending ? "Saving…" : "Change password and sign out"}
        </button>
      </form>
      <Link href="/account/access" className="block text-primary underline">
        Forgot your password? Contact the school
      </Link>
    </section>
  );
}
