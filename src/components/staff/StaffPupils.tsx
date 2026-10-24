"use client";
import { useState } from "react";
import StudentAccessIssuer from "./StudentAccessIssuer";
import PageHeader from "../shared/PageHeader";
import { formatNaira } from "@/lib/utils";
import {
  Panel,
  Field,
  Empty,
  DataTable,
  Badge,
  Feedback,
  ClassSelect,
  inputClass,
  buttonClass,
  secondaryClass,
  useStaffAction,
  useStaffData,
  downloadCSV,
} from "./StaffUI";
export default function StaffPupils() {
  const data = useStaffData();
  const action = useStaffAction();
  const [accessPupil, setAccessPupil] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [admission, setAdmission] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    classId: "",
    gender: "male",
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    smsConsent: false,
  });
  if (!data) return null;
  const admin = data.staffRole === "admin";
  const financial = data.staffRole !== "teacher";
  const rows = data.pupils.filter(
    (p) =>
      (!classFilter || p.classId === classFilter) &&
      `${p.fullName} ${p.admissionNo} ${p.guardianName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pupils & guardians"
        subtitle="Enrollment, pupil accounts and guardian contacts."
        actions={
          admin ? (
            <button className={buttonClass} onClick={() => setOpen((v) => !v)}>
              {open ? "Close enrollment" : "Enroll pupil"}
            </button>
          ) : undefined
        }
      />
      <Feedback action={action} />
      {admin && accessPupil && (
        <StudentAccessIssuer
          key={accessPupil}
          pupilId={accessPupil}
          name={
            data.pupils.find((p) => p.id === accessPupil)?.fullName ?? "Pupil"
          }
          onClose={() => setAccessPupil(null)}
        />
      )}
      {admission && (
        <p role="status" className="bg-primary/10 p-4 rounded-xl text-primary">
          Admission number: <strong>{admission}</strong>. Issue a private setup
          link so the family can choose a password.
        </p>
      )}
      {open && admin && (
        <Panel
          title="Enroll a pupil"
          description="The pupil and guardian are saved together. A configured fee plan is assigned automatically for the current term."
        >
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await action.run(
                "register_pupil",
                form,
                "Pupil enrolled.",
              );
              if (result) {
                setAdmission(result.admissionNumber ?? "");
                setOpen(false);
                setForm({
                  ...form,
                  firstName: "",
                  lastName: "",
                  dateOfBirth: "",
                  guardianName: "",
                  guardianPhone: "",
                  guardianEmail: "",
                  smsConsent: false,
                });
              }
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name">
                <input
                  className={inputClass}
                  required
                  maxLength={64}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClass}
                  required
                  maxLength={64}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </Field>
              <Field label="Class">
                <ClassSelect
                  classes={data.classes}
                  value={form.classId}
                  onChange={(classId) => setForm({ ...form, classId })}
                />
              </Field>
              <Field label="Date of birth">
                <input
                  className={inputClass}
                  required
                  type="date"
                  min="1900-01-01"
                  max={new Date().toISOString().slice(0, 10)}
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm({ ...form, dateOfBirth: e.target.value })
                  }
                />
              </Field>
              <Field label="Gender">
                <select
                  className={inputClass}
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
              <Field label="Guardian name">
                <input
                  className={inputClass}
                  required
                  maxLength={128}
                  value={form.guardianName}
                  onChange={(e) =>
                    setForm({ ...form, guardianName: e.target.value })
                  }
                />
              </Field>
              <Field label="Guardian phone (international format)">
                <input
                  className={inputClass}
                  type="tel"
                  required
                  placeholder="+2348012345678"
                  pattern="\+[1-9][0-9]{7,14}"
                  value={form.guardianPhone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      guardianPhone: e.target.value.replace(/\s/g, ""),
                    })
                  }
                />
              </Field>
              <Field label="Guardian email (optional)">
                <input
                  className={inputClass}
                  type="email"
                  maxLength={128}
                  value={form.guardianEmail}
                  onChange={(e) =>
                    setForm({ ...form, guardianEmail: e.target.value })
                  }
                />
              </Field>
            </div>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.smsConsent}
                onChange={(e) =>
                  setForm({ ...form, smsConsent: e.target.checked })
                }
              />
              The guardian has agreed to receive school SMS notifications.
            </label>
            <button
              disabled={action.pending || !data.classes.length}
              className={buttonClass}
            >
              {action.pending ? "Saving enrollment…" : "Save enrollment"}
            </button>
            {!data.classes.length && (
              <Empty>
                Create a class in School Settings before enrolling a pupil.
              </Empty>
            )}
          </form>
        </Panel>
      )}
      <Panel title={`${rows.length} pupil${rows.length === 1 ? "" : "s"}`}>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Search pupils">
            <input
              className={inputClass}
              placeholder="Name, admission number or guardian"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <Field label="Filter by class">
            <select
              className={inputClass}
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="">All available classes</option>
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <button
            className={secondaryClass + " self-end"}
            onClick={() =>
              downloadCSV("edvora-pupils.csv", [
                [
                  "Admission number",
                  "Pupil",
                  "Class",
                  "Guardian",
                  "Phone",
                  "Status",
                ],
                ...rows.map((p) => [
                  p.admissionNo,
                  p.fullName,
                  p.classGrade,
                  p.guardianName,
                  p.guardianPhone,
                  p.status,
                ]),
              ])
            }
          >
            Export visible pupils
          </button>
        </div>
        {rows.length ? (
          <DataTable
            headers={[
              "Pupil",
              "Class",
              "Guardian",
              ...(financial ? ["Balance"] : []),
              "Account",
              ...(admin ? ["Action"] : []),
            ]}
          >
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <p className="font-semibold">{p.fullName}</p>
                  <p className="text-xs text-on-surface-variant">
                    {p.admissionNo}
                  </p>
                </td>
                <td>{p.classGrade}</td>
                <td>
                  <p>{p.guardianName}</p>
                  <a
                    className="text-primary text-xs"
                    href={`tel:${p.guardianPhone}`}
                  >
                    {p.guardianPhone}
                  </a>
                </td>
                {financial && (
                  <td>
                    {p.assignmentId ? formatNaira(p.balance) : "Not billed"}
                  </td>
                )}
                <td>
                  <Badge>{p.status}</Badge>
                </td>
                {admin && (
                  <td>
                    <button
                      className={secondaryClass}
                      disabled={action.pending}
                      onClick={() =>
                        void action.run(
                          "update_pupil_status",
                          {
                            pupilId: p.id,
                            status:
                              p.status === "Active" ? "suspended" : "active",
                          },
                          "Account status updated.",
                        )
                      }
                    >
                      {p.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                    {p.status === "Active" && (
                      <button
                        className={secondaryClass + " mt-2"}
                        onClick={() => setAccessPupil(p.id)}
                      >
                        Set up / reset access
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </DataTable>
        ) : (
          <Empty>
            No pupils match these filters. Newly enrolled pupils appear here
            after saving.
          </Empty>
        )}
      </Panel>
    </div>
  );
}
