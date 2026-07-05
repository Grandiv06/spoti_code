"use client";

import React, { useMemo, useState } from "react";
import { Eye, Edit3, Inbox, Copy, Check } from "lucide-react";
import { User } from "./types";
import { UserRoleBadge, UserStatusBadge } from "./Badges";
import { toPersianDigits, formatPrice, formatPhone, formatPersianDate } from "./utils";
import { toEnglishDigits } from "@/lib/digits";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

function CopyUserIdButton({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(toEnglishDigits(userId));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => void handleCopy(event)}
      title="کپی شناسه کاربر"
      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs font-bold text-gray-600 transition-all hover:border-gray-200 hover:text-gray-900 dark:border-white/5 dark:bg-black/20 dark:text-gray-300 dark:hover:border-white/10 dark:hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "کپی شد" : "کپی شناسه"}</span>
    </button>
  );
}

interface UsersTableProps {
  users: User[];
  onShowDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onClearFilters: () => void;
}

export default function UsersTable({
  users,
  onShowDetails,
  onEditUser,
  onClearFilters,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.max(1, Math.ceil(users.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, users.length);
  const paginatedUsers = useMemo(
    () => users.slice(startIndex, endIndex),
    [endIndex, startIndex, users]
  );

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/5 p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 dark:bg-black/20 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
          کاربری با این مشخصات پیدا نشد
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">
          هیچ کاربری با فیلترها و کلمه کلیدی جستجوی فعلی شما مطابقت ندارد. فیلترها را پاک کنید یا عبارت دیگری بنویسید.
        </p>
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary/20"
        >
          پاک کردن فیلترها
        </button>
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-right border-collapse text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 w-24">شناسه</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">کاربر</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap min-w-[8.5rem]">شماره تماس</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">وضعیت حساب</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 text-center w-24">دوره‌ها</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap min-w-[7.5rem]">ارزش کل (LTV)</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 w-32">تاریخ عضویت</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 text-center w-48">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => onShowDetails(user)}
                className="hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
              >
                {/* ID Column */}
                <td className="py-4 px-6" onClick={(event) => event.stopPropagation()}>
                  <CopyUserIdButton userId={user.id} />
                </td>

                {/* Name / User Info Column */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${
                        user.avatarColor || "from-emerald-400 to-teal-600"
                      } flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-gray-900 dark:text-white text-sm truncate">
                        {user.name}
                      </span>
                      <div className="mt-0.5">
                        <UserRoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Phone Column */}
                <td className="py-4 px-6">
                  <span
                    dir="ltr"
                    className="font-bold text-gray-700 dark:text-gray-300 text-xs inline-block text-left whitespace-nowrap [unicode-bidi:plaintext]"
                  >
                    {formatPhone(user.phone)}
                  </span>
                </td>

                {/* Status Column */}
                <td className="py-4 px-6">
                  <UserStatusBadge status={user.status} />
                </td>

                {/* Course Count Column */}
                <td className="py-4 px-6 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-black/20 text-gray-800 dark:text-gray-300 font-black text-xs min-w-[32px]">
                    {toPersianDigits(user.courses)}
                  </span>
                </td>

                {/* LTV Column */}
                <td className="py-4 px-6">
                  <span className="inline-block font-black text-gray-900 dark:text-white text-xs whitespace-nowrap">
                    {formatPrice(user.ltv)}
                  </span>
                </td>

                {/* Joined At Column */}
                <td className="py-4 px-6">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                    {formatPersianDate(user.joinedAt)}
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowDetails(user);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10 bg-gray-50 dark:bg-black/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>نمایش</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditUser(user);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-primary/20 hover:border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ویرایش</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminTablePagination
        totalItems={users.length}
        currentPage={safePage}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
        itemLabel="کاربر"
      />
    </div>
  );
}
