"use client";

import React, { useEffect, useMemo, useState } from "react";
import TransactionHeader from "./_components/TransactionHeader";
import TransactionStats from "./_components/TransactionStats";
import TransactionFilters from "./_components/TransactionFilters";
import TransactionTable from "./_components/TransactionTable";
import PanelTransactionsSkeleton from "./_components/PanelTransactionsSkeleton";
import { Transaction } from "./data";
import { apiGetNoMock } from "@/lib/api";

type TransactionsResponse = {
  data?: unknown;
};

function mapStatus(value: unknown): Transaction["status"] {
  const v = String(value ?? "").toLowerCase();
  if (v === "completed" || v === "success" || v === "paid") return "success";
  if (v === "failed" || v === "error" || v === "canceled") return "failed";
  if (v === "refunded" || v === "refund") return "refunded";
  return "pending";
}

function mapType(value: unknown): Transaction["type"] {
  const v = String(value ?? "").toLowerCase();
  if (v === "refund" || v === "withdrawal" || v === "returned") return "refund";
  if (v === "deposit") return "deposit";
  return "payment";
}

export default function PanelTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const result = await apiGetNoMock<TransactionsResponse>(
          "/api/dashboard/my-transactions",
          token ? { Authorization: `Bearer ${token}` } : undefined
        );

        const rawList = Array.isArray(result?.data)
          ? result.data
          : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
            ? ((result?.data as { items?: unknown[] }).items as unknown[])
            : [];

        const mapped: Transaction[] = rawList.map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          const rawDate = String(row.createdAt ?? row.date ?? "");
          const dateObj = rawDate ? new Date(rawDate) : null;
          const validDate = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj : null;
          const amountRaw = Number(row.amount ?? row.totalAmount ?? row.price ?? 0);

          return {
            id: String(row.id ?? row.transactionId ?? `TRX-${index + 1}`),
            type: mapType(row.type),
            description: String(row.description ?? row.title ?? "تراکنش"),
            amount: Number.isFinite(amountRaw) ? amountRaw : 0,
            status: mapStatus(row.status),
            date: validDate ? validDate.toLocaleDateString("fa-IR") : "-",
            time: validDate ? validDate.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "-",
            paymentMethod: String(row.paymentMethod ?? row.gateway ?? "نامشخص"),
            trackingCode: String(row.trackingCode ?? row.authority ?? row.refId ?? "---"),
            productTitle: String(row.productTitle ?? row.courseTitle ?? row.productName ?? "-"),
          };
        });

        setTransactions(mapped);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    const totalPayments = transactions
      .filter((t) => t.type === "payment" && t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0);
    const successfulTransactions = transactions.filter((t) => t.status === "success").length;
    const latestTransactionAmount = transactions[0]?.amount ?? 0;
    return { totalPayments, successfulTransactions, latestTransactionAmount };
  }, [transactions]);

  if (loading) {
    return <PanelTransactionsSkeleton />;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-1000" dir="rtl">
      {/* Header Section */}
      <TransactionHeader />

      {/* Stats Cards */}
      <TransactionStats
        totalPayments={stats.totalPayments}
        successfulTransactions={stats.successfulTransactions}
        latestTransactionAmount={stats.latestTransactionAmount}
      />

      {/* Filters & Search */}
      <TransactionFilters />

      {/* Transactions Table / List */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}
