import React from "react";
import StaffShell from "@/components/shells/StaffShell";

export const metadata = {
  title: "Staff Administration | Edvora School Portal",
  description: "Administrative, bursary and teacher operations portal for Edvora Nursery & Primary School.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffShell>{children}</StaffShell>;
}
