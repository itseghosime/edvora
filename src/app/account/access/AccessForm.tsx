"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/query/hooks";
export default function AccessForm() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [admission, setAdmission] = useState("");
  const initialized=useRef(false);
  useEffect(() => {
    if(initialized.current)return;
    initialized.current=true;
    const proof = window.location.hash.slice(1);
    setToken(/^[A-Za-z0-9_-]{43}$/.test(proof) ? proof : null);
    setReady(true);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const input =
    "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3";
  return (
    <main className="min-h-screen flex items-center justify-center p-5">
      <section className="w-full max-w-md rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-8 space-y-5">
        <Link href="/" className="text-2xl font-bold text-primary">
          edvora.
        </Link>
        <h1 className="text-2xl font-bold">Student account access</h1>
        {!ready ? (
          <p role="status">Checking access link…</p>
        ) : admission ? (
          <>
            <p role="status" className="text-primary">
              Password saved for {admission}. Sign in with this admission number
              and your new password.
            </p>
            <Link
              className="inline-block rounded-xl bg-primary text-on-primary px-5 py-3"
              href="/login"
            >
              Go to sign in
            </Link>
          </>
        ) : !token ? (
          <>
            <p className="text-on-surface-variant">
              For first-time access or a forgotten password, contact the school
              office. An administrator will verify the guardian and issue a
              private, single-use setup link. Date of birth cannot be used to
              sign in.
            </p>
            <Link
              className="block font-semibold text-primary underline"
              href="/contact"
            >
              Contact the school office
            </Link>
            <Link className="block text-primary underline" href="/login">
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-on-surface-variant">
              Choose a password of 12–128 characters for this Student account.
              Parents use the same account to view fees and make payments. The
              link expires 30 minutes after it was issued.
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
                  const result = await api<{ admissionNumber: string }>(
                    "/api/auth/student-access/redeem",
                    { token, password },
                  );
                  setAdmission(result.admissionNumber);
                  setPassword("");
                  setConfirm("");
                  setToken(null);
                } catch (err) {
                  setError(
                    (err instanceof Error
                      ? err.message
                      : "Unable to save password.") +
                      " If you already saved a password, try signing in.",
                  );
                } finally {
                  setPending(false);
                }
              }}
            >
              {error && (
                <p role="alert" className="text-error text-sm">
                  {error}
                </p>
              )}
              <label className="block space-y-1">
                <span>New password</span>
                <input
                  className={input}
                  type="password" disabled={pending}
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="block space-y-1">
                <span>Confirm password</span>
                <input
                  className={input}
                  type="password" disabled={pending}
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              <button
                disabled={pending}
                className="w-full rounded-xl bg-primary text-on-primary font-semibold py-3 disabled:opacity-50"
              >
                {pending ? "Saving password…" : "Set password"}
              </button>
            </form>
            <Link href="/login" className="text-primary underline">
              Back to sign in
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
