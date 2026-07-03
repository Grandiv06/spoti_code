export type PanelDashboardViewModel = {
  user: {
    id: string;
    fullName: string;
    phone: string;
  };
  enrolledCoursesCount: number;
  myCommentsCount: number;
  acceptedCommentsCount: number;
  waitingCommentsCount: number;
  hasActiveOrder: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    enrolledCourses: string;
    myComments: string;
    acceptedComments: string;
    waitingComments: string;
    activeOrder: string;
    activeOrderYes: string;
    activeOrderNo: string;
  };
};

const DEFAULT_LABELS: PanelDashboardViewModel["labels"] = {
  welcomeTitle: "خوش اومدی، کاربر عزیز! 👋",
  welcomeSubtitle: "از داشبورد خودت می‌تونی به دوره‌ها و وضعیت یادگیریت دسترسی داشته باشی.",
  enrolledCourses: "دوره‌های ثبت‌نامی",
  myComments: "کامنت‌های من",
  acceptedComments: "کامنت‌های تاییدشده",
  waitingComments: "در انتظار بررسی",
  activeOrder: "سفارش فعال",
  activeOrderYes: "دارد",
  activeOrderNo: "ندارد",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  if (isRecord(value) && "data" in value && value.data != null) {
    return value.data;
  }
  return value;
}

function pickNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizePanelDashboardOverview(response: unknown): PanelDashboardViewModel {
  const payload = unwrapResponse(response);
  const row = isRecord(payload) ? payload : {};
  const userRow = isRecord(row.user) ? row.user : {};
  const labelsRow = isRecord(row.labels) ? row.labels : {};

  return {
    user: {
      id: pickString(userRow.id),
      fullName: pickString(userRow.fullName, "کاربر عزیز"),
      phone: pickString(userRow.phone),
    },
    enrolledCoursesCount: pickNumber(row.enrolledCoursesCount),
    myCommentsCount: pickNumber(row.myCommentsCount),
    acceptedCommentsCount: pickNumber(row.acceptedCommentsCount),
    waitingCommentsCount: pickNumber(row.waitingCommentsCount),
    hasActiveOrder: Boolean(row.hasActiveOrder),
    labels: {
      welcomeTitle: pickString(labelsRow.welcomeTitle, DEFAULT_LABELS.welcomeTitle),
      welcomeSubtitle: pickString(labelsRow.welcomeSubtitle, DEFAULT_LABELS.welcomeSubtitle),
      enrolledCourses: pickString(labelsRow.enrolledCourses, DEFAULT_LABELS.enrolledCourses),
      myComments: pickString(labelsRow.myComments, DEFAULT_LABELS.myComments),
      acceptedComments: pickString(labelsRow.acceptedComments, DEFAULT_LABELS.acceptedComments),
      waitingComments: pickString(labelsRow.waitingComments, DEFAULT_LABELS.waitingComments),
      activeOrder: pickString(labelsRow.activeOrder, DEFAULT_LABELS.activeOrder),
      activeOrderYes: pickString(labelsRow.activeOrderYes, DEFAULT_LABELS.activeOrderYes),
      activeOrderNo: pickString(labelsRow.activeOrderNo, DEFAULT_LABELS.activeOrderNo),
    },
  };
}
