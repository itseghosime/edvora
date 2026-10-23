import React from "react";
import StudentShell from "@/components/shells/StudentShell";

export const metadata = {
  title: "Student & Parent Portal | Edvora School",
  description: "Secure student and parent dashboard for fee payments, receipts, and published academic results.",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShell>{children}</StudentShell>;
}
