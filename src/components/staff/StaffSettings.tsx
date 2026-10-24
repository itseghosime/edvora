"use client";
import { useState } from "react";
import PageHeader from "../shared/PageHeader";
import {
  Panel,
  Field,
  Empty,
  DataTable,
  Feedback,
  Guard,
  inputClass,
  buttonClass,
  useStaffAction,
  useStaffData,
} from "./StaffUI";
import type { PortalSnapshot } from "@/lib/types/portal";
function SettingsForms({ data }: { data: PortalSnapshot }) {
  const action = useStaffAction();
  const [school, setSchool] = useState({
    schoolName: data.settings.schoolName,
    schoolShortName: data.settings.schoolShortName,
    contactAddress: data.settings.contactAddress,
    contactPhone: data.settings.contactPhone,
    contactEmail: data.settings.contactEmail,
    bursaryEmail: data.settings.bursaryEmail,
  });
  const [term, setTerm] = useState({
    sessionName: data.currentTerm?.sessionName ?? "",
    name: data.currentTerm?.name ?? "",
    startDate: data.currentTerm?.startDate ?? "",
    endDate: data.currentTerm?.endDate ?? "",
  });
  const [newClass, setNewClass] = useState({ name: "", stage: "primary" });
  return (
    <div className="space-y-6">
      <Feedback action={action} />
      <Panel title="School details">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void action.run("save_settings", school, "School details saved.");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries({
              schoolName: "School name",
              schoolShortName: "Short name",
              contactAddress: "Address",
              contactPhone: "Office phone",
              contactEmail: "Office email",
              bursaryEmail: "Bursary email",
            }).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className={inputClass}
                  type={key.toLowerCase().includes("email") ? "email" : "text"}
                  required={key === "schoolName" || key === "schoolShortName"}
                  maxLength={500}
                  value={school[key as keyof typeof school]}
                  onChange={(e) =>
                    setSchool({ ...school, [key]: e.target.value })
                  }
                />
              </Field>
            ))}
          </div>
          <button className={buttonClass} disabled={action.pending}>
            Save school details
          </button>
        </form>
      </Panel>
      <Panel
        title="Academic session & current term"
        description="Selecting a term changes the current workspace. Previous term records stay saved."
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void action.run("configure_term", term, "Current term updated.");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Session name">
              <input
                className={inputClass}
                required
                placeholder="2026/2027"
                maxLength={32}
                value={term.sessionName}
                onChange={(e) =>
                  setTerm({ ...term, sessionName: e.target.value })
                }
              />
            </Field>
            <Field label="Term name">
              <input
                className={inputClass}
                required
                placeholder="First Term"
                maxLength={32}
                value={term.name}
                onChange={(e) => setTerm({ ...term, name: e.target.value })}
              />
            </Field>
            <Field label="Term starts">
              <input
                className={inputClass}
                required
                type="date"
                value={term.startDate}
                onChange={(e) =>
                  setTerm({ ...term, startDate: e.target.value })
                }
              />
            </Field>
            <Field label="Term ends">
              <input
                className={inputClass}
                required
                type="date"
                min={term.startDate}
                value={term.endDate}
                onChange={(e) => setTerm({ ...term, endDate: e.target.value })}
              />
            </Field>
          </div>
          <button className={buttonClass} disabled={action.pending}>
            Save as current term
          </button>
        </form>
      </Panel>
      <Panel title="Classes">
        <form
          className="grid sm:grid-cols-3 gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (await action.run("create_class", newClass, "Class created."))
              setNewClass({ ...newClass, name: "" });
          }}
        >
          <Field label="Class name">
            <input
              className={inputClass}
              required
              maxLength={32}
              placeholder="Primary 1A"
              value={newClass.name}
              onChange={(e) =>
                setNewClass({ ...newClass, name: e.target.value })
              }
            />
          </Field>
          <Field label="Stage">
            <select
              className={inputClass}
              value={newClass.stage}
              onChange={(e) =>
                setNewClass({ ...newClass, stage: e.target.value })
              }
            >
              <option value="nursery">Nursery</option>
              <option value="primary">Primary</option>
            </select>
          </Field>
          <button
            className={buttonClass + " self-end"}
            disabled={action.pending}
          >
            Create class
          </button>
        </form>
        {data.classes.length ? (
          <DataTable headers={["Class", "Enrolled pupils"]}>
            {data.classes.map((c) => (
              <tr key={c.id}>
                <td className="font-semibold">{c.name}</td>
                <td>{data.pupils.filter((p) => p.classId === c.id).length}</td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <Empty>
            Create your school’s classes to begin enrollment and billing.
          </Empty>
        )}
      </Panel>
    </div>
  );
}
export default function StaffSettings() {
  const data = useStaffData();
  if (!data) return null;
  return (
    <Guard data={data} roles={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          title="School settings"
          subtitle="School identity, academic calendar and class setup."
        />
        <SettingsForms data={data} />
      </div>
    </Guard>
  );
}
