import type {
  Pupil,
  PaymentTransaction,
  ReminderRule,
  ReminderLog,
  TermResultRecord,
  SchoolSummary,
  FeeItem,
} from "../mockData";

export type SchoolSettings = {
  schoolName: string;
  schoolShortName: string;
  academicSession: string;
  currentTerm: string;
  termStartDate: string;
  termEndDate: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  bursaryEmail: string;
  remindersEnabled: boolean;
  smsProvider: string;
  telegramProvider: string;
  paymentGateway: string;
  feeWaiverAllowed: boolean;
};
export interface PortalSnapshot {
  classes: { id: string; name: string }[];
  staffRole: "admin" | "bursar" | "teacher" | null;
  currentTerm: {
    id: string;
    name: string;
    sessionName: string;
    startDate: string;
    endDate: string;
  } | null;
  feePlans: {
    id: string;
    classId: string;
    name: string;
    amountMinor: number;
  }[];
  assignments: {
    id: string;
    pupilId: string;
    amountMinor: number;
    baseAmountMinor: number;
  }[];
  pupils: (Pupil & { classId: string; assignmentId?: string })[];
  payments: PaymentTransaction[];
  results: TermResultRecord[];
  resultAccess?: { pupilId: string; balance: number; locked: boolean; overridden: boolean; hasPublished: boolean }[];
  rules: ReminderRule[];
  logs: ReminderLog[];
  feeItems: FeeItem[];
  summary: SchoolSummary;
  classStats: {
    className: string;
    pupils: number;
    charges: number;
    paid: number;
    balance: number;
    rate: number;
  }[];
  settings: SchoolSettings;
  termId: string | null;
}
