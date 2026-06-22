"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BadgePercent, CheckCircle2, Clock3, Pencil, Plus, Search, TicketPercent, ToggleLeft, ToggleRight, Trash2, X, Percent, BookOpen, UserCog } from "lucide-react";
import { apiDeleteNoMock, apiGetNoMock, apiPostNoMock, apiPutNoMock } from "@/lib/api";
import { normalizeAdminDiscountsResponse } from "@/lib/admin-discounts";
import { sanitizeNumericInput } from "@/lib/digits";
import CustomSelect from "@/components/ui/CustomSelect";

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

const mockCourses = [
  { id: "c1", title: "آموزش React" },
  { id: "c2", title: "آموزش Next.js" },
  { id: "c3", title: "آموزش JavaScript" },
  { id: "c4", title: "آموزش Frontend" },
  { id: "c5", title: "آموزش Backend" },
];

const initialDiscounts: DiscountCodeItem[] = [
  {
    id: "d1",
    title: "تخفیف نوروزی",
    code: "NOWRUZ30",
    discountType: "percentage",
    discountValue: 30,
    scope: "all",
    selectedCourseIds: [],
    startAt: "2026-03-01T09:00",
    endAt: "2026-12-30T23:59",
    usageLimit: "1000",
    usagePerUser: "1",
    applyType: "user",
    isEnabled: true,
    usedCount: 210,
  },
  {
    id: "d2",
    title: "تخفیف ویژه React",
    code: "REACT20",
    discountType: "percentage",
    discountValue: 20,
    scope: "specific",
    selectedCourseIds: ["c1"],
    startAt: "2026-05-01T08:00",
    endAt: "2026-11-30T23:59",
    usageLimit: "300",
    usagePerUser: "2",
    applyType: "admin",
    isEnabled: true,
    usedCount: 88,
  },
  {
    id: "d3",
    title: "تخفیف منقضی شده",
    code: "OLD50",
    discountType: "fixed",
    discountValue: 50000,
    scope: "specific",
    selectedCourseIds: ["c3"],
    startAt: "2025-01-01T09:00",
    endAt: "2025-01-30T23:59",
    usageLimit: "120",
    usagePerUser: "1",
    applyType: "user",
    isEnabled: false,
    usedCount: 64,
  },
];

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

const applyTypeLabel: Record<ApplyType, string> = {
  user: "توسط کاربر",
  admin: "اعمال خودکار توسط ادمین",
  both: "هر دو",
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
  const [discounts, setDiscounts] = useState<DiscountCodeItem[]>(initialDiscounts);
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

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await apiGetNoMock<unknown>("/api/admin-dashboard/discounts");
        const mapped = normalizeAdminDiscountsResponse(response).map((item) => ({
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
        }));

        setDiscounts(mapped.length > 0 ? mapped : initialDiscounts);
      } catch {
        setDiscounts(initialDiscounts);
      } finally {
        setIsLoadingDiscounts(false);
      }
    };

    fetchDiscounts();
  }, []);

  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim();
    if (!q) return mockCourses;
    return mockCourses.filter((c) => c.title.includes(q));
  }, [courseQuery]);

  const filteredEditCourses = useMemo(() => {
    const q = editCourseQuery.trim();
    if (!q) return mockCourses;
    return mockCourses.filter((c) => c.title.includes(q));
  }, [editCourseQuery]);

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
    code: state.code.trim().toUpperCase() || undefined,
    type: state.discountType === "percentage" ? "percent" : "fixed",
    value: Number(state.discountValue),
    startsAt: state.startAt || undefined,
    expiresAt: state.endAt || undefined,
    isActive: state.isEnabled,
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
      await apiPostNoMock("/api/discounts/admin", buildDiscountPayload(form));

      const created: DiscountCodeItem = {
        id: `d-${Date.now()}`,
        title: form.title.trim() || form.code.trim().toUpperCase() || "بدون عنوان",
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        scope: form.scope,
        selectedCourseIds: form.scope === "all" ? [] : form.selectedCourseIds,
        startAt: form.startAt,
        endAt: form.endAt,
        usageLimit: form.usageLimit.trim(),
        usagePerUser: form.usagePerUser.trim(),
        applyType: form.applyType,
        isEnabled: form.isEnabled,
        usedCount: 0,
      };

      setDiscounts((p) => [created, ...p]);
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
      await apiPutNoMock(`/api/discounts/${encodeURIComponent(editItem.id)}/admin`, buildDiscountPayload(editForm));

      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editItem.id
            ? {
                ...d,
                title: editForm.title.trim() || "بدون عنوان",
                code: editForm.code.trim().toUpperCase(),
                discountType: editForm.discountType,
                discountValue: Number(editForm.discountValue),
                scope: editForm.scope,
                selectedCourseIds: editForm.scope === "all" ? [] : editForm.selectedCourseIds,
                startAt: editForm.startAt,
                endAt: editForm.endAt,
                usageLimit: editForm.usageLimit.trim(),
                usagePerUser: editForm.usagePerUser.trim(),
                applyType: editForm.applyType,
                isEnabled: editForm.isEnabled,
              }
            : d
        )
      );
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
      await apiPutNoMock(`/api/discounts/${encodeURIComponent(item.id)}/admin`, {
        code: item.code,
        type: item.discountType === "percentage" ? "percent" : "fixed",
        value: item.discountValue,
        startsAt: item.startAt || undefined,
        expiresAt: item.endAt || undefined,
        isActive: nextEnabled,
        globalUsageLimit: item.usageLimit.trim() ? Number(item.usageLimit) : undefined,
        perUserUsageLimit: item.usagePerUser.trim() ? Number(item.usagePerUser) : undefined,
      });

      setDiscounts((prev) => prev.map((d) => (d.id === item.id ? { ...d, isEnabled: nextEnabled } : d)));
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
      await apiDeleteNoMock(`/api/discounts/${encodeURIComponent(item.id)}/admin`);
      setDiscounts((prev) => prev.filter((d) => d.id !== item.id));
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
    if (status === "active") return <span className="rounded-full px-2 py-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-300">فعال</span>;
    if (status === "disabled") return <span className="rounded-full px-2 py-1 text-[10px] font-bold bg-gray-500/20 text-gray-300">غیرفعال</span>;
    return <span className="rounded-full px-2 py-1 text-[10px] font-bold bg-rose-500/20 text-rose-300">منقضی‌شده</span>;
  };

  const formatValue = (item: DiscountCodeItem) =>
    item.discountType === "percentage"
      ? `${item.discountValue.toLocaleString("fa-IR")}٪`
      : `${item.discountValue.toLocaleString("fa-IR")} تومان`;

  const renderCourseLabel = (item: DiscountCodeItem) => {
    if (item.scope === "all") {
      return <span className="rounded-full px-2 py-1 text-[10px] font-bold bg-blue-500/20 text-blue-300">همه دوره‌ها</span>;
    }
    if (item.selectedCourseIds.length <= 2) {
      const names = item.selectedCourseIds
        .map((id) => mockCourses.find((c) => c.id === id)?.title)
        .filter(Boolean)
        .join("، ");
      return <span className="text-xs text-gray-200">{names}</span>;
    }
    return <span className="text-xs text-gray-200">{item.selectedCourseIds.length.toLocaleString("fa-IR")} دوره</span>;
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
              <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((p) => ({ ...p, startAt: e.target.value }))} className={inputClass()} />
            </Field>
            <Field label="تاریخ و ساعت پایان" error={errors.endAt}>
              <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((p) => ({ ...p, endAt: e.target.value }))} className={inputClass()} />
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

      <section className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-5 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">لیست کدهای تخفیف</h2>
        </div>

        {isLoadingDiscounts ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 p-10 text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-300">در حال دریافت کدهای تخفیف از سرور...</p>
          </div>
        ) : discounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/15 p-10 text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-300 mb-4">هنوز کد تخفیفی ساخته نشده است</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              ساخت اولین کد تخفیف
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-right text-xs font-bold">
              <thead className="text-gray-500 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-white/10">
                  <th className="py-3 px-2">کد</th>
                  <th className="py-3 px-2">عنوان</th>
                  <th className="py-3 px-2">نوع تخفیف</th>
                  <th className="py-3 px-2">مقدار</th>
                  <th className="py-3 px-2">دوره‌ها</th>
                  <th className="py-3 px-2">نوع اعمال</th>
                  <th className="py-3 px-2">استفاده شده</th>
                  <th className="py-3 px-2">تاریخ انقضا</th>
                  <th className="py-3 px-2">وضعیت</th>
                  <th className="py-3 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {discounts.map((item) => (
                  <tr key={item.id} className="text-gray-700 dark:text-gray-200">
                    <td className="py-3 px-2 font-black">{item.code}</td>
                    <td className="py-3 px-2">{item.title}</td>
                    <td className="py-3 px-2">{item.discountType === "percentage" ? "درصدی" : "مبلغ ثابت"}</td>
                    <td className="py-3 px-2">{formatValue(item)}</td>
                    <td className="py-3 px-2">{renderCourseLabel(item)}</td>
                    <td className="py-3 px-2">{applyTypeLabel[item.applyType]}</td>
                    <td className="py-3 px-2">{item.usedCount.toLocaleString("fa-IR")}</td>
                    <td className="py-3 px-2">{item.endAt ? new Date(item.endAt).toLocaleString("fa-IR") : "-"}</td>
                    <td className="py-3 px-2">{statusBadge(item)}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="h-8 px-2 rounded-lg border border-gray-200 dark:border-white/10 text-[11px] inline-flex items-center gap-1">
                          <Pencil className="w-3.5 h-3.5" />
                          ویرایش
                        </button>
                        <button onClick={() => void toggleActive(item)} className="h-8 px-2 rounded-lg border border-gray-200 dark:border-white/10 text-[11px]">
                          {item.isEnabled ? "غیرفعال کردن" : "فعال کردن"}
                        </button>
                        <button onClick={() => void removeCode(item)} className="h-8 px-2 rounded-lg border border-rose-500/30 text-rose-300 text-[11px] inline-flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <input type="datetime-local" value={editForm.startAt} onChange={(e) => setEditForm((p) => ({ ...p, startAt: e.target.value }))} className={inputClass()} />
                </Field>
                <Field label="تاریخ و ساعت پایان" error={editErrors.endAt}>
                  <input type="datetime-local" value={editForm.endAt} onChange={(e) => setEditForm((p) => ({ ...p, endAt: e.target.value }))} className={inputClass()} />
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
