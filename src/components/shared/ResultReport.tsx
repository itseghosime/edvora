import React from "react";
import { TermResultRecord } from "@/lib/mockData";
import StatusBadge from "./StatusBadge";
import { Award, CheckCircle, FileText, Printer } from "lucide-react";

interface ResultReportProps {
  result: TermResultRecord;
  showPrintButton?: boolean;
}

export default function ResultReport({
  result,
  showPrintButton = true,
}: ResultReportProps) {
  const isPublished = result.status === "Published";

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink-border shadow-sm max-w-4xl mx-auto">
      {/* Report Header */}
      <div className="border-b-2 border-forest-100 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest bg-forest-50 px-3 py-1 rounded-full mb-2">
              <Award className="w-3.5 h-3.5" />
              Terminal Academic Progress Sheet
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-ink">
              Edvora Nursery & Primary School
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Continuous Assessment & Examination Report · {result.session} ({result.term})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={result.status} />
            {showPrintButton && isPublished && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink bg-ivory-100 hover:bg-ivory-200 border border-ink-border rounded-xl transition-colors print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Sheet
              </button>
            )}
          </div>
        </div>

        {/* Pupil Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 bg-ivory-50/70 p-4 rounded-2xl border border-ink-border/50 text-xs">
          <div>
            <span className="text-ink-muted block text-[11px]">Pupil Name</span>
            <span className="font-bold text-ink text-sm sm:text-base font-heading">
              {result.pupilName}
            </span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Admission Number</span>
            <span className="font-semibold text-ink font-mono">
              {result.admissionNo}
            </span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Class & Arm</span>
            <span className="font-semibold text-ink">{result.classGrade}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Class Position</span>
            <span className="font-bold text-forest">{result.classPosition}</span>
          </div>
        </div>
      </div>

      {!isPublished ? (
        <div className="py-12 text-center bg-amber-50/50 rounded-2xl border border-amber-200 p-6 my-6">
          <FileText className="w-10 h-10 text-amber-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-ink">
            Report is Currently Under {result.status}
          </h3>
          <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
            The school academic committee is updating or reviewing assessments.
            Official grades will display once reviewed and published by the head of school.
          </p>
        </div>
      ) : (
        <>
          {/* Subject Grades Table */}
          <div className="overflow-x-auto rounded-xl border border-ink-border mb-6">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-ivory-50 border-b border-ink-border text-ink-muted text-xs font-heading font-semibold uppercase">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-3 text-center">CA (40)</th>
                  <th className="py-3 px-3 text-center">Exam (60)</th>
                  <th className="py-3 px-3 text-center">Total (100)</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-border/50 text-ink">
                {result.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-ivory-50/40">
                    <td className="py-3 px-4 font-semibold text-ink">
                      {sub.subject}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums text-ink-muted">
                      {sub.continuousAssessment}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums text-ink-muted">
                      {sub.examScore}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums font-bold text-ink">
                      {sub.totalScore}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-mint-light text-forest-700">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-muted">
                      {sub.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-forest-50/50 border-t-2 border-forest-100 font-bold text-ink">
                  <td className="py-3 px-4">Aggregate Summary</td>
                  <td colSpan={2} className="py-3 px-3 text-center">
                    Total: {result.totalMarks} / {result.maxMarks}
                  </td>
                  <td className="py-3 px-3 text-center text-forest text-sm font-extrabold">
                    {result.percentage}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs bg-forest text-white px-2 py-0.5 rounded font-bold">
                      Published
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-forest-700">
                    Academic summary
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Qualitative Comments & Signoff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory-50 border border-ink-border">
              <span className="font-bold text-ink uppercase text-[10px] tracking-wider block mb-1">
                Class Teacher&apos;s Appraisal
              </span>
              <p className="text-ink-muted leading-relaxed italic">
                &ldquo;{result.teacherComment}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-ink-border/50 flex justify-between items-center text-[11px]">
                <span className="text-ink-muted">Class Teacher</span>
                <span className="text-forest font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Teacher remarks
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-ink-border">
              <span className="font-bold text-ink uppercase text-[10px] tracking-wider block mb-1">
                Head Teacher&apos;s Remark
              </span>
              <p className="text-ink-muted leading-relaxed italic">
                &ldquo;{result.headTeacherComment}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-ink-border/50 flex justify-between items-center text-[11px]">
                <span className="text-ink-muted">School review</span>
                <span className="text-forest font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Head teacher remarks
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


