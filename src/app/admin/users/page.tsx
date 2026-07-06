"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus, Users } from "lucide-react";
import { User } from "./_components/types";
import UsersStats from "./_components/UsersStats";
import UsersStatsSkeleton from "./_components/UsersStatsSkeleton";
import UsersFilters from "./_components/UsersFilters";
import UsersTable from "./_components/UsersTable";
import UsersTableSkeleton from "./_components/UsersTableSkeleton";
import EditUserModal from "./_components/EditUserModal";
import AddUserModal from "./_components/AddUserModal";
import { useAdminUsersQuery, useCreateAdminUserMutation } from "@/hooks/api/useAdminUsersQuery";
import type { AdminUserCreateInput } from "@/lib/admin-users";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

function UsersErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-black">بارگذاری لیست کاربران انجام نشد.</p>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          <CheckCircle2 className="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [selectedEditUserId, setSelectedEditUserId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminUsersQuery({
    search: debouncedSearchQuery || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });
  const createUserMutation = useCreateAdminUserMutation();

  useEffect(() => {
    if (!data?.users) return undefined;

    const timer = window.setTimeout(() => {
      setUsers(data.users);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [data?.users]);

  const isLoadingUsers = isPending || isFetching;
  const showUsersContent = !isError || users.length > 0;

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== "" || statusFilter !== "all" || roleFilter !== "all";
  }, [roleFilter, searchQuery, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setSortBy("newest");
    showToast("فیلترها با موفقیت پاک شدند.", "info");
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "highest_ltv") {
        return b.ltv - a.ltv;
      }
      if (sortBy === "highest_courses") {
        return b.courses - a.courses;
      }
      const idA = Number(String(a.id).replace(/\D/g, "")) || 0;
      const idB = Number(String(b.id).replace(/\D/g, "")) || 0;
      return idB - idA;
    });

    return result;
  }, [users, statusFilter, sortBy]);

  const handleShowDetails = (user: User) => {
    router.push(`/admin/users/detail?id=${encodeURIComponent(user.id)}`);
  };

  const handleEditUser = (user: User) => {
    setSelectedEditUserId(user.id);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    setIsEditModalOpen(false);
    setSelectedEditUserId(null);
    void refetch();
    showToast(`مشخصات کاربر «${updatedUser.name}» با موفقیت ویرایش شد.`, "success");
  };

  const handleAddUser = (newUser: AdminUserCreateInput) => {
    createUserMutation.mutate(newUser, {
      onSuccess: (createdUser) => {
        setUsers((prev) => [createdUser, ...prev.filter((user) => user.id !== createdUser.id)]);
        setIsAddModalOpen(false);
        showToast(`کاربر جدید «${createdUser.name}» با موفقیت به پلتفرم اضافه شد.`, "success");
        void refetch();
      },
      onError: (mutationError) => {
        const message =
          mutationError instanceof Error ? mutationError.message : "ایجاد کاربر جدید انجام نشد.";
        showToast(message, "error");
      },
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">مدیریت کاربران</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                مشاهده، مدیریت، ویرایش و بررسی وضعیت کاربران پلتفرم
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>افزودن کاربر جدید</span>
          </button>
        </div>
      </div>

      {isError ? (
        <div className="mb-8">
          <UsersErrorState
            message={error?.message || "لطفاً اتصال شبکه و سطح دسترسی کاربر را بررسی کنید."}
            onRetry={() => void refetch()}
          />
        </div>
      ) : null}

      {isLoadingUsers ? (
        <UsersStatsSkeleton />
      ) : showUsersContent ? (
        <UsersStats users={users} />
      ) : null}

      <UsersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={handleClearFilters}
        isFiltersExpanded={isFiltersExpanded}
        setIsFiltersExpanded={setIsFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoadingUsers ? (
        <UsersTableSkeleton />
      ) : showUsersContent ? (
        <UsersTable
          users={filteredAndSortedUsers}
          onShowDetails={handleShowDetails}
          onEditUser={handleEditUser}
          onClearFilters={handleClearFilters}
        />
      ) : null}

      <EditUserModal
        userId={selectedEditUserId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditUserId(null);
        }}
        onSave={handleSaveUser}
        onError={(message) => showToast(message, "error")}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full" dir="rtl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-left duration-300 ${
              t.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : t.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
