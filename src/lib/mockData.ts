export interface Pupil {
  id: string;
  admissionNo: string;
  fullName: string;
  classGrade: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  charges: number;
  paid: number;
  balance: number;
  status: "Active" | "Inactive" | "Under Review";
  remindersEnabled: boolean;
  siblingIds?: string[];
}

export interface FeeItem {
  id: string;
  name: string;
  category: "Tuition" | "Materials" | "Activities" | "Assessment";
  amount: number;
  description: string;
  mandatory: boolean;
}

export interface FeePlan {
  id: string;
  className: string;
  totalAmount: number;
  items: FeeItem[];
  dueDate: string;
  instalmentAllowed: boolean;
  minInstalment: number;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  pupilId: string;
  pupilName: string;
  classGrade: string;
  amount: number;
  channel: "Paystack (Card)" | "Bank Transfer" | "USSD";
  status: "Verified" | "Pending" | "Failed";
  date: string;
  receiptNumber: string;
  notes?: string;
  balanceAfter: number;
}

export interface ReminderRule {
  id: string;
  title: string;
  channel: "Telegram" | "SMS" | "Both";
  triggerCondition: string;
  targetClasses: string[];
  messageTemplate: string;
  isActive: boolean;
  lastRunDate?: string;
  eligibleCount: number;
}

export interface ReminderLog {
  id: string;
  ruleId: string;
  pupilName: string;
  guardianPhone: string;
  channel: "Telegram" | "SMS";
  status: "Delivered" | "Pending" | "Accepted" | "Failed" | "Suppressed (₦0 Balance)";
  timestamp: string;
  details?: string;
}

export interface SubjectResult {
  subject: string;
  continuousAssessment: number; // max 40
  examScore: number; // max 60
  totalScore: number; // max 100
  grade: "A+" | "A" | "B" | "C" | "D" | "E";
  remarks: string;
  teacher: string;
}

export interface TermResultRecord {
  id: string;
  pupilId: string;
  pupilName: string;
  admissionNo: string;
  classGrade: string;
  session: string;
  term: string;
  subjects: SubjectResult[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  classPosition: string;
  attendanceDays: number;
  totalSchoolDays: number;
  teacherComment: string;
  headTeacherComment: string;
  status: "Published" | "Draft" | "Under Correction" | "Under Review";
  publishedDate?: string;
}

export interface SchoolSummary {
  session: string;
  term: string;
  totalPupils: number;
  totalCharges: number;
  verifiedPaid: number;
  totalBalance: number;
  collectionRate: number; // 58.3%
}

// Canonical School Summary Data
export const INITIAL_SCHOOL_SUMMARY: SchoolSummary = {
  session: "2026/2027",
  term: "First Term",
  totalPupils: 180,
  totalCharges: 21600000,
  verifiedPaid: 12600000,
  totalBalance: 9000000,
  collectionRate: 58.3,
};

// Class stats matching the handoff
export const INITIAL_CLASS_STATS = [
  { className: "Nursery 1", pupils: 20, charges: 2400000, paid: 1400000, balance: 1000000, rate: 58.3 },
  { className: "Nursery 2", pupils: 20, charges: 2400000, paid: 1400000, balance: 1000000, rate: 58.3 },
  { className: "Primary 1", pupils: 28, charges: 3360000, paid: 1960000, balance: 1400000, rate: 58.3 },
  { className: "Primary 2", pupils: 28, charges: 3360000, paid: 1960000, balance: 1400000, rate: 58.3 },
  { className: "Primary 3", pupils: 28, charges: 3360000, paid: 1960000, balance: 1400000, rate: 58.3 },
  { className: "Primary 4", pupils: 28, charges: 3360000, paid: 1960000, balance: 1400000, rate: 58.3 },
  { className: "Primary 5", pupils: 28, charges: 3360000, paid: 1960000, balance: 1400000, rate: 58.3 },
];

export const INITIAL_PUPILS: Pupil[] = [
  {
    id: "osasere-ehigiator",
    admissionNo: "EDV/2026/034",
    fullName: "Osasere Ehigiator",
    classGrade: "Primary 3A",
    gender: "Male",
    dateOfBirth: "2018-05-14",
    guardianName: "Dr. & Mrs. E. Ehigiator",
    guardianRelationship: "Parents",
    guardianPhone: "+234 803 555 0192",
    guardianEmail: "ehigiator.family@edvora.example.com",
    charges: 120000,
    paid: 70000,
    balance: 50000,
    status: "Active",
    remindersEnabled: true,
    siblingIds: ["tamara-ehigiator"],
  },
  {
    id: "tamara-ehigiator",
    admissionNo: "EDV/2026/089",
    fullName: "Tamara Ehigiator",
    classGrade: "Nursery 2B",
    gender: "Female",
    dateOfBirth: "2021-08-22",
    guardianName: "Dr. & Mrs. E. Ehigiator",
    guardianRelationship: "Parents",
    guardianPhone: "+234 803 555 0192",
    guardianEmail: "ehigiator.family@edvora.example.com",
    charges: 120000,
    paid: 120000,
    balance: 0,
    status: "Active",
    remindersEnabled: false,
    siblingIds: ["osasere-ehigiator"],
  },
  {
    id: "chidi-okonkwo",
    admissionNo: "EDV/2026/012",
    fullName: "Chidi Okonkwo",
    classGrade: "Primary 3A",
    gender: "Male",
    dateOfBirth: "2018-02-10",
    guardianName: "Engr. Nnamdi Okonkwo",
    guardianRelationship: "Father",
    guardianPhone: "+234 802 334 1120",
    guardianEmail: "nnamdi.okonkwo@example.com",
    charges: 120000,
    paid: 60000,
    balance: 60000,
    status: "Active",
    remindersEnabled: true,
  },
  {
    id: "amina-bello",
    admissionNo: "EDV/2026/045",
    fullName: "Amina Bello",
    classGrade: "Primary 3A",
    gender: "Female",
    dateOfBirth: "2018-11-03",
    guardianName: "Hajiya Fatima Bello",
    guardianRelationship: "Mother",
    guardianPhone: "+234 814 776 2209",
    guardianEmail: "fatima.bello@example.com",
    charges: 120000,
    paid: 120000,
    balance: 0,
    status: "Active",
    remindersEnabled: false,
  },
  {
    id: "korede-adeyemi",
    admissionNo: "EDV/2026/067",
    fullName: "Korede Adeyemi",
    classGrade: "Primary 1B",
    gender: "Male",
    dateOfBirth: "2020-04-18",
    guardianName: "Mr. Babatunde Adeyemi",
    guardianRelationship: "Father",
    guardianPhone: "+234 805 119 4432",
    guardianEmail: "badeyemi@example.com",
    charges: 120000,
    paid: 40000,
    balance: 80000,
    status: "Active",
    remindersEnabled: true,
  },
  {
    id: "zainab-suleiman",
    admissionNo: "EDV/2026/092",
    fullName: "Zainab Suleiman",
    classGrade: "Primary 5A",
    gender: "Female",
    dateOfBirth: "2016-09-08",
    guardianName: "Alhaji M. Suleiman",
    guardianRelationship: "Father",
    guardianPhone: "+234 809 442 8811",
    guardianEmail: "msuleiman@example.com",
    charges: 120000,
    paid: 120000,
    balance: 0,
    status: "Active",
    remindersEnabled: false,
  },
  {
    id: "somtochukwu-eze",
    admissionNo: "EDV/2026/104",
    fullName: "Somtochukwu Eze",
    classGrade: "Nursery 1A",
    gender: "Male",
    dateOfBirth: "2022-03-15",
    guardianName: "Barrister Joyce Eze",
    guardianRelationship: "Mother",
    guardianPhone: "+234 818 200 7765",
    guardianEmail: "joyce.eze@example.com",
    charges: 120000,
    paid: 50000,
    balance: 70000,
    status: "Active",
    remindersEnabled: true,
  },
];

export const CANONICAL_FEE_BREAKDOWN: FeeItem[] = [
  {
    id: "fee-tuition",
    name: "Tuition Fee",
    category: "Tuition",
    amount: 70000,
    description: "Core classroom instruction, specialist teachers, and curriculum delivery",
    mandatory: true,
  },
  {
    id: "fee-books",
    name: "Books & Learning Materials",
    category: "Materials",
    amount: 25000,
    description: "Stationery pack, curriculum workbooks, exercise books and digital learning access",
    mandatory: true,
  },
  {
    id: "fee-cocurricular",
    name: "Co-curricular & Clubs",
    category: "Activities",
    amount: 15000,
    description: "Sports equipment, creative arts materials, music and cultural exhibitions",
    mandatory: true,
  },
  {
    id: "fee-assessment",
    name: "Assessment & Examination",
    category: "Assessment",
    amount: 10000,
    description: "Continuous assessment monitoring, termly terminal reports and records",
    mandatory: true,
  },
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "pay-001",
    reference: "EDV-PAY-20261008-011",
    pupilId: "osasere-ehigiator",
    pupilName: "Osasere Ehigiator",
    classGrade: "Primary 3A",
    amount: 50000,
    channel: "Paystack (Card)",
    status: "Verified",
    date: "2026-10-08T09:24:00Z",
    receiptNumber: "REC-2026-1008-034",
    balanceAfter: 70000,
    notes: "First instalment - Term Tuition portion",
  },
  {
    id: "pay-002",
    reference: "EDV-PAY-20261014-042",
    pupilId: "osasere-ehigiator",
    pupilName: "Osasere Ehigiator",
    classGrade: "Primary 3A",
    amount: 20000,
    channel: "Bank Transfer",
    status: "Verified",
    date: "2026-10-14T14:15:00Z",
    receiptNumber: "REC-2026-1014-078",
    balanceAfter: 50000,
    notes: "Second instalment - Books & Learning materials",
  },
  {
    id: "pay-003",
    reference: "EDV-PAY-20261012-029",
    pupilId: "tamara-ehigiator",
    pupilName: "Tamara Ehigiator",
    classGrade: "Nursery 2B",
    amount: 120000,
    channel: "Paystack (Card)",
    status: "Verified",
    date: "2026-10-12T11:45:00Z",
    receiptNumber: "REC-2026-1012-055",
    balanceAfter: 0,
    notes: "Full session term fee payment",
  },
  {
    id: "pay-004",
    reference: "EDV-PAY-20261016-088",
    pupilId: "chidi-okonkwo",
    pupilName: "Chidi Okonkwo",
    classGrade: "Primary 3A",
    amount: 60000,
    channel: "Paystack (Card)",
    status: "Verified",
    date: "2026-10-16T16:30:00Z",
    receiptNumber: "REC-2026-1016-102",
    balanceAfter: 60000,
  },
  {
    id: "pay-005",
    reference: "EDV-PAY-20261018-095",
    pupilId: "korede-adeyemi",
    pupilName: "Korede Adeyemi",
    classGrade: "Primary 1B",
    amount: 40000,
    channel: "USSD",
    status: "Verified",
    date: "2026-10-18T10:11:00Z",
    receiptNumber: "REC-2026-1018-119",
    balanceAfter: 80000,
  },
];

export const INITIAL_REMINDER_RULES: ReminderRule[] = [
  {
    id: "rule-1",
    title: "First Term Mid-Term Fee Due Reminder",
    channel: "Both",
    triggerCondition: "Outstanding balance > ₦0 and 5 days to due date",
    targetClasses: ["All Classes"],
    messageTemplate:
      "Dear Parent/Guardian of {PupilName}, this is a gentle reminder from Edvora School that the remaining balance of {Balance} for First Term 2026/2027 is due on {DueDate}. Thank you.",
    isActive: true,
    lastRunDate: "2026-10-15T08:00:00Z",
    eligibleCount: 75,
  },
  {
    id: "rule-2",
    title: "Outstanding Balance Follow-up (Telegram)",
    channel: "Telegram",
    triggerCondition: "Outstanding balance > ₦30,000 after 14 days of term commencement",
    targetClasses: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5"],
    messageTemplate:
      "Good day {GuardianName}. Kindly review {PupilName}'s fee statement on the Edvora Student Portal. Current balance: {Balance}. Safe instalments can be paid directly online.",
    isActive: true,
    lastRunDate: "2026-10-18T09:30:00Z",
    eligibleCount: 42,
  },
  {
    id: "rule-3",
    title: "Receipt Confirmation Notification",
    channel: "SMS",
    triggerCondition: "Immediate on payment verification",
    targetClasses: ["All Classes"],
    messageTemplate:
      "Edvora School: Payment of {Amount} for {PupilName} successfully verified. Remaining balance: {Balance}. Ref: {ReceiptNumber}.",
    isActive: true,
    lastRunDate: "2026-10-20T17:10:00Z",
    eligibleCount: 180,
  },
];

export const INITIAL_REMINDER_LOGS: ReminderLog[] = [
  {
    id: "log-001",
    ruleId: "rule-1",
    pupilName: "Osasere Ehigiator",
    guardianPhone: "+234 803 555 0192",
    channel: "Telegram",
    status: "Delivered",
    timestamp: "2026-10-15T08:02:14Z",
    details: "Delivered to device with read receipt",
  },
  {
    id: "log-002",
    ruleId: "rule-1",
    pupilName: "Chidi Okonkwo",
    guardianPhone: "+234 802 334 1120",
    channel: "SMS",
    status: "Delivered",
    timestamp: "2026-10-15T08:03:02Z",
    details: "Network operator delivery report confirmed",
  },
  {
    id: "log-003",
    ruleId: "rule-1",
    pupilName: "Tamara Ehigiator",
    guardianPhone: "+234 803 555 0192",
    channel: "Telegram",
    status: "Suppressed (₦0 Balance)",
    timestamp: "2026-10-15T08:00:01Z",
    details: "Account settled in full. Reminder omitted.",
  },
  {
    id: "log-004",
    ruleId: "rule-2",
    pupilName: "Korede Adeyemi",
    guardianPhone: "+234 805 119 4432",
    channel: "Telegram",
    status: "Accepted",
    timestamp: "2026-10-18T09:31:45Z",
    details: "Accepted by Telegram gateway",
  },
  {
    id: "log-005",
    ruleId: "rule-2",
    pupilName: "Amina Bello",
    guardianPhone: "+234 814 776 2209",
    channel: "Telegram",
    status: "Suppressed (₦0 Balance)",
    timestamp: "2026-10-18T09:30:05Z",
    details: "Zero balance filter matched.",
  },
];

export const INITIAL_STUDENT_RESULT: TermResultRecord = {
  id: "res-osasere-term1",
  pupilId: "osasere-ehigiator",
  pupilName: "Osasere Ehigiator",
  admissionNo: "EDV/2026/034",
  classGrade: "Primary 3A",
  session: "2026/2027",
  term: "First Term",
  subjects: [
    {
      subject: "Mathematics",
      continuousAssessment: 36,
      examScore: 54,
      totalScore: 90,
      grade: "A+",
      remarks: "Demonstrates exceptional logical thinking and numerical accuracy.",
      teacher: "Mr. D. Alabi",
    },
    {
      subject: "English Language",
      continuousAssessment: 35,
      examScore: 52,
      totalScore: 87,
      grade: "A",
      remarks: "Very articulate in reading comprehension and creative composition.",
      teacher: "Mrs. C. Eze",
    },
    {
      subject: "Basic Science & Technology",
      continuousAssessment: 34,
      examScore: 53,
      totalScore: 87,
      grade: "A",
      remarks: "Active participant in practical science demonstrations and inquiries.",
      teacher: "Mr. O. Babalola",
    },
    {
      subject: "Social Studies & Civic Education",
      continuousAssessment: 37,
      examScore: 51,
      totalScore: 88,
      grade: "A",
      remarks: "Possesses a commendable grasp of community values and civic roles.",
      teacher: "Mrs. F. Oladipo",
    },
    {
      subject: "Cultural & Creative Arts",
      continuousAssessment: 36,
      examScore: 48,
      totalScore: 84,
      grade: "A",
      remarks: "Shows great artistic imagination and skill in colour composition.",
      teacher: "Ms. T. Williams",
    },
    {
      subject: "Agricultural Science",
      continuousAssessment: 35,
      examScore: 53,
      totalScore: 88,
      grade: "A",
      remarks: "Thorough understanding of plant parts and practical school gardening.",
      teacher: "Mr. D. Alabi",
    },
  ],
  totalMarks: 524,
  maxMarks: 600,
  percentage: 87.3,
  classPosition: "3rd out of 28 pupils",
  attendanceDays: 62,
  totalSchoolDays: 64,
  teacherComment:
    "Osasere is a bright, disciplined, and proactive learner who has shown outstanding academic aptitude and polite conduct this term.",
  headTeacherComment:
    "An excellent first term performance. With sustained focus and curiosity, Osasere is poised for continuous academic distinction.",
  status: "Published",
  publishedDate: "2026-10-18T10:00:00Z",
};

export const INITIAL_SCHOOL_SETTINGS = {
  schoolName: "Edvora Nursery & Primary School",
  schoolShortName: "Edvora",
  academicSession: "2026/2027",
  currentTerm: "First Term",
  termStartDate: "2026-09-14",
  termEndDate: "2026-12-18",
  contactAddress: "Plot 12, Academic Crescent, Victoria Island / Lekki Corridor, Lagos, Nigeria",
  contactPhone: "+234 1 295 4800 / +234 803 000 3399",
  contactEmail: "info@edvora.edu.ng",
  bursaryEmail: "bursar@edvora.edu.ng",
  remindersEnabled: true,
  smsProvider: "Termii (Transactional)",
  whatsappProvider: "Meta Telegram Bot API",
  paymentGateway: "Paystack Managed Integration",
  feeWaiverAllowed: true,
};

