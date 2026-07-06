"use client";

import React, { useMemo, useState } from "react";
import { Eye, Edit3, Inbox, Copy, Check } from "lucide-react";
import { User } from "./types";
import { UserRoleBadge, UserStatusBadge } from "./Badges";
import { toPersianDigits, formatPhone, formatPersianDate } from "./utils";
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
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-right text-sm">
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[19%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[13%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-black/10">
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500">شناسه</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500">کاربر</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">شماره تماس</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">وضعیت حساب</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">دوره‌ها</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">تاریخ عضویت</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-500">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => onShowDetails(user)}
                className="cursor-pointer transition-colors duration-200 hover:bg-gray-50/30 dark:hover:bg-white/[0.02]"
              >
                <td className="px-4 py-4 align-middle" onClick={(event) => event.stopPropagation()}>
                  <div className="flex justify-start">
                    <CopyUserIdButton userId={user.id} />
                  </div>
                </td>

                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center justify-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                        user.avatarColor || "from-emerald-400 to-teal-600"
                      } text-xs font-black text-white shadow-sm`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-black text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                      <div className="mt-0.5">
                        <UserRoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 align-middle text-center">
                  <span
                    dir="ltr"
                    className="inline-block whitespace-nowrap text-xs font-bold text-gray-700 dark:text-gray-300 [unicode-bidi:plaintext]"
                  >
                    {formatPhone(user.phone)}
                  </span>
                </td>

                <td className="px-4 py-4 text-center align-middle">
                  <div className="flex justify-center">
                    <UserStatusBadge status={user.status} />
                  </div>
                </td>

                <td className="px-4 py-4 text-center align-middle">
                  <span className="inline-block min-w-[32px] rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-800 dark:bg-black/20 dark:text-gray-300">
                    {toPersianDigits(user.courses)}
                  </span>
                </td>

                <td className="px-4 py-4 text-center align-middle">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {formatPersianDate(user.joinedAt)}
                  </span>
                </td>

                <td className="px-4 py-4 text-center align-middle">
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
