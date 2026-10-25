"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GraduationCap, FileText, Printer, X, ArrowUpRight } from "lucide-react";
import { useSettingsQuery } from "@/lib/query/hooks";
import type { SchoolSettings } from "@/lib/types/portal";
import { TermResultRecord } from "@/lib/mockData";

interface ResultReportProps { result: TermResultRecord; showPrintButton?: boolean; }

function ReportCard({ result, school }: { result: TermResultRecord; school?: SchoolSettings }) {
  const published = result.status === "Published";
  return <article className="academic-report" aria-label={result.pupilName + " report card"}>
    <header className="academic-report__masthead">
      <div className="academic-report__crest" aria-label="Edvora school logo"><GraduationCap aria-hidden="true" /></div>
      <div><p className="academic-report__eyebrow">Pupil progress · School report</p><h2>{school?.schoolName || "Edvora Nursery & Primary School"}</h2><p>Terminal academic report · {result.session}</p>{(school?.contactAddress || school?.contactPhone || school?.contactEmail) && <p className="academic-report__contact">{[school.contactAddress, school.contactPhone, school.contactEmail].filter(Boolean).join(" · ")}</p>}</div>
      <span className="academic-report__seal">{published ? "Published" : result.status}</span>
    </header>
    <div className="academic-report__ribbon"><span>Academic progress report</span><strong>{result.term}</strong></div>
    <dl className="academic-report__identity">
      <div className="academic-report__name"><dt>Pupil name</dt><dd>{result.pupilName}</dd></div>
      <div><dt>Admission number</dt><dd>{result.admissionNo}</dd></div>
      <div><dt>Class</dt><dd>{result.classGrade}</dd></div>
      <div><dt>Session</dt><dd>{result.session}</dd></div>
    </dl>
    {!published ? <div className="academic-report__unpublished"><FileText aria-hidden="true" /><h3>Report awaiting publication</h3><p>Grades will appear once the school has reviewed and published this report.</p></div> : <>
      <div className="academic-report__highlights">
        <div><span>Overall average</span><strong>{result.percentage}%</strong><small>Across {result.subjects.length} subjects</small></div>
        <div><span>Total marks</span><strong>{result.totalMarks}<em> / {result.maxMarks}</em></strong><small>Assessment + examination</small></div>
        <div><span>Class position</span><strong>{result.classPosition || "—"}</strong><small>As recorded by the school</small></div>
        <div><span>Attendance</span><strong>{result.attendanceDays}<em> / {result.totalSchoolDays}</em></strong><small>Days present / school days</small></div>
      </div>
      <section aria-label="Subject performance" className="academic-report__performance"><div className="academic-report__section-title"><span>01</span><h3>Subject performance</h3><small>CA 40 · Exam 60</small></div>
        <div className="academic-report__table-scroll"><table><thead><tr><th scope="col">Subject</th><th scope="col">CA /40</th><th scope="col">Exam /60</th><th scope="col">Total /100</th><th scope="col">Grade</th><th scope="col">Remark</th></tr></thead><tbody>
          {result.subjects.map((subject, index) => <tr key={index}><th scope="row">{subject.subject}</th><td>{subject.continuousAssessment}</td><td>{subject.examScore}</td><td><strong>{subject.totalScore}</strong></td><td><span className="academic-report__grade">{subject.grade}</span></td><td>{subject.remarks || "—"}</td></tr>)}
        </tbody><tfoot><tr><th scope="row" colSpan={3}>Total academic score</th><td colSpan={3}>{result.totalMarks} / {result.maxMarks} <span>· {result.percentage}% average</span></td></tr></tfoot></table></div>
      </section>
      <section className="academic-report__appraisal" aria-label="School remarks"><div className="academic-report__section-title"><span>02</span><h3>Remarks &amp; encouragement</h3></div><div className="academic-report__remarks">
        <div><h4>Class teacher’s appraisal</h4><p>{result.teacherComment?.trim() || "No teacher remark recorded."}</p><span>Class teacher</span></div>
        <div><h4>Head teacher’s remark</h4><p>{result.headTeacherComment?.trim() || "No head teacher remark recorded."}</p><span>Head teacher</span></div>
      </div></section>
    </>}
    <footer className="academic-report__footer"><span><GraduationCap aria-hidden="true" /> edvora.</span><p>Academic progress · {result.admissionNo} · {result.term} · {result.session}</p></footer>
  </article>;
}

export default function ResultReport({ result, showPrintButton = true }: ResultReportProps) {
  const { data: school } = useSettingsQuery();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); opener.current?.focus(); };
  }, [open]);
  return <>
    {showPrintButton && result.status === "Published" && <div className="report-open-bar"><div><span>Your term, beautifully documented</span><p>Open your school report card to print or save a PDF.</p></div><button ref={opener} type="button" onClick={() => setOpen(true)}><FileText size={17} />Open report card<ArrowUpRight size={16} /></button></div>}
    <ReportCard result={result} school={school} />
    {open && createPortal(<div className="report-print-root"><div className="report-preview-backdrop" onClick={() => setOpen(false)} /><div ref={dialog} className="report-preview-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <div className="report-preview-toolbar"><div><h2 id={titleId}>Your school report card</h2><p>Print a copy or choose “Save as PDF” in the print window.</p></div><div><button type="button" onClick={() => window.print()}><Printer size={17} />Print / Save PDF</button><button type="button" aria-label="Close report card" onClick={() => setOpen(false)}><X size={20} /></button></div></div>
      <ReportCard result={result} school={school} />
    </div></div>, document.body)}
  </>;
}
