"use client";
import { useRef, useState } from "react";
import { api } from "@/lib/query/hooks";
import {
  Panel,
  Field,
  inputClass,
  buttonClass,
  secondaryClass,
} from "./StaffUI";
export default function StudentAccessIssuer({
  pupilId,
  name,
  onClose,
}: {
  pupilId: string;
  name: string;
  onClose: () => void;
}) {
  const requestId = useRef<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [access, setAccess] = useState<{
    activationUrl: string;
    expiresAt: string;
    admissionNumber: string;
  } | null>(null);
  return (
    <Panel
      title={`Student access · ${name}`}
      description="Verify the guardian’s identity before creating a setup or recovery link. Issuing a link locks the old password and signs out existing sessions."
    >
      {error && (
        <p role="alert" className="text-error text-sm">
          {error}
        </p>
      )}
      {access ? (
        <div className="space-y-4">
          <p role="status" className="text-primary">
            Access link ready for {access.admissionNumber}. Expires{" "}
            {new Date(access.expiresAt).toLocaleString()}.
          </p>
          <Field label="Private setup link">
            <input
              className={inputClass}
              readOnly
              value={access.activationUrl}
              onFocus={(e) => e.target.select()}
            />
          </Field>
          <p className="text-sm text-on-surface-variant">
            Share privately with the verified guardian. The link works once and
            lets them choose their own password. No message has been sent
            automatically.
          </p>
          <button
            type="button"
            className={buttonClass}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(access.activationUrl);
                setCopied(true);
              } catch {
                setError("Select and copy the link above.");
              }
            }}
          >
            {copied ? "Link copied" : "Copy access link"}
          </button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!verified || pending) return;
            setPending(true);
            setError("");
            requestId.current ??= crypto.randomUUID();
            try {
              setAccess(
                await api("/api/auth/student-access", {
                  pupilId,
                  requestId: requestId.current,
                  verifiedGuardian: true,
                  reason,
                }),
              );
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Unable to create access link.",
              );
            } finally {
              setPending(false);
            }
          }}
        >
          <Field label="Reason for setup or recovery">
            <input
              className={inputClass}
              required
              minLength={3}
              maxLength={500}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                requestId.current = null;
              }}
            />
          </Field>
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox" disabled={pending}
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            I have verified this pupil’s guardian using the school’s
            identity-check process.
          </label>
          <button className={buttonClass} disabled={pending || !verified}>
            {pending ? "Creating link…" : "Issue setup / recovery link"}
          </button>
        </form>
      )}
      <button
        type="button"
        className={secondaryClass}
        disabled={pending}
        onClick={onClose}
      >
        Close access panel
      </button>
    </Panel>
  );
}
