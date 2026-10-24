import { requirePageSession } from "@/lib/auth/pageSession";
import React from "react";
import StudentShell from "@/components/shells/StudentShell";

export const metadata = {
  title: "Student & Parent Portal | Edvora School",
  description: "Secure student and parent dashboard for fee payments, receipts, and published academic results.",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageSession("student");
  return <StudentShell>{children}</StudentShell>;
}

