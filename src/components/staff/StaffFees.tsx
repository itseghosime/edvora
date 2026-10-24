"use client";
import { useState } from "react";
import PageHeader from "../shared/PageHeader";
import { formatNaira } from "@/lib/utils";
import {
  Panel,
  Field,
  Empty,
  DataTable,
  Feedback,
  ClassSelect,
  Guard,
  inputClass,
  buttonClass,
  secondaryClass,
  useStaffAction,
  useStaffData,
} from "./StaffUI";
export default function StaffFees() {
  const data = useStaffData();
  const action = useStaffAction();
  const [form, setForm] = useState({ classId: "", name: "", amount: "" });
  const [reduction, setReduction] = useState({
    assignmentId: "",
    amount: "",
    adjustmentType: "waiver",
    reason: "",
  });
  if (!data) return null;
  return (
    <Guard data={data} roles={["admin", "bursar"]}>
      <div className="space-y-6">
        <PageHeader
          title="Fees & billing"
          subtitle="Set class fee plans, assign fees and record authorized reductions."
        />
        <Feedback action={action} />
        {!data.currentTerm ? (
          <Empty>
            Ask the school administrator to open a term in School Settings
            before creating fees.
          </Empty>
        ) : (
          <>
            <Panel
              title="Class fee plans"
              description="Changing a plan affects future assignments. Existing pupil charges stay unchanged until an authorized adjustment is recorded."
            >
              <form
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await action.run(
                      "save_fee_plan",
                      {
                        termId: data.termId,
                        classId: form.classId,
                        name: form.name,
                        amountMinor: Math.round(Number(form.amount) * 100),
                      },
                      "Fee plan saved.",
                    )
                  )
                    setForm({ ...form, name: "", amount: "" });
                }}
              >
                <Field label="Class">
                  <ClassSelect
                    classes={data.classes}
                    value={form.classId}
                    onChange={(classId) => setForm({ ...form, classId })}
                  />
                </Field>
                <Field label="Plan name">
                  <input
                    className={inputClass}
                    required
                    maxLength={64}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field label="Term fee (₦)">
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    max="100000000"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </Field>
                <button
                  className={buttonClass + " self-end"}
                  disabled={action.pending}
                >
                  Save fee plan
                </button>
              </form>
              {data.feePlans.length ? (
                <DataTable
                  headers={["Class", "Plan", "Term fee", "Assignment"]}
                >
                  {data.feePlans.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {data.classes.find((c) => c.id === p.classId)?.name}
                      </td>
                      <td>{p.name}</td>
                      <td>{formatNaira(p.amountMinor / 100)}</td>
                      <td>
                        <button
                          className={secondaryClass}
                          disabled={action.pending}
                          onClick={async () => {
                            await action.run(
                              "assign_fees",
                              { planId: p.id },
                              "Plan assigned to eligible pupils. Existing bills were preserved.",
                            );
                          }}
                        >
                          Assign to unbilled pupils
                        </button>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              ) : (
                <Empty>
                  No fee plans for this term. Create one for each class that
                  needs billing.
                </Empty>
              )}
            </Panel>
            <Panel
              title="Fee reductions"
              description="Reductions update the pupil’s balance and create an audit record. They cannot exceed the amount still unpaid."
            >
              <form
                className="grid sm:grid-cols-2 gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await action.run(
                      "adjust_fee",
                      {
                        assignmentId: reduction.assignmentId,
                        amountMinor: Math.round(Number(reduction.amount) * 100),
                        adjustmentType: reduction.adjustmentType,
                        reason: reduction.reason,
                      },
                      "Reduction saved and pupil balance updated.",
                    )
                  )
                    setReduction({ ...reduction, amount: "", reason: "" });
                }}
              >
                <Field label="Pupil bill">
                  <select
                    className={inputClass}
                    required
                    value={reduction.assignmentId}
                    onChange={(e) =>
                      setReduction({
                        ...reduction,
                        assignmentId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select an assigned bill</option>
                    {data.assignments.map((a) => {
                      const p = data.pupils.find((p) => p.id === a.pupilId);
                      return (
                        <option key={a.id} value={a.id}>
                          {p?.fullName} · {p?.classGrade} ·{" "}
                          {formatNaira(p?.balance ?? 0)} unpaid
                        </option>
                      );
                    })}
                  </select>
                </Field>
                <Field label="Reduction (₦)">
                  <input
                    className={inputClass}
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={reduction.amount}
                    onChange={(e) =>
                      setReduction({ ...reduction, amount: e.target.value })
                    }
                  />
                </Field>
                <Field label="Type">
                  <select
                    className={inputClass}
                    value={reduction.adjustmentType}
                    onChange={(e) =>
                      setReduction({
                        ...reduction,
                        adjustmentType: e.target.value,
                      })
                    }
                  >
                    {[
                      "waiver",
                      "scholarship",
                      "staff_discount",
                      "sibling_discount",
                      "correction",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Reason">
                  <input
                    className={inputClass}
                    required
                    minLength={3}
                    maxLength={1000}
                    value={reduction.reason}
                    onChange={(e) =>
                      setReduction({ ...reduction, reason: e.target.value })
                    }
                  />
                </Field>
                <button
                  className={buttonClass + " justify-self-start"}
                  disabled={action.pending || !data.assignments.length}
                >
                  Save reduction
                </button>
              </form>
            </Panel>
            <Panel title="Current pupil bills">
              {data.assignments.length ? (
                <DataTable
                  headers={[
                    "Pupil",
                    "Class",
                    "Original charge",
                    "Adjusted charge",
                    "Verified paid",
                    "Balance",
                  ]}
                >
                  {data.assignments.map((a) => {
                    const p = data.pupils.find((p) => p.id === a.pupilId);
                    return (
                      <tr key={a.id}>
                        <td>{p?.fullName}</td>
                        <td>{p?.classGrade}</td>
                        <td>{formatNaira(a.baseAmountMinor / 100)}</td>
                        <td>{formatNaira(a.amountMinor / 100)}</td>
                        <td>{formatNaira(p?.paid ?? 0)}</td>
                        <td className="font-semibold">
                          {formatNaira(p?.balance ?? 0)}
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
              ) : (
                <Empty>No pupils have been billed for this term.</Empty>
              )}
            </Panel>
          </>
        )}
      </div>
    </Guard>
  );
}
