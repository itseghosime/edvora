import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "Unable to fetch the latest records. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-8 px-6 text-center flex flex-col items-center justify-center bg-rose-50/40 rounded-2xl border border-rose-200">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-ink font-heading">{title}</h3>
      <p className="mt-1 text-sm text-rose-800/80 max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-ink text-sm font-semibold rounded-xl border border-ink-border hover:bg-ivory shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-forest" />
          Retry
        </button>
      )}
    </div>
  );
}

