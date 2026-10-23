"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  INITIAL_SCHOOL_SUMMARY,
  INITIAL_CLASS_STATS,
  INITIAL_PUPILS,
  CANONICAL_FEE_BREAKDOWN,
  INITIAL_PAYMENTS,
  INITIAL_REMINDER_RULES,
  INITIAL_REMINDER_LOGS,
  INITIAL_STUDENT_RESULT,
  INITIAL_SCHOOL_SETTINGS,
  Pupil,
  PaymentTransaction,
  ReminderRule,
  ReminderLog,
  TermResultRecord,
  SchoolSummary,
  FeeItem,
} from "@/lib/mockData";

// Simulated in-memory storage with localStorage hydration if in browser
const STORAGE_KEYS = {
  PUPILS: "edvora_pupils_v1",
  PAYMENTS: "edvora_payments_v1",
  RULES: "edvora_reminder_rules_v1",
  LOGS: "edvora_reminder_logs_v1",
  RESULTS: "edvora_results_v1",
  SETTINGS: "edvora_settings_v1",
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// ==========================================
// 1. School Summary & Class Stats Queries
// ==========================================
export function useSchoolSummaryQuery() {
  const { data: pupils = INITIAL_PUPILS } = usePupilsQuery();
  
  return useQuery({
    queryKey: ["school-summary", pupils.length, pupils.map(p => p.paid).join("-")],
    queryFn: async (): Promise<SchoolSummary> => {
      // Small simulated latency
      await new Promise((res) => setTimeout(res, 80));

      const totalCharges = pupils.reduce((sum, p) => sum + p.charges, 0);
      const verifiedPaid = pupils.reduce((sum, p) => sum + p.paid, 0);
      const totalBalance = pupils.reduce((sum, p) => sum + p.balance, 0);
      const rate = totalCharges > 0 ? (verifiedPaid / totalCharges) * 100 : 0;

      return {
        session: "2026/2027",
        term: "First Term",
        totalPupils: pupils.length,
        totalCharges,
        verifiedPaid,
        totalBalance,
        collectionRate: Math.round(rate * 10) / 10,
      };
    },
    initialData: INITIAL_SCHOOL_SUMMARY,
  });
}

export function useClassStatsQuery() {
  return useQuery({
    queryKey: ["class-stats"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 80));
      return INITIAL_CLASS_STATS;
    },
    initialData: INITIAL_CLASS_STATS,
  });
}

// ==========================================
// 2. Pupils Queries & Mutations
// ==========================================
export function usePupilsQuery() {
  return useQuery({
    queryKey: ["pupils"],
    queryFn: async (): Promise<Pupil[]> => {
      await new Promise((res) => setTimeout(res, 120));
      return getStoredItem<Pupil[]>(STORAGE_KEYS.PUPILS, INITIAL_PUPILS);
    },
    initialData: INITIAL_PUPILS,
  });
}

export function usePupilQuery(id: string) {
  return useQuery({
    queryKey: ["pupil", id],
    queryFn: async (): Promise<Pupil | undefined> => {
      await new Promise((res) => setTimeout(res, 80));
      const list = getStoredItem<Pupil[]>(STORAGE_KEYS.PUPILS, INITIAL_PUPILS);
      return list.find((p) => p.id === id);
    },
    initialData: INITIAL_PUPILS.find((p) => p.id === id),
  });
}

export function useAddPupilMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPupil: Omit<Pupil, "id">) => {
      await new Promise((res) => setTimeout(res, 300));
      const current = getStoredItem<Pupil[]>(STORAGE_KEYS.PUPILS, INITIAL_PUPILS);
      const id = newPupil.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
      const created: Pupil = { ...newPupil, id };
      const updated = [created, ...current];
      setStoredItem(STORAGE_KEYS.PUPILS, updated);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
      queryClient.invalidateQueries({ queryKey: ["school-summary"] });
    },
  });
}

export function useUpdatePupilMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pupil: Pupil) => {
      await new Promise((res) => setTimeout(res, 250));
      const current = getStoredItem<Pupil[]>(STORAGE_KEYS.PUPILS, INITIAL_PUPILS);
      const updated = current.map((p) => (p.id === pupil.id ? pupil : p));
      setStoredItem(STORAGE_KEYS.PUPILS, updated);
      return pupil;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
      queryClient.invalidateQueries({ queryKey: ["pupil", data.id] });
      queryClient.invalidateQueries({ queryKey: ["school-summary"] });
    },
  });
}

// ==========================================
// 3. Fee Breakdown Query
// ==========================================
export function useFeeBreakdownQuery() {
  return useQuery({
    queryKey: ["fee-breakdown"],
    queryFn: async (): Promise<FeeItem[]> => {
      await new Promise((res) => setTimeout(res, 80));
      return CANONICAL_FEE_BREAKDOWN;
    },
    initialData: CANONICAL_FEE_BREAKDOWN,
  });
}

// ==========================================
// 4. Payments Queries & Mutations
// ==========================================
export function usePaymentsQuery() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async (): Promise<PaymentTransaction[]> => {
      await new Promise((res) => setTimeout(res, 120));
      return getStoredItem<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    },
    initialData: INITIAL_PAYMENTS,
  });
}

export function useRecordPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pupilId,
      amount,
      channel,
      notes,
    }: {
      pupilId: string;
      amount: number;
      channel: "Paystack (Card)" | "Bank Transfer" | "USSD";
      notes?: string;
    }) => {
      await new Promise((res) => setTimeout(res, 600)); // simulated checkout verification

      const pupils = getStoredItem<Pupil[]>(STORAGE_KEYS.PUPILS, INITIAL_PUPILS);
      const pupil = pupils.find((p) => p.id === pupilId);

      if (!pupil) throw new Error("Pupil record not found");

      const newPaid = pupil.paid + amount;
      const newBalance = Math.max(0, pupil.charges - newPaid);

      // Update pupil in database
      const updatedPupils = pupils.map((p) =>
        p.id === pupilId
          ? {
              ...p,
              paid: newPaid,
              balance: newBalance,
              remindersEnabled: newBalance > 0 ? p.remindersEnabled : false,
            }
          : p
      );
      setStoredItem(STORAGE_KEYS.PUPILS, updatedPupils);

      // Create Payment Transaction
      const dateNow = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateRef = `${dateNow.getFullYear()}${pad(dateNow.getMonth() + 1)}${pad(dateNow.getDate())}`;
      const randomSeq = Math.floor(100 + Math.random() * 900);

      const newTx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        reference: `EDV-PAY-${dateRef}-${randomSeq}`,
        pupilId: pupil.id,
        pupilName: pupil.fullName,
        classGrade: pupil.classGrade,
        amount,
        channel,
        status: "Verified",
        date: dateNow.toISOString(),
        receiptNumber: `REC-${dateRef}-${randomSeq}`,
        notes: notes || "Online parent instalment payment",
        balanceAfter: newBalance,
      };

      const payments = getStoredItem<PaymentTransaction[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      const updatedPayments = [newTx, ...payments];
      setStoredItem(STORAGE_KEYS.PAYMENTS, updatedPayments);

      return { payment: newTx, pupilBalance: newBalance };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
      queryClient.invalidateQueries({ queryKey: ["pupil", data.payment.pupilId] });
      queryClient.invalidateQueries({ queryKey: ["school-summary"] });
    },
  });
}

// ==========================================
// 5. Reminders Queries & Mutations
// ==========================================
export function useRemindersQuery() {
  return useQuery({
    queryKey: ["reminder-rules"],
    queryFn: async (): Promise<ReminderRule[]> => {
      await new Promise((res) => setTimeout(res, 100));
      return getStoredItem<ReminderRule[]>(STORAGE_KEYS.RULES, INITIAL_REMINDER_RULES);
    },
    initialData: INITIAL_REMINDER_RULES,
  });
}

export function useReminderLogsQuery() {
  return useQuery({
    queryKey: ["reminder-logs"],
    queryFn: async (): Promise<ReminderLog[]> => {
      await new Promise((res) => setTimeout(res, 100));
      return getStoredItem<ReminderLog[]>(STORAGE_KEYS.LOGS, INITIAL_REMINDER_LOGS);
    },
    initialData: INITIAL_REMINDER_LOGS,
  });
}

export function useToggleReminderRuleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) => {
      await new Promise((res) => setTimeout(res, 200));
      const rules = getStoredItem<ReminderRule[]>(STORAGE_KEYS.RULES, INITIAL_REMINDER_RULES);
      const updated = rules.map((r) => (r.id === ruleId ? { ...r, isActive } : r));
      setStoredItem(STORAGE_KEYS.RULES, updated);
      return { ruleId, isActive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder-rules"] });
    },
  });
}

export function useTriggerReminderBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ruleId }: { ruleId: string }) => {
      await new Promise((res) => setTimeout(res, 500));
      const rules = getStoredItem<ReminderRule[]>(STORAGE_KEYS.RULES, INITIAL_REMINDER_RULES);
      const targetRule = rules.find((r) => r.id === ruleId);
      if (!targetRule) throw new Error("Rule not found");

      const logs = getStoredItem<ReminderLog[]>(STORAGE_KEYS.LOGS, INITIAL_REMINDER_LOGS);
      const newLog: ReminderLog = {
        id: `log-${Date.now()}`,
        ruleId,
        pupilName: "Osasere Ehigiator",
        guardianPhone: "+234 803 555 0192",
        channel: targetRule.channel === "Both" ? "Telegram" : targetRule.channel,
        status: "Delivered",
        timestamp: new Date().toISOString(),
        details: "Instant trigger completed successfully",
      };

      setStoredItem(STORAGE_KEYS.LOGS, [newLog, ...logs]);
      return newLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminder-logs"] });
    },
  });
}

// ==========================================
// 6. Results Queries & Mutations
// ==========================================
export function useStudentResultQuery(pupilId?: string) {
  return useQuery({
    queryKey: ["student-result", pupilId || "osasere-ehigiator"],
    queryFn: async (): Promise<TermResultRecord> => {
      await new Promise((res) => setTimeout(res, 120));
      const stored = getStoredItem<TermResultRecord>(
        STORAGE_KEYS.RESULTS,
        INITIAL_STUDENT_RESULT
      );
      return stored;
    },
    initialData: INITIAL_STUDENT_RESULT,
  });
}

export function useAllResultsQuery() {
  return useQuery({
    queryKey: ["all-results"],
    queryFn: async (): Promise<TermResultRecord[]> => {
      await new Promise((res) => setTimeout(res, 120));
      const single = getStoredItem<TermResultRecord>(
        STORAGE_KEYS.RESULTS,
        INITIAL_STUDENT_RESULT
      );
      return [single];
    },
    initialData: [INITIAL_STUDENT_RESULT],
  });
}

export function useUpdateResultStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      status,
    }: {
      status: "Published" | "Draft" | "Under Correction" | "Under Review";
    }) => {
      await new Promise((res) => setTimeout(res, 250));
      const stored = getStoredItem<TermResultRecord>(
        STORAGE_KEYS.RESULTS,
        INITIAL_STUDENT_RESULT
      );
      const updated: TermResultRecord = {
        ...stored,
        status,
        publishedDate: status === "Published" ? new Date().toISOString() : stored.publishedDate,
      };
      setStoredItem(STORAGE_KEYS.RESULTS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-result"] });
      queryClient.invalidateQueries({ queryKey: ["all-results"] });
    },
  });
}

// ==========================================
// 7. Settings Queries & Mutations
// ==========================================
export function useSettingsQuery() {
  return useQuery({
    queryKey: ["school-settings"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 80));
      return getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SCHOOL_SETTINGS);
    },
    initialData: INITIAL_SCHOOL_SETTINGS,
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: Partial<typeof INITIAL_SCHOOL_SETTINGS>) => {
      await new Promise((res) => setTimeout(res, 300));
      const current = getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SCHOOL_SETTINGS);
      const updated = { ...current, ...newSettings };
      setStoredItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-settings"] });
    },
  });
}

