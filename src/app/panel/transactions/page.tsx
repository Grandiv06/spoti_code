"use client";

import React from "react";
import TransactionHeader from "./_components/TransactionHeader";
import TransactionStats from "./_components/TransactionStats";
import TransactionFilters from "./_components/TransactionFilters";
import TransactionTable from "./_components/TransactionTable";

export default function PanelTransactionsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-1000" dir="rtl">
      {/* Header Section */}
      <TransactionHeader />

      {/* Stats Cards */}
      <TransactionStats />

      {/* Filters & Search */}
      <TransactionFilters />

      {/* Transactions Table / List */}
      <TransactionTable />
    </div>
  );
}
