"use client";

import { useRef, useState } from "react";
import {
  X,
  ShieldAlert,
  Calendar,
  User,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
  MessageSquare,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ClaimStatusBadge from "./ClaimStatusBadge";

interface ClaimReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: any;
  onUpdateStatus: (id: string, status: any, note: string) => Promise<void>;
}

export default function ClaimReviewModal({
  isOpen,
  onClose,
  claim,
  onUpdateStatus,
}: ClaimReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useClickOutside(modalRef, onClose);

  if (!isOpen || !claim) return null;

  const handleAction = async (newStatus: string) => {
    if (!note.trim()) {
      alert("Please provide a justification note for this status change.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onUpdateStatus(claim.id, newStatus, note);
      setNote("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-end p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-[3rem] overflow-hidden border-l border-slate-100 dark:border-gray-800"
      >
        {/* --- HEADER --- */}
        <div className="p-10 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl">
              <Fingerprint size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {claim.claimNumber}
                </h2>
                <ClaimStatusBadge status={claim.status} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Policy Enforcement & Evidence Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-rose-500 hover:text-white rounded-full transition-all"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {/* 1. RISK ANALYSIS BOX */}
          <div
            className={cn(
              "p-6 rounded-4xl border flex items-center justify-between",
              claim.isFraud
                ? "bg-rose-50 border-rose-100"
                : "bg-emerald-50 border-emerald-100",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-xl",
                  claim.isFraud
                    ? "bg-rose-500 text-white"
                    : "bg-emerald-500 text-white",
                )}
              >
                <ShieldAlert size={20} />
              </div>
              <div>
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    claim.isFraud ? "text-rose-600" : "text-emerald-600",
                  )}
                >
                  System Fraud Analysis
                </p>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  {claim.isFraud
                    ? "High-risk patterns detected (Instant Filing)"
                    : "Standard claim pattern verified"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">
                {claim.fraudScore}%
              </p>
              <p className="text-[8px] font-bold uppercase text-slate-400">
                Risk Score
              </p>
            </div>
          </div>

          {/* 2. CUSTOMER & PRODUCT INFO */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <User size={12} /> Origin Wallet/User
              </h4>
              <div className="bg-slate-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-slate-100 dark:border-gray-700">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                  {claim.user.name}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-1">
                  {claim.user.email}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <FileText size={12} /> Asset Identity
              </h4>
              <div className="bg-slate-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-slate-100 dark:border-gray-700">
                <p className="text-xs font-black text-blue-600 uppercase">
                  {claim.product.name}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-1 font-mono uppercase">
                  {claim.product.sku}
                </p>
              </div>
            </div>
          </div>

          {/* 3. ISSUE DESCRIPTION */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Statement of Issue
            </h4>
            <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-4xl border border-slate-100 dark:border-gray-800">
              <h5 className="text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
                {claim.subject}
              </h5>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                {claim.description}
              </p>
            </div>
          </div>

          {/* 4. EVIDENCE VAULT */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Evidence Documents
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {/* Dummy Evidence - In real app, map over claim.documents */}
              <div className="aspect-square bg-slate-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-blue-500 transition-all cursor-pointer">
                <FileText className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-[8px] font-black uppercase text-slate-400">
                  Proof_01.jpg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="p-10 border-t border-slate-100 dark:border-gray-800 space-y-6 bg-white dark:bg-gray-900">
          <div className="relative">
            <MessageSquare
              className="absolute left-4 top-4 text-slate-400"
              size={16}
            />
            <textarea
              placeholder="Internal resolution notes or rejection reason..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-800 rounded-2xl text-xs font-bold outline-none focus:ring-4 ring-blue-600/5 min-h-25 transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={isSubmitting}
              onClick={() => handleAction("REJECTED")}
              className="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-600 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Reject Claim
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => handleAction("RESOLVED")}
              className="flex-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Approve & Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
