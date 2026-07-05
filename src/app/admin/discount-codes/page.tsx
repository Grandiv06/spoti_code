"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BadgePercent, CheckCircle2, Clock3, Pencil, Plus, Search, TicketPercent, ToggleLeft, ToggleRight, Trash2, X, Percent, BookOpen, UserCog } from "lucide-react";
import { apiDeleteNoMock, apiGetNoMock, apiPostNoMock, apiPutNoMock } from "@/lib/api";
import { normalizeAdminDiscountsResponse } from "@/lib/admin-discounts";
import { sanitizeNumericInput } from "@/lib/digits";
import CustomSelect from "@/components/ui/CustomSelect";
import DateTimePicker from "@/components/ui/DateTimePicker";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

type DiscountType = "percentage" | "fixed";
type ScopeType = "all" | "specific";
type ApplyType = "user" | "admin" | "both";

type DiscountCodeItem = {
  id: string;
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  scope: ScopeType;
  selectedCourseIds: string[];
  startAt: string;
  endAt: string;
  usageLimit: string;
  usagePerUser: string;
  applyType: ApplyType;
  isEnabled: boolean;
  usedCount: number;
};

type DiscountFormState = {
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: string;
  scope: ScopeType;
  selectedCourseIds: string[];
  startAt: string;
  endAt: string;
  usageLimit: string;
  usagePerUser: string;
  applyType: ApplyType;
  isEnabled: boolean;
};

type CourseOption = {
  id: string;
  title: string;
};

const emptyForm = (): DiscountFormState => ({
  title: "",
  code: "",
  discountType: "percentage",
  discountValue: "",
  scope: "all",
  selectedCourseIds: [],
  startAt: "",
  endAt: "",
  usageLimit: "",
  usagePerUser: "",
  applyType: "user",
  isEnabled: true,
});

const applyTypeTableTitle: Record<ApplyType, string> = {
  user: "توسط کاربر با وارد کردن کد",
  admin: "اعمال خودکار توسط ادمین",
  both: "هر دو روش",
};

const discountTypeOptions = [
  { value: "percentage", label: "درصدی" },
  { value: "fixed", label: "مبلغ ثابت" },
];

const scopeOptions = [
  { value: "all", label: "همه دوره‌ها" },
  { value: "specific", label: "انتخاب دوره خاص" },
];

const applyTypeOptions = [
  { value: "user", label: "توسط کاربر با وارد کردن کد" },
  { value: "admin", label: "اعمال خودکار توسط ادمین" },
];

const formSelectClassName =
  "[&_button]:h-11 [&_button]:min-h-[44px] [&_button]:rounded-xl [&_button]:text-xs [&_button]:px-4";

export default function AdminDiscountCodesPage() {
  const [discounts, setDiscounts] = useState<DiscountCodeItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [form, setForm] = useState<DiscountFormState>(emptyForm);
  const [courseQuery, setCourseQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editItem, setEditItem] = useState<DiscountCodeItem | null>(null);
  const [editForm, setEditForm] = useState<DiscountFormState>(emptyForm);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editCourseQuery, setEditCourseQuery] = useState("");
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(true);
  const [isCreatingDiscount, setIsCreatingDiscount] = useState(false);
  const [isUpdatingDiscount, setIsUpdatingDiscount] = useState(false);
  const [createNotice, setCreateNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editNotice, setEditNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const mapDiscountItem = (item: ReturnType<typeof normalizeAdminDiscountsResponse>[number]): DiscountCodeItem => ({
    id: item.id,
    title: item.title,
    code: item.code,
    discountType: item.discountType,
    discountValue: item.discountValue,
    scope: item.scope,
    selectedCourseIds: item.selectedCourseIds,
    startAt: item.startAt,
    endAt: item.endAt,
    usageLimit: item.usageLimit,
    usagePerUser: item.usagePerUser,
    applyType: item.applyType,
    isEnabled: item.isEnabled,
    usedCount: item.usedCount,
  });

  const reloadDiscounts = async () => {
    const response = await apiGetNoMock<unknown>("/api/admin-dashboard/discounts");
    const mapped = normalizeAdminDiscountsResponse(response).map(mapDiscountItem);
    setDiscounts(mapped);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountResponse, courseResponse] = await Promise.all([
          apiGetNoMock<unknown>("/api/admin-dashboard/discounts"),
          apiGetNoMock<{ data?: { courses?: CourseOption[] } }>("/api/admin-dashboard/discounts?courses=1"),
        ]);

        const mapped = normalizeAdminDiscountsResponse(discountResponse).map(mapDiscountItem);
        setDiscounts(mapped);
        setCourses(courseResponse?.data?.courses ?? []);
      } catch {
        setDiscounts([]);
        setCourses([]);
      } finally {
        setIsLoadingDiscounts(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.includes(q));
  }, [courseQuery, courses]);

  const filteredEditCourses = useMemo(() => {
    const q = editCourseQuery.trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.includes(q));
  }, [editCourseQuery, courses]);

  const stats = useMemo(() => {
    const now = new Date();
    const expired = discounts.filter((d) => new Date(d.endAt) < now).length;
    const active = discounts.filter((d) => d.isEnabled && new Date(d.endAt) >= now).length;
    const used = discounts.reduce((sum, d) => sum + d.usedCount, 0);
    return {
      total: discounts.length,
      active,
      expired,
      used,
    };
  }, [discounts]);
  const totalDiscountPages = Math.max(1, Math.ceil(discounts.length / rowsPerPage));
  const safeDiscountPage = Math.min(currentPage, totalDiscountPages);
  const discountStartIndex = (safeDiscountPage - 1) * rowsPerPage;
  const discountEndIndex = Math.min(discountStartIndex + rowsPerPage, discounts.length);
  const paginatedDiscounts = useMemo(
    () => discounts.slice(discountStartIndex, discountEndIndex),
    [discountEndIndex, discountStartIndex, discounts]
  );

  const validate = (state: DiscountFormState) => {
    const nextErrors: Record<string, string> = {};
    if (!state.code.trim()) nextErrors.code = "کد تخفیف الزامی است.";

    const normalizedValue = sanitizeNumericInput(state.discountValue);
    if (!normalizedValue) {
      nextErrors.discountValue = "مقدار تخفیف الزامی است.";
    } else {
      const valueNum = Number(normalizedValue);
      if (!Number.isFinite(valueNum) || valueNum <= 0) {
        nextErrors.discountValue = "مقدار تخفیف باید بیشتر از صفر باشد.";
      } else if (state.discountType === "percentage" && valueNum > 100) {
        nextErrors.discountValue = "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.";
      }
    }

    if (state.startAt && state.endAt && new Date(state.endAt) <= new Date(state.startAt)) {
      nextErrors.endAt = "تاریخ پایان باید بعد از تاریخ شروع باشد.";
    }

    if (state.scope === "specific" && state.selectedCourseIds.length === 0) {
      nextErrors.selectedCourseIds = "حداقل یک دوره را انتخاب کنید.";
    }

    if (state.usageLimit.trim() && Number(state.usageLimit) <= 0) {
      nextErrors.usageLimit = "محدودیت استفاده باید عدد مثبت باشد.";
    }
    if (state.usagePerUser.trim() && Number(state.usagePerUser) <= 0) {
      nextErrors.usagePerUser = "محدودیت هر کاربر باید عدد مثبت باشد.";
    }

    return nextErrors;
  };

  const buildDiscountPayload = (state: DiscountFormState) => ({
    title: state.title.trim() || undefined,
    code: state.code.trim().toUpperCase(),
    discountType: state.discountType,
    discountValue: Number(sanitizeNumericInput(state.discountValue)),
    scope: state.scope,
    selectedCourseIds: state.scope === "all" ? [] : state.selectedCourseIds,
    applyType: state.applyType,
    startsAt: state.startAt || undefined,
    expiresAt: state.endAt || undefined,
    isEnabled: state.isEnabled,
    globalUsageLimit: state.usageLimit.trim() ? Number(state.usageLimit) : undefined,
    perUserUsageLimit: state.usagePerUser.trim() ? Number(state.usagePerUser) : undefined,
  });

  const makeAutoCode = () => {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const num = Math.floor(Math.random() * 90 + 10);
    setForm((p) => ({ ...p, code: `SPOTI${num}${random}` }));
  };

  const makeAutoCodeForEdit = () => {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const num = Math.floor(Math.random() * 90 + 10);
    setEditForm((p) => ({ ...p, code: `SPOTI${num}${random}` }));
  };

  const toggleCourse = (courseId: string, target: "create" | "edit") => {
    if (target === "create") {
      setForm((p) => ({
        ...p,
        selectedCourseIds: p.selectedCourseIds.includes(courseId)
          ? p.selectedCourseIds.filter((id) => id !== courseId)
          : [...p.selectedCourseIds, courseId],
      }));
      return;
    }
    setEditForm((p) => ({
      ...p,
      selectedCourseIds: p.selectedCourseIds.includes(courseId)
        ? p.selectedCourseIds.filter((id) => id !== courseId)
        : [...p.selectedCourseIds, courseId],
    }));
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setCreateNotice({
        type: "error",
        message: nextErrors.discountValue || Object.values(nextErrors)[0],
      });
      return;
    }
    setCreateNotice(null);

    setIsCreatingDiscount(true);
    try {
      await apiPostNoMock("/api/admin-dashboard/discounts", buildDiscountPayload(form));
      await reloadDiscounts();
      setForm(emptyForm());
      setCourseQuery("");
      setErrors({});
      setCreateNotice({ type: "success", message: "کد تخفیف با موفقیت در سرور ثبت شد." });
    } catch (error) {
      setCreateNotice({
        type: "error",
        message: error instanceof Error ? error.message : "ثبت کد تخفیف در سرور انجام نشد.",
      });
    } finally {
      setIsCreatingDiscount(false);
    }
  };

  const openEdit = (item: DiscountCodeItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      code: item.code,
      discountType: item.discountType,
      discountValue: String(item.discountValue),
      scope: item.scope,
      selectedCourseIds: item.selectedCourseIds,
      startAt: item.startAt,
      endAt: item.endAt,
      usageLimit: item.usageLimit,
      usagePerUser: item.usagePerUser,
      applyType: item.applyType === "both" ? "user" : item.applyType,
      isEnabled: item.isEnabled,
    });
    setEditErrors({});
    setEditCourseQuery("");
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const nextErrors = validate(editForm);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setEditNotice({
        type: "error",
        message: nextErrors.discountValue || Object.values(nextErrors)[0],
      });
      return;
    }

    setIsUpdatingDiscount(true);
    setEditNotice(null);
    try {
      await apiPutNoMock(
        `/api/admin-dashboard/discounts/${encodeURIComponent(editItem.id)}`,
        buildDiscountPayload(editForm)
      );
      await reloadDiscounts();
      setEditNotice({ type: "success", message: "تغییرات کد تخفیف در سرور ذخیره شد." });
      setEditItem(null);
    } catch (error) {
      setEditNotice({
        type: "error",
        message: error instanceof Error ? error.message : "ویرایش کد تخفیف انجام نشد.",
      });
    } finally {
      setIsUpdatingDiscount(false);
    }
  };

  const toggleActive = async (item: DiscountCodeItem) => {
    const nextEnabled = !item.isEnabled;
    setActionNotice(null);
    try {
      await apiPutNoMock(`/api/admin-dashboard/discounts/${encodeURIComponent(item.id)}`, {
        ...buildDiscountPayload({
          title: item.title,
          code: item.code,
          discountType: item.discountType,
          discountValue: String(item.discountValue),
          scope: item.scope,
          selectedCourseIds: item.selectedCourseIds,
          startAt: item.startAt,
          endAt: item.endAt,
          usageLimit: item.usageLimit,
          usagePerUser: item.usagePerUser,
          applyType: item.applyType,
          isEnabled: nextEnabled,
        }),
      });

      await reloadDiscounts();
      setActionNotice({
        type: "success",
        message: nextEnabled ? "کد تخفیف فعال شد." : "کد تخفیف غیرفعال شد.",
      });
    } catch (error) {
      setActionNotice({
        type: "error",
        message: error instanceof Error ? error.message : "تغییر وضعیت کد تخفیف انجام نشد.",
      });
    }
  };

  const removeCode = async (item: DiscountCodeItem) => {
    if (!confirm(`آیا از حذف کد تخفیف «${item.title}» اطمینان دارید؟`)) return;
    setActionNotice(null);
    try {
      await apiDeleteNoMock(`/api/admin-dashboard/discounts/${encodeURIComponent(item.id)}`);
      await reloadDiscounts();
      setActionNotice({ type: "success", message: "کد تخفیف با موفقیت حذف شد." });
    } catch (error) {
      setActionNotice({
        type: "error",
        message: error instanceof Error ? error.message : "حذف کد تخفیف انجام نشد.",
      });
    }
  };

  const getStatus = (item: DiscountCodeItem) => {
    const now = new Date();
    if (new Date(item.endAt) < now) return "expired" as const;
    if (!item.isEnabled) return "disabled" as const;
    return "active" as const;
  };

  const statusBadge = (item: DiscountCodeItem) => {
    const status = getStatus(item);
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          فعال
        </span>
      );
    }
    if (status === "disabled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-black text-gray-600 dark:border-white/10 dark:bg-black/20 dark:text-gray-400">
          <span className="size-1.5 rounded-full bg-gray-400" />
          غیرفعال
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-black text-rose-600 dark:text-rose-400">
        <span className="size-1.5 rounded-full bg-rose-500" />
        منقضی‌شده
      </span>
    );
  };

  const applyTypeBadge = (applyType: ApplyType) => {
    if (applyType === "admin") {
      return (
        <span
          title={applyTypeTableTitle.admin}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-500/15 bg-violet-500/10 px-2 py-0.5 text-[10px] font-black text-violet-600 whitespace-nowrap dark:text-violet-300"
        >
          <Activity className="h-3 w-3 shrink-0" />
          خودکار
        </span>
      );
    }
    if (applyType === "both") {
      return (
        <span
          title={applyTypeTableTitle.both}
          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/15 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-600 whitespace-nowrap dark:text-amber-300"
        >
          <TicketPercent className="h-3 w-3 shrink-0" />
          ترکیبی
        </span>
      );
    }
    return (
      <span
        title={applyTypeTableTitle.user}
        className="inline-flex items-center gap-1 rounded-lg border border-sky-500/15 bg-sky-500/10 px-2 py-0.5 text-[10px] font-black text-sky-600 whitespace-nowrap dark:text-sky-300"
      >
        <UserCog className="h-3 w-3 shrink-0" />
        دستی
      </span>
    );
  };

  const discountTypeBadge = (type: DiscountType) =>
    type === "percentage" ? (
      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-black text-gray-600 whitespace-nowrap dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
        <Percent className="h-3 w-3 shrink-0" />
        درصدی
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-black text-gray-600 whitespace-nowrap dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
        <BadgePercent className="h-3 w-3 shrink-0" />
        ثابت
      </span>
    );

  const formatValue = (item: DiscountCodeItem) =>
    item.discountType === "percentage"
      ? `${item.discountValue.toLocaleString("fa-IR")}٪`
      : `${item.discountValue.toLocaleString("fa-IR")} تومان`;

  const renderCourseLabel = (item: DiscountCodeItem) => {
    if (item.scope === "all") {
      return (
        <span
          title="همه دوره‌ها"
          className="inline-flex items-center gap-1 rounded-lg border border-blue-500/15 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black text-blue-600 whitespace-nowrap dark:text-blue-300"
        >
          <BookOpen className="h-3 w-3 shrink-0" />
          همه
        </span>
      );
    }
    if (item.selectedCourseIds.length <= 2) {
      const names = item.selectedCourseIds
        .map((id) => courses.find((c) => c.id === id)?.title)
        .filter(Boolean)
        .join("، ");
      return (
        <span className="line-clamp-2 text-xs font-semibold text-gray-600 dark:text-gray-300" title={names}>
          {names}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-black text-gray-600 whitespace-nowrap dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
        <BookOpen className="h-3 w-3 shrink-0" />
        {item.selectedCourseIds.length.toLocaleString("fa-IR")} دوره
      </span>
    );
  };

  const formatExpiryDate = (value: string) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
              <TicketPercent className="w-8 h-8" />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">مدیریت کدهای تخفیف</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                ساخت و مدیریت کدهای تخفیف برای دوره‌ها
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <MiniStat title="کل کدهای تخفیف" value={stats.total.toLocaleString("fa-IR")} desc="همه کدهای ساخته‌شده" icon={<BadgePercent className="w-5 h-5 text-emerald-400" />} color="from-emerald-500/10 to-teal-500/5 border-emerald-500/20" bgGlow="bg-emerald-500/5" />
        <MiniStat title="کدهای فعال" value={stats.active.toLocaleString("fa-IR")} desc="قابل استفاده در حال حاضر" icon={<CheckCircle2 className="w-5 h-5 text-green-400" />} color="from-green-500/10 to-lime-500/5 border-green-500/20" bgGlow="bg-green-500/5" />
        <MiniStat title="کدهای منقضی‌شده" value={stats.expired.toLocaleString("fa-IR")} desc="اتمام زمان اعتبار" icon={<Clock3 className="w-5 h-5 text-amber-400" />} color="from-amber-500/10 to-orange-500/5 border-amber-500/20" bgGlow="bg-amber-500/5" />
        <MiniStat title="تعداد استفاده‌ها" value={stats.used.toLocaleString("fa-IR")} desc="مجموع مصرف کدها" icon={<Activity className="w-5 h-5 text-blue-400" />} color="from-blue-500/10 to-indigo-500/5 border-blue-500/20" bgGlow="bg-blue-500/5" />
      </section>

      <section className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-5 md:p-6 shadow-md mb-8">
        <div className="flex items-center gap-2 mb-5">
          <BadgePercent className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white">ساخت کد تخفیف جدید</h2>
        </div>

        {createNotice ? (
          <div
            className={`mb-4 rounded-2xl border px-4 py-3 text-xs font-bold ${
              createNotice.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            {createNotice.message}
          </div>
        ) : null}
        {editNotice ? (
          <div
            className={`mb-4 rounded-2xl border px-4 py-3 text-xs font-bold ${
              editNotice.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            {editNotice.message}
          </div>
        ) : null}
        {actionNotice ? (
          <div
            className={`mb-4 rounded-2xl border px-4 py-3 text-xs font-bold ${
              actionNotice.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            {actionNotice.message}
          </div>
        ) : null}

        <form onSubmit={submitCreate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="عنوان تخفیف">
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="مثلا تخفیف نوروزی" className={inputClass()} />
            </Field>

            <Field label="کد تخفیف" error={errors.code}>
              <div className="flex gap-2">
                <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="مثلا SPOTI20" className={inputClass("flex-1")} />
                <button type="button" onClick={makeAutoCode} className="h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 text-xs font-bold hover:border-primary">
                  تولید خودکار
                </button>
              </div>
            </Field>

            <SelectField
              label="نوع تخفیف"
              value={form.discountType}
              onChange={(value) => setForm((p) => ({ ...p, discountType: value as DiscountType }))}
              options={discountTypeOptions}
              icon={<Percent className="w-4 h-4" />}
            />

            <Field label="مقدار تخفیف" error={errors.discountValue}>
              <input
                value={form.discountValue}
                onChange={(e) => {
                  setForm((p) => ({ ...p, discountValue: sanitizeNumericInput(e.target.value) }));
                  if (errors.discountValue) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.discountValue;
                      return next;
                    });
                  }
                }}
                placeholder={form.discountType === "percentage" ? "عدد درصد مثلا ۲۰" : "مبلغ به تومان"}
                className={inputClass(undefined, Boolean(errors.discountValue))}
              />
            </Field>

            <SelectField
              label="دوره‌های قابل اعمال"
              value={form.scope}
              onChange={(value) => setForm((p) => ({ ...p, scope: value as ScopeType }))}
              options={scopeOptions}
              error={errors.selectedCourseIds}
              icon={<BookOpen className="w-4 h-4" />}
            />

            <SelectField
              label="نوع اعمال تخفیف"
              value={form.applyType}
              onChange={(value) => setForm((p) => ({ ...p, applyType: value as ApplyType }))}
              options={applyTypeOptions}
              icon={<UserCog className="w-4 h-4" />}
            />
          </div>

          {form.scope === "specific" && (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-3">
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} placeholder="جستجوی دوره..." className={inputClass("pr-9")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-auto">
                {filteredCourses.map((course) => (
                  <label key={course.id} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                    <input type="checkbox" checked={form.selectedCourseIds.includes(course.id)} onChange={() => toggleCourse(course.id, "create")} />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{course.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="تاریخ و ساعت شروع">
              <DateTimePicker
                value={form.startAt}
                onChange={(startAt) => setForm((p) => ({ ...p, startAt }))}
              />
            </Field>
            <Field label="تاریخ و ساعت پایان" error={errors.endAt}>
              <DateTimePicker
                value={form.endAt}
                onChange={(endAt) => setForm((p) => ({ ...p, endAt }))}
                hasError={Boolean(errors.endAt)}
              />
            </Field>
            <Field label="محدودیت تعداد استفاده" hint="خالی بماند = نامحدود" error={errors.usageLimit}>
              <input value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: sanitizeNumericInput(e.target.value) }))} placeholder="مثلا ۱۰۰" className={inputClass()} />
            </Field>
            <Field label="محدودیت استفاده برای هر کاربر" error={errors.usagePerUser}>
              <input value={form.usagePerUser} onChange={(e) => setForm((p) => ({ ...p, usagePerUser: sanitizeNumericInput(e.target.value) }))} placeholder="مثلا ۱ بار" className={inputClass()} />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">وضعیت</span>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isEnabled: !p.isEnabled }))}
                className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-bold"
              >
                {form.isEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                {form.isEnabled ? "فعال" : "غیرفعال"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isCreatingDiscount}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-black shadow-lg shadow-primary/20"
            >
              {isCreatingDiscount ? "در حال ثبت..." : "ساخت کد تخفیف"}
            </button>
          </div>
        </form>
      </section>

      <section className="mb-8">
        <div className="mb-5 flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">لیست کدهای تخفیف</h2>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              مدیریت، ویرایش و وضعیت کدهای تخفیف ثبت‌شده
            </p>
          </div>
          {!isLoadingDiscounts && discounts.length > 0 ? (
            <span className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-black text-gray-600 dark:border-white/10 dark:bg-black/20 dark:text-gray-300">
              {discounts.length.toLocaleString("fa-IR")} کد
            </span>
          ) : null}
        </div>

        {isLoadingDiscounts ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#1c1e26]">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-300">در حال دریافت کدهای تخفیف از سرور...</p>
          </div>
        ) : discounts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#1c1e26]">
            <p className="mb-4 text-sm font-bold text-gray-500 dark:text-gray-300">هنوز کد تخفیفی ساخته نشده است</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              ساخت اولین کد تخفیف
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1040px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-black text-gray-400 dark:border-white/5 dark:bg-black/10 dark:text-gray-500">
                    <th className="px-6 py-4">کد</th>
                    <th className="px-4 py-4">عنوان</th>
                    <th className="px-4 py-4">نوع</th>
                    <th className="px-4 py-4">مقدار</th>
                    <th className="px-4 py-4">دوره‌ها</th>
                    <th className="px-4 py-4">نوع اعمال</th>
                    <th className="px-4 py-4 text-center">استفاده</th>
                    <th className="px-4 py-4">انقضا</th>
                    <th className="px-4 py-4">وضعیت</th>
                    <th className="px-6 py-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {paginatedDiscounts.map((item) => (
                    <tr
                      key={item.id}
                      className="group text-xs text-gray-800 transition-colors duration-200 hover:bg-gray-50/40 dark:text-gray-200 dark:hover:bg-black/10"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-xl border border-primary/20 bg-primary/5 px-2.5 py-1.5 font-mono text-[11px] font-black text-primary">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="line-clamp-2 max-w-[160px] font-black text-gray-900 dark:text-white">
                          {item.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">{discountTypeBadge(item.discountType)}</td>
                      <td className="px-4 py-4 font-black text-gray-900 dark:text-white">{formatValue(item)}</td>
                      <td className="px-4 py-4 max-w-[140px]">{renderCourseLabel(item)}</td>
                      <td className="px-4 py-4">{applyTypeBadge(item.applyType)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex min-w-8 items-center justify-center rounded-xl bg-gray-100 px-2.5 py-1 font-black text-gray-800 dark:bg-black/20 dark:text-gray-200">
                          {item.usedCount.toLocaleString("fa-IR")}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-500 dark:text-gray-400">
                        {formatExpiryDate(item.endAt)}
                      </td>
                      <td className="px-4 py-4">{statusBadge(item)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-xl bg-gray-50 p-2 text-gray-600 transition-all hover:scale-105 hover:bg-amber-500/10 hover:text-amber-500 dark:bg-black/20 dark:text-gray-400 dark:hover:text-amber-400"
                            title="ویرایش"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleActive(item)}
                            className="rounded-xl bg-gray-50 p-2 text-gray-600 transition-all hover:scale-105 hover:bg-indigo-500/10 hover:text-indigo-500 dark:bg-black/20 dark:text-gray-400 dark:hover:text-indigo-400"
                            title={item.isEnabled ? "غیرفعال کردن" : "فعال کردن"}
                          >
                            {item.isEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeCode(item)}
                            className="rounded-xl bg-gray-50 p-2 text-gray-600 transition-all hover:scale-105 hover:bg-rose-500/10 hover:text-rose-500 dark:bg-black/20 dark:text-gray-400 dark:hover:text-rose-400"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminTablePagination
              totalItems={discounts.length}
              currentPage={safeDiscountPage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
              itemLabel="کد"
            />
          </div>
        )}
      </section>

      {editItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
          <button onClick={() => setEditItem(null)} className="absolute inset-0 bg-black/70" aria-label="close" />
          <div className="relative w-full max-w-3xl rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1c1e26] p-5 md:p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white">ویرایش کد تخفیف</h3>
              <button onClick={() => setEditItem(null)} className="rounded-xl p-2 bg-gray-100 dark:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="عنوان تخفیف">
                  <input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className={inputClass()} />
                </Field>
                <Field label="کد تخفیف" error={editErrors.code}>
                  <div className="flex gap-2">
                    <input value={editForm.code} onChange={(e) => setEditForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className={inputClass("flex-1")} />
                    <button type="button" onClick={makeAutoCodeForEdit} className="h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white/5 text-xs font-bold">
                      تولید خودکار
                    </button>
                  </div>
                </Field>
                <SelectField
                  label="نوع تخفیف"
                  value={editForm.discountType}
                  onChange={(value) => setEditForm((p) => ({ ...p, discountType: value as DiscountType }))}
                  options={discountTypeOptions}
                  icon={<Percent className="w-4 h-4" />}
                />
                <Field label="مقدار تخفیف" error={editErrors.discountValue}>
                  <input
                    value={editForm.discountValue}
                    onChange={(e) => {
                      setEditForm((p) => ({ ...p, discountValue: sanitizeNumericInput(e.target.value) }));
                      if (editErrors.discountValue) {
                        setEditErrors((prev) => {
                          const next = { ...prev };
                          delete next.discountValue;
                          return next;
                        });
                      }
                    }}
                    placeholder={editForm.discountType === "percentage" ? "عدد درصد مثلا ۲۰" : "مبلغ به تومان"}
                    className={inputClass(undefined, Boolean(editErrors.discountValue))}
                  />
                </Field>
                <SelectField
                  label="دوره‌های قابل اعمال"
                  value={editForm.scope}
                  onChange={(value) => setEditForm((p) => ({ ...p, scope: value as ScopeType }))}
                  options={scopeOptions}
                  error={editErrors.selectedCourseIds}
                  icon={<BookOpen className="w-4 h-4" />}
                />

                <SelectField
                  label="نوع اعمال تخفیف"
                  value={editForm.applyType}
                  onChange={(value) => setEditForm((p) => ({ ...p, applyType: value as ApplyType }))}
                  options={applyTypeOptions}
                  icon={<UserCog className="w-4 h-4" />}
                />
              </div>

              {editForm.scope === "specific" && (
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-3">
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input value={editCourseQuery} onChange={(e) => setEditCourseQuery(e.target.value)} placeholder="جستجوی دوره..." className={inputClass("pr-9")} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-auto">
                    {filteredEditCourses.map((course) => (
                      <label key={course.id} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                        <input type="checkbox" checked={editForm.selectedCourseIds.includes(course.id)} onChange={() => toggleCourse(course.id, "edit")} />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="تاریخ و ساعت شروع">
                  <DateTimePicker
                    value={editForm.startAt}
                    onChange={(startAt) => setEditForm((p) => ({ ...p, startAt }))}
                  />
                </Field>
                <Field label="تاریخ و ساعت پایان" error={editErrors.endAt}>
                  <DateTimePicker
                    value={editForm.endAt}
                    onChange={(endAt) => setEditForm((p) => ({ ...p, endAt }))}
                    hasError={Boolean(editErrors.endAt)}
                  />
                </Field>
                <Field label="محدودیت تعداد استفاده" error={editErrors.usageLimit}>
                  <input value={editForm.usageLimit} onChange={(e) => setEditForm((p) => ({ ...p, usageLimit: sanitizeNumericInput(e.target.value) }))} className={inputClass()} />
                </Field>
                <Field label="محدودیت استفاده برای هر کاربر" error={editErrors.usagePerUser}>
                  <input value={editForm.usagePerUser} onChange={(e) => setEditForm((p) => ({ ...p, usagePerUser: sanitizeNumericInput(e.target.value) }))} className={inputClass()} />
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">وضعیت</span>
                  <button
                    type="button"
                    onClick={() => setEditForm((p) => ({ ...p, isEnabled: !p.isEnabled }))}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-bold"
                  >
                    {editForm.isEnabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                    {editForm.isEnabled ? "فعال" : "غیرفعال"}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingDiscount}
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-black"
                >
                  {isUpdatingDiscount ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({
  title,
  value,
  desc,
  icon,
  color,
  bgGlow,
}: {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1c1e26] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between min-h-[124px]">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgGlow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">{title}</span>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} transition-transform group-hover:scale-110 duration-300`}>
            {icon}
          </div>
        </div>

        <div>
          <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Field label={label} error={error} hint={hint}>
      <CustomSelect
        options={options}
        value={value}
        onChange={onChange}
        size="md"
        icon={icon}
        className={formSelectClassName}
      />
    </Field>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</label>
      {children}
      {hint ? <p className="text-[10px] text-gray-500">{hint}</p> : null}
      {error ? <p className="text-[10px] text-rose-400 font-bold">{error}</p> : null}
    </div>
  );
}

function inputClass(extra?: string, hasError?: boolean) {
  return `w-full h-11 rounded-xl border ${
    hasError
      ? "border-rose-500 focus:border-rose-500"
      : "border-gray-200/80 dark:border-white/10 focus:border-primary"
  } bg-gray-50 dark:bg-white/5 px-3 text-xs font-bold outline-none ${extra || ""}`;
}
