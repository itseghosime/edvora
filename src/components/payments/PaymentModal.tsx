"use client";

import React, { useState } from "react";
import { X, CheckCircle2, CreditCard, Building2, Smartphone, ShieldCheck, Printer } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useRecordPaymentMutation } from "@/lib/query/hooks";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pupilId: string;
  pupilName: string;
  classGrade: string;
  currentBalance: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  pupilId,
  pupilName,
  classGrade,
  currentBalance,
}: PaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<"full" | "instalment" | "custom">("full");
  const [customAmount, setCustomAmount] = useState<number>(20000);
  const [channel, setChannel] = useState<"Paystack (Card)" | "Bank Transfer" | "USSD">("Paystack (Card)");
  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "receipt">("form");
  const [latestReceipt, setLatestReceipt] = useState<any>(null);

  const recordPaymentMutation = useRecordPaymentMutation();

  if (!isOpen) return null;

  // Determine amount to pay
  const amountToPay =
    selectedOption === "full"
      ? currentBalance
      : selectedOption === "instalment"
      ? Math.min(20000, currentBalance)
      : Math.min(customAmount, currentBalance);

  const remainingBalancePreview = Math.max(0, currentBalance - amountToPay);

  const handlePay = () => {
    if (amountToPay <= 0) return;

    setCheckoutStep("processing");

    recordPaymentMutation.mutate(
      {
        pupilId,
        amount: amountToPay,
        channel,
        notes:
          selectedOption === "full"
            ? "Full term clearance"
            : `Instalment payment of ${formatNaira(amountToPay)}`,
      },
      {
        onSuccess: (result) => {
          setLatestReceipt(result.payment);
          setCheckoutStep("receipt");
        },
        onError: () => {
          alert("Payment processing encountered an error. Please try again.");
          setCheckoutStep("form");
        },
      }
    );
  };

  const handleClose = () => {
    setCheckoutStep("form");
    setLatestReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={checkoutStep === "processing" ? undefined : handleClose}
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ink-border z-10 animate-in zoom-in-95 duration-200">
        {checkoutStep === "form" && (
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-ink-border">
              <div>
                <span className="text-xs uppercase tracking-wider text-forest font-bold">
                  Secure Term Payment
                </span>
                <h3 className="text-xl font-heading font-extrabold text-ink mt-0.5">
                  Pay School Fees
                </h3>
                <p className="text-xs text-ink-muted">
                  {pupilName} · {classGrade}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-ink-muted hover:text-ink hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Current balance reminder */}
              <div className="bg-ivory-50 p-4 rounded-2xl border border-ink-border flex justify-between items-center">
                <span className="text-xs text-ink-muted">Current Outstanding Balance</span>
                <span className="text-lg font-bold font-heading text-ink">
                  {formatNaira(currentBalance)}
                </span>
              </div>

              {/* Amount options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink">Select Payment Option</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOption("full")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedOption === "full"
                        ? "border-forest bg-forest-50/50 text-forest ring-1 ring-forest"
                        : "border-ink-border hover:bg-gray-50 text-ink"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-ink-muted">Full Balance</div>
                    <div className="text-sm font-bold mt-1 text-ink">{formatNaira(currentBalance)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOption("instalment")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedOption === "instalment"
                        ? "border-forest bg-forest-50/50 text-forest ring-1 ring-forest"
                        : "border-ink-border hover:bg-gray-50 text-ink"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-ink-muted">Instalment</div>
                    <div className="text-sm font-bold mt-1 text-ink">{formatNaira(Math.min(20000, currentBalance))}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOption("custom")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedOption === "custom"
                        ? "border-forest bg-forest-50/50 text-forest ring-1 ring-forest"
                        : "border-ink-border hover:bg-gray-50 text-ink"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-ink-muted">Custom Amount</div>
                    <div className="text-sm font-bold mt-1 text-ink">Other</div>
                  </button>
                </div>
              </div>

              {/* Custom input if chosen */}
              {selectedOption === "custom" && (
                <div className="animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-ink block mb-1">
                    Enter Amount (₦)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    max={currentBalance}
                    step={1000}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest"
                    placeholder="Enter amount to pay"
                  />
                </div>
              )}

              {/* Remaining balance preview */}
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-mint-light/70 rounded-xl text-forest-800">
                <span>Remaining balance after this payment:</span>
                <span className="font-bold text-sm">
                  {formatNaira(remainingBalancePreview)}
                </span>
              </div>

              {/* Payment Channel Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-ink">Payment Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("Paystack (Card)")}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      channel === "Paystack (Card)"
                        ? "border-forest bg-forest-50/60 text-forest ring-1 ring-forest"
                        : "border-ink-border text-ink-muted hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs font-semibold">Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("Bank Transfer")}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      channel === "Bank Transfer"
                        ? "border-forest bg-forest-50/60 text-forest ring-1 ring-forest"
                        : "border-ink-border text-ink-muted hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("USSD")}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      channel === "USSD"
                        ? "border-forest bg-forest-50/60 text-forest ring-1 ring-forest"
                        : "border-ink-border text-ink-muted hover:bg-gray-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs font-semibold">USSD</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-ink-border">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>256-bit encrypted checkout</span>
              </div>
              <button
                type="button"
                onClick={handlePay}
                disabled={amountToPay <= 0}
                className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                Pay {formatNaira(amountToPay)}
              </button>
            </div>
          </div>
        )}

        {checkoutStep === "processing" && (
          <div className="py-12 text-center">
            <div className="w-14 h-14 border-4 border-forest-100 border-t-forest rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-heading font-extrabold text-ink">
              Verifying Payment
            </h3>
            <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
              Connecting securely to provider gateway. Verifying transaction reference and updating pupil balance...
            </p>
          </div>
        )}

        {checkoutStep === "receipt" && latestReceipt && (
          <div>
            <div className="text-center pb-6 border-b border-ink-border">
              <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-forest mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Payment Verified & Credited
              </span>
              <h3 className="text-2xl font-extrabold font-heading text-ink mt-1">
                {formatNaira(latestReceipt.amount)}
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Official electronic bursary receipt
              </p>
            </div>

            <div className="py-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-ink-muted">Receipt Number</span>
                <span className="font-mono font-bold text-ink">{latestReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-ink-muted">Pupil</span>
                <span className="font-semibold text-ink">{latestReceipt.pupilName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-ink-muted">Reference</span>
                <span className="font-mono text-ink-muted text-[11px]">{latestReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-ink-muted">Channel</span>
                <span className="font-semibold text-ink">{latestReceipt.channel}</span>
              </div>
              <div className="flex justify-between py-1 bg-ivory-50 p-2.5 rounded-xl border border-ink-border">
                <span className="text-ink font-semibold">New Outstanding Balance</span>
                <span className="font-bold text-sm text-forest font-heading">
                  {formatNaira(latestReceipt.balanceAfter)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-ink bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-forest hover:bg-forest-600 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

