"use client";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../shared/PageHeader";
import ResultReport from "../shared/ResultReport";
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
import type { TermResultRecord } from "@/lib/mockData";
import type { PortalSnapshot } from "@/lib/types/portal";
function ResultEditor({
  data,
  pupilId,
  onClose,
}: {
  data: PortalSnapshot;
  pupilId: string;
  onClose: () => void;
}) {
  const editorRef = useRef<HTMLElement>(null);
  useEffect(() => {
    editorRef.current?.focus({ preventScroll: true });
    editorRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [pupilId]);
  const existing = data.results.find((r) => r.pupilId === pupilId);
  const action = useStaffAction();
  const [subjects, setSubjects] = useState(
    existing?.subjects.map((s) => ({
      subject: s.subject,
      ca: String(s.continuousAssessment),
      exam: String(s.examScore),
    })) ?? [{ subject: "", ca: "", exam: "" }],
  );
  const [teacherComment, setTeacherComment] = useState(
    existing?.teacherComment ?? "",
  );
  const [headComment, setHeadComment] = useState(
    existing?.headTeacherComment ?? "",
  );
  return (
    <section ref={editorRef} tabIndex={-1} aria-label="Report editor" className="scroll-mt-40 my-6">
    <Panel
      title={`Report editor · ${data.pupils.find((p) => p.id === pupilId)?.fullName}`}
      description="Continuous assessment is out of 40; examination is out of 60. Totals and grades are calculated when saved."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void action.run(
            "save_result",
            {
              pupilId,
              termId: data.termId,
              subjects: subjects.map((s) => ({
                subject: s.subject,
                ca: Number(s.ca),
                exam: Number(s.exam),
              })),
              teacherComment,
              ...(data.staffRole === "admin" ? { headComment } : {}),
            },
            "Draft saved. Submit it for review when ready.",
          );
        }}
      >
        <Feedback action={action} />
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div
              className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end"
              key={i}
            >
              <Field label={`Subject ${i + 1}`}>
                <input
                  className={inputClass}
                  required
                  maxLength={64}
                  value={s.subject}
                  onChange={(e) =>
                    setSubjects(
                      subjects.map((v, n) =>
                        n === i ? { ...v, subject: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="CA /40">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  max="40"
                  step="0.01"
                  required
                  value={s.ca}
                  onChange={(e) =>
                    setSubjects(
                      subjects.map((v, n) =>
                        n === i ? { ...v, ca: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Exam /60">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  max="60"
                  step="0.01"
                  required
                  value={s.exam}
                  onChange={(e) =>
                    setSubjects(
                      subjects.map((v, n) =>
                        n === i ? { ...v, exam: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <button
                type="button"
                disabled={subjects.length === 1 || action.pending}
                className={secondaryClass}
                aria-label={`Remove subject ${i + 1}`}
                onClick={() => setSubjects(subjects.filter((_, n) => n !== i))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={secondaryClass}
          disabled={subjects.length >= 30}
          onClick={() =>
            setSubjects([...subjects, { subject: "", ca: "", exam: "" }])
          }
        >
          Add subject
        </button>
        <Field label="Teacher remarks">
          <textarea
            className={inputClass}
            maxLength={2000}
            value={teacherComment}
            onChange={(e) => setTeacherComment(e.target.value)}
          />
        </Field>
        {data.staffRole === "admin" && (
          <Field label="Head teacher remarks">
            <textarea
              className={inputClass}
              maxLength={2000}
              value={headComment}
              onChange={(e) => setHeadComment(e.target.value)}
            />
          </Field>
        )}
        <div className="flex gap-3">
          <button className={buttonClass} disabled={action.pending}>
            {action.pending ? "Saving…" : "Save draft"}
          </button>
          <button
            type="button"
            disabled={action.pending}
            className={secondaryClass}
            onClick={onClose}
          >
            Close editor
          </button>
        </div>
      </form>
    </Panel>
    </section>
  );
}
export default function StaffResults() {
  const data = useStaffData();
  const action = useStaffAction();
  const [pupilId, setPupilId] = useState("");
  const [editing, setEditing] = useState("");
  const [preview, setPreview] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [correction, setCorrection] = useState("");
  const [reason, setReason] = useState("");
  const [accessReport, setAccessReport] = useState("");
  const [allowAccess, setAllowAccess] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  if (!data) return null;
  const admin = data.staffRole === "admin";
  const rows = data.pupils.filter(
    (p) => !classFilter || p.classId === classFilter,
  );
  const selected = data.results.find((r) => r.id === preview);
  function transition(result: TermResultRecord, status: string) {
    void action.run(
      "set_result_status",
      { resultId: result.id, status },
      status === "published"
        ? "Report published. Student access follows fee clearance or an administrator override."
        : "Report submitted for administrator review.",
    );
  }
  return (
    <Guard data={data} roles={["admin", "teacher"]}>
      <div className="space-y-6">
        <PageHeader
          title="Results & grading"
          subtitle="Draft → administrator review → publication. Unpaid term fees lock Student access automatically; administrators can approve an exception."
        />
        <Feedback action={action} />
        {!data.currentTerm ? (
          <Empty>
            The administrator must open a term before entering results.
          </Empty>
        ) : (
          <>
            <Panel title="Report workspace">
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Class">
                  <select
                    className={inputClass}
                    value={classFilter}
                    onChange={(e) => {
                      setClassFilter(e.target.value);
                      setPupilId("");
                      setEditing("");
                      setPreview("");
                    }}
                  >
                    <option value="">All assigned classes</option>
                    {data.classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Start or edit a report">
                  <select
                    className={inputClass}
                    value={pupilId}
                    onChange={(e) => setPupilId(e.target.value)}
                  >
                    <option value="">Select pupil</option>
                    {rows
                      .filter((p) => {
                        const r = data.results.find((r) => r.pupilId === p.id);
                        return (
                          !r || ["Draft", "Under Correction"].includes(r.status)
                        );
                      })
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} · {p.classGrade}
                        </option>
                      ))}
                  </select>
                </Field>
                <button
                  className={buttonClass + " self-end"}
                  disabled={!pupilId}
                  onClick={() => {
                    setEditing(pupilId);
                    setPreview("");
                  }}
                >
                  Open editor
                </button>
              </div>
            {editing && (
              <ResultEditor
                key={editing}
                data={data}
                pupilId={editing}
                onClose={() => setEditing("")}
              />
            )}
              {rows.length ? (
                <DataTable
                  headers={["Pupil", "Class", "Report", "Average", ...(admin ? ["Student access"] : []), "Actions"]}
                >
                  {rows.map((p) => {
                    const r = data.results.find((r) => r.pupilId === p.id);
                    const access = data.resultAccess?.find(a => a.pupilId === p.id);
                    return (
                      <tr key={p.id}>
                        <td className="font-semibold">{p.fullName}</td>
                        <td>{p.classGrade}</td>
                        <td>
                          <Badge>{r?.status ?? "Not started"}</Badge>
                        </td>
                        <td>{r ? `${r.percentage}%` : "—"}</td>
                        {admin && <td><Badge>{r?.status !== "Published" ? "Not published" : access?.overridden ? "Admin override" : access?.locked ? "Locked · unpaid fees" : "Available"}</Badge></td>}
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {admin && r?.status === "Published" && (access?.locked || access?.overridden) && <button className={secondaryClass} disabled={action.pending} onClick={()=>{setAccessReport(r.id);setAllowAccess(!access?.overridden);setAccessReason("");}}>{access?.overridden ? "Remove access override" : "Allow result access"}</button>}
                            {r && (
                              <button
                                className={secondaryClass}
                                onClick={() => {
                                  setPreview(r.id);
                                  setEditing("");
                                }}
                              >
                                Preview
                              </button>
                            )}
                            {(!r ||
                              ["Draft", "Under Correction"].includes(
                                r.status,
                              )) && (
                              <button
                                className={secondaryClass}
                                onClick={() => {
                                  setEditing(p.id);
                                  setPreview("");
                                }}
                              >
                                Edit
                              </button>
                            )}
                            {r &&
                              ["Draft", "Under Correction"].includes(
                                r.status,
                              ) && (
                                <button
                                  disabled={action.pending}
                                  className={secondaryClass}
                                  onClick={() => transition(r, "under_review")}
                                >
                                  Submit for review
                                </button>
                              )}
                            {r?.status === "Under Review" && admin && (
                              <button
                                className={buttonClass}
                                disabled={action.pending}
                                onClick={() => transition(r, "published")}
                              >
                                Publish
                              </button>
                            )}
                            {r &&
                              admin &&
                              ["Under Review", "Published"].includes(
                                r.status,
                              ) && (
                                <button
                                  className={secondaryClass}
                                  onClick={() => {
                                    setCorrection(r.id);
                                    setReason("");
                                  }}
                                >
                                  Return for correction
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </DataTable>
              ) : (
                <Empty>No pupils in this class.</Empty>
              )}
            </Panel>
            {admin && accessReport && <Panel title={allowAccess ? "Approve result access despite unpaid fees" : "Remove result access override"} description="This exception applies only to the selected pupil’s report for this term. It does not waive fees or publish a draft.">
              <form className="space-y-4" onSubmit={async e=>{e.preventDefault();if(await action.run("set_result_fee_override",{resultId:accessReport,allowAccess,reason:accessReason},allowAccess ? "Access override saved. The published report is now available to this pupil." : "Override removed. Automatic fee clearance applies again."))setAccessReport("");}}>
                <p className="font-semibold">{data.results.find(r=>r.id===accessReport)?.pupilName} · {data.currentTerm?.name} · {data.currentTerm?.sessionName}</p>
                <Field label="Reason for access change"><textarea className={inputClass} required minLength={3} maxLength={1000} value={accessReason} onChange={e=>setAccessReason(e.target.value)} /></Field>
                <div className="flex gap-3"><button className={buttonClass} disabled={action.pending}>{allowAccess ? "Confirm access override" : "Confirm remove override"}</button><button type="button" className={secondaryClass} disabled={action.pending} onClick={()=>setAccessReport("")}>Cancel access change</button></div>
              </form>
            </Panel>}
            {correction && (
              <Panel
                title="Return report for correction"
                description="Published reports are hidden from the Student portal until corrected and republished. Queued publication notices are canceled."
              >
                <form
                  className="space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (
                      await action.run(
                        "set_result_status",
                        {
                          resultId: correction,
                          status: "under_correction",
                          reason,
                        },
                        "Report returned for correction.",
                      )
                    )
                      setCorrection("");
                  }}
                >
                  <Field label="Reason for correction">
                    <textarea
                      className={inputClass}
                      required
                      minLength={3}
                      maxLength={1000}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Field>
                  <div className="flex gap-3">
                    <button disabled={action.pending} className={buttonClass}>
                      Confirm return
                    </button>
                    <button
                      type="button"
                      className={secondaryClass}
                      onClick={() => setCorrection("")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Panel>
            )}

            {selected && (
              <ResultReport
                result={selected}
                showPrintButton={selected.status === "Published"}
              />
            )}
          </>
        )}
      </div>
    </Guard>
  );
}
