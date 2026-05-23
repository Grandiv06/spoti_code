import React from "react";
import { Eye, Edit3, UserCheck, Inbox } from "lucide-react";
import { User } from "./types";
import { UserStatusBadge } from "./Badges";
import { toPersianDigits, formatPrice, formatPhone, formatPersianDate } from "./utils";

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
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 w-24">شناسه</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">کاربر</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">شماره تماس</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">وضعیت حساب</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 text-center w-24">دوره‌ها</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500">ارزش کل (LTV)</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 w-32">تاریخ عضویت</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 dark:text-gray-500 text-center w-48">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors duration-200"
              >
                {/* ID Column */}
                <td className="py-4 px-6">
                  <span className="font-mono text-xs font-bold text-gray-400 dark:text-zinc-500 px-2.5 py-1 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl block text-center w-fit">
                    {toPersianDigits(user.id)}
                  </span>
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
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate mt-0.5" dir="ltr">
                        {user.email}
                      </span>
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
                  <span className="font-black text-gray-900 dark:text-white text-xs">
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
                      onClick={() => onShowDetails(user)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10 bg-gray-50 dark:bg-black/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>نمایش</span>
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
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
    </div>
  );
}
