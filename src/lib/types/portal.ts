import type { Pupil, PaymentTransaction, ReminderRule, ReminderLog, TermResultRecord, SchoolSummary, FeeItem } from '../mockData';

export type SchoolSettings = {
  schoolName: string; schoolShortName: string; academicSession: string; currentTerm: string;
  termStartDate: string; termEndDate: string; contactAddress: string; contactPhone: string;
  contactEmail: string; bursaryEmail: string; remindersEnabled: boolean; smsProvider: string;
  telegramProvider: string; paymentGateway: string; feeWaiverAllowed: boolean;
};
export interface PortalSnapshot {
  classes: { id: string; name: string }[];
  pupils: Pupil[];
  payments: PaymentTransaction[];
  results: TermResultRecord[];
  rules: ReminderRule[];
  logs: ReminderLog[];
  feeItems: FeeItem[];
  summary: SchoolSummary;
  classStats: { className: string; pupils: number; charges: number; paid: number; balance: number; rate: number }[];
  settings: SchoolSettings;
  termId: string | null;
}
