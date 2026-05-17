"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, CheckCircle2 } from "lucide-react";
import { User, initialUsersData } from "./_components/types";
import UsersStats from "./_components/UsersStats";
import UsersFilters from "./_components/UsersFilters";
import UsersTable from "./_components/UsersTable";
import EditUserModal from "./_components/EditUserModal";
import AddUserModal from "./_components/AddUserModal";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminUsersPage() {
  const router = useRouter();
  
  // Central State for Users with localStorage persistence
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("spoticode_admin_users");
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        setUsers(initialUsersData);
      }
    } else {
      setUsers(initialUsersData);
      localStorage.setItem("spoticode_admin_users", JSON.stringify(initialUsersData));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("spoticode_admin_users", JSON.stringify(users));
    }
  }, [users, isLoaded]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Modals Open/Close and Selected Items
  const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toast System State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== "" || statusFilter !== "all" || planFilter !== "all";
  }, [searchQuery, statusFilter, planFilter]);

  // Clear Filters Handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlanFilter("all");
    setSortBy("newest");
    showToast("فیلترها با موفقیت پاک شدند.", "info");
  };

  // Filter and Sort Logic
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.id.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    // 3. Plan Filter
    if (planFilter !== "all") {
      result = result.filter((u) => u.plan === planFilter);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "highest_ltv") {
        return b.ltv - a.ltv;
      }
      if (sortBy === "highest_courses") {
        return b.courses - a.courses;
      }
      // default or 'newest'
      const idA = parseInt(a.id.replace("USR-", "")) || 0;
      const idB = parseInt(b.id.replace("USR-", "")) || 0;
      return idB - idA; // higher ID is newer
    });

    return result;
  }, [users, searchQuery, statusFilter, planFilter, sortBy]);

  // Handle Operations
  const handleShowDetails = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    setSelectedEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsEditModalOpen(false);
    showToast(`مشخصات کاربر «${updatedUser.name}» با موفقیت ویرایش شد.`, "success");
  };

  const handleAddUser = (newUser: User) => {
    // Generate next unique user ID
    const numericIds = users
      .map((u) => parseInt(u.id.replace("USR-", "")))
      .filter((n) => !isNaN(n));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1000;
    
    const preparedUser = {
      ...newUser,
      id: `USR-${nextId}`,
    };

    setUsers((prev) => [preparedUser, ...prev]);
    setIsAddModalOpen(false);
    showToast(`کاربر جدید «${preparedUser.name}» با موفقیت به پلتفرم اضافه شد.`, "success");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      
      {/* Premium Header Card */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        {/* Glow Circles */}
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

      {/* Dynamic Stats Cards */}
      <UsersStats users={users} />

      {/* Filters Section */}
      <UsersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={handleClearFilters}
        isFiltersExpanded={isFiltersExpanded}
        setIsFiltersExpanded={setIsFiltersExpanded}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Users Data Table */}
      <UsersTable
        users={filteredAndSortedUsers}
        onShowDetails={handleShowDetails}
        onEditUser={handleEditUser}
        onClearFilters={handleClearFilters}
      />

      {/* Modal: Edit User */}
      <EditUserModal
        user={selectedEditUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Modal: Add User */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      {/* Custom Toast Notifications Overlay */}
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
