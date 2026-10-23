import React from "react";
import { ReminderLog } from "@/lib/mockData";
import { MessageSquare, Smartphone, Check, Clock, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface DeliveryTimelineProps {
  logs: ReminderLog[];
}

export default function DeliveryTimeline({ logs }: DeliveryTimelineProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-ink-border shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-ink font-heading">
          Recent Delivery Outcomes
        </h3>
        <p className="text-xs text-ink-muted mt-0.5">
          Termii SMS & Telegram dispatch audits
        </p>
      </div>

      <div className="divide-y divide-ink-border/50">
        {logs.map((log) => (
          <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  log.channel === "Telegram"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {log.channel === "Telegram" ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-ink">
                  {log.pupilName}
                </div>
                <div className="text-[11px] text-ink-muted">
                  {log.guardianPhone} • {log.channel}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-1">
              <StatusBadge status={log.status} size="sm" />
              {log.details && (
                <span className="text-[10px] text-ink-muted max-w-xs truncate hidden sm:inline-block">
                  {log.details}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

