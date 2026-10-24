"use client";
import { useState } from "react";
import PageHeader from "../shared/PageHeader";
import { formatDate } from "@/lib/utils";
import {
  Panel,
  Field,
  Empty,
  DataTable,
  Badge,
  Feedback,
  Guard,
  inputClass,
  buttonClass,
  secondaryClass,
  useStaffAction,
  useStaffData,
} from "./StaffUI";
export default function StaffReminders() {
  const data = useStaffData();
  const action = useStaffAction();
  const [form, setForm] = useState({
    name: "",
    days: "7",
    minimum: "1000",
    sms: true,
    telegram: false,
  });
  if (!data) return null;
  return (
    <Guard data={data} roles={["admin", "bursar"]}>
      <div className="space-y-6">
        <PageHeader
          title="Reminders & notices"
          subtitle="SMS and Telegram notification preferences and delivery history."
        />
        <Feedback action={action} />
        <Panel
          title="Fee reminder rules"
          description="New rules start paused. Enabling a rule makes it eligible for the automation worker; it does not send a message from this page."
        >
          {!data.termId ? (
            <Empty>Open an academic term before adding reminder rules.</Empty>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  await action.run(
                    "save_reminder",
                    {
                      name: form.name,
                      termId: data.termId,
                      daysBeforeEnd: Number(form.days),
                      minimumMinor: Math.round(Number(form.minimum) * 100),
                      channels: [
                        ...(form.sms ? ["sms"] : []),
                        ...(form.telegram ? ["telegram"] : []),
                      ],
                    },
                    "Reminder rule saved in paused status.",
                  )
                )
                  setForm({ ...form, name: "" });
              }}
            >
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Rule name">
                  <input
                    className={inputClass}
                    required
                    maxLength={64}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field label="Days before term end">
                  <input
                    className={inputClass}
                    type="number"
                    required
                    min="0"
                    max="90"
                    step="1"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                  />
                </Field>
                <Field label="Minimum unpaid balance (₦)">
                  <input
                    className={inputClass}
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.minimum}
                    onChange={(e) =>
                      setForm({ ...form, minimum: e.target.value })
                    }
                  />
                </Field>
              </div>
              <fieldset className="flex gap-5 text-sm">
                <legend className="mb-2 font-medium">Channels</legend>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={form.sms}
                    onChange={(e) =>
                      setForm({ ...form, sms: e.target.checked })
                    }
                  />
                  SMS
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={form.telegram}
                    onChange={(e) =>
                      setForm({ ...form, telegram: e.target.checked })
                    }
                  />
                  Telegram
                </label>
              </fieldset>
              <button
                className={buttonClass}
                disabled={action.pending || (!form.sms && !form.telegram)}
              >
                Save paused rule
              </button>
            </form>
          )}
          {data.rules.length ? (
            <DataTable
              headers={["Rule", "Channels", "Timing", "Status", "Action"]}
            >
              {data.rules.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.title}</td>
                  <td>{r.channel === "Both" ? "SMS + Telegram" : r.channel}</td>
                  <td>
                    {r.triggerCondition.replace(
                      "before due",
                      "before term end",
                    )}
                  </td>
                  <td>
                    <Badge>{r.isActive ? "Enabled" : "Paused"}</Badge>
                  </td>
                  <td>
                    <button
                      className={secondaryClass}
                      disabled={action.pending}
                      onClick={() =>
                        void action.run(
                          "toggle_reminder",
                          { ruleId: r.id, isActive: !r.isActive },
                          r.isActive
                            ? "Rule paused."
                            : "Rule enabled for the automation worker.",
                        )
                      }
                    >
                      {r.isActive ? "Pause" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <Empty>No reminder rules for this term.</Empty>
          )}
        </Panel>
        <Panel
          title="Delivery history"
          description="A provider accepting a message is different from confirming delivery. Only recorded outcomes are shown."
        >
          {data.logs.length ? (
            <DataTable
              headers={[
                "Pupil",
                "Channel",
                "Recipient",
                "Status",
                "Date",
                "Details",
              ]}
            >
              {data.logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.pupilName || "—"}</td>
                  <td>{l.channel}</td>
                  <td>{l.guardianPhone}</td>
                  <td>
                    <Badge>{l.status}</Badge>
                  </td>
                  <td>{formatDate(l.timestamp)}</td>
                  <td>{l.details || "—"}</td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <Empty>
              No delivery attempts have been recorded. Automation schedules
              remain managed separately in n8n.
            </Empty>
          )}
        </Panel>
      </div>
    </Guard>
  );
}
