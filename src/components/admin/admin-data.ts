export const adminKpis = [
  { title: "کل کاربران", value: "12,480", delta: "+12.4%", positive: true },
  { title: "کاربران فعال روزانه", value: "2,194", delta: "+6.1%", positive: true },
  { title: "درآمد این ماه", value: "784M", delta: "+18.3%", positive: true, unit: "تومان" },
  { title: "نرخ ریزش", value: "3.8%", delta: "-0.6%", positive: true },
];

export const monthlyRevenue = [
  { month: "فروردین", revenue: 120, users: 410 },
  { month: "اردیبهشت", revenue: 140, users: 460 },
  { month: "خرداد", revenue: 165, users: 510 },
  { month: "تیر", revenue: 210, users: 640 },
  { month: "مرداد", revenue: 250, users: 720 },
  { month: "شهریور", revenue: 278, users: 810 },
  { month: "مهر", revenue: 320, users: 900 },
  { month: "آبان", revenue: 360, users: 1010 },
  { month: "آذر", revenue: 398, users: 1112 },
  { month: "دی", revenue: 440, users: 1230 },
  { month: "بهمن", revenue: 520, users: 1350 },
  { month: "اسفند", revenue: 610, users: 1480 },
];

export const channelData = [
  { label: "اینستاگرام", value: 38, color: "#22c55e" },
  { label: "گوگل ارگانیک", value: 27, color: "#06b6d4" },
  { label: "معرفی دوستان", value: 20, color: "#f59e0b" },
  { label: "تبلیغات", value: 15, color: "#ef4444" },
];

export const salesByCategory = [
  { label: "Frontend", value: 268 },
  { label: "Backend", value: 224 },
  { label: "DevOps", value: 148 },
  { label: "Mobile", value: 112 },
  { label: "UI/UX", value: 97 },
];

export const recentOrders = [
  { id: "ORD-10482", user: "نیما احمدی", course: "مسترکلاس Next.js", amount: "2,900,000", status: "پرداخت شده", date: "1404/12/18" },
  { id: "ORD-10481", user: "زهرا کیانی", course: "دوره TypeScript پیشرفته", amount: "1,980,000", status: "در انتظار", date: "1404/12/18" },
  { id: "ORD-10480", user: "علی نعمتی", course: "React Performance", amount: "1,640,000", status: "پرداخت شده", date: "1404/12/17" },
  { id: "ORD-10479", user: "هانیه عابدی", course: "Node.js از صفر", amount: "2,120,000", status: "لغو شده", date: "1404/12/17" },
  { id: "ORD-10478", user: "محمد یوسفی", course: "Tailwind حرفه‌ای", amount: "1,320,000", status: "پرداخت شده", date: "1404/12/16" },
  { id: "ORD-10477", user: "سمانه آذری", course: "Clean Architecture", amount: "2,460,000", status: "پرداخت شده", date: "1404/12/16" },
];

export const usersData = [
  { id: "USR-992", name: "نیما احمدی", phone: "09121111111", plan: "Pro", status: "فعال", joinedAt: "1404/08/12", courses: 8, ltv: "11,400,000" },
  { id: "USR-991", name: "هانیه عابدی", phone: "09122222222", plan: "Starter", status: "غیرفعال", joinedAt: "1404/09/02", courses: 2, ltv: "2,120,000" },
  { id: "USR-990", name: "رضا ملکی", phone: "09123333333", plan: "Pro", status: "فعال", joinedAt: "1404/07/20", courses: 6, ltv: "8,900,000" },
  { id: "USR-989", name: "زهرا کیانی", phone: "09124444444", plan: "Enterprise", status: "فعال", joinedAt: "1404/06/15", courses: 13, ltv: "21,700,000" },
  { id: "USR-988", name: "مهسا زمانی", phone: "09125555555", plan: "Starter", status: "معلق", joinedAt: "1404/10/01", courses: 3, ltv: "3,240,000" },
  { id: "USR-987", name: "آرمان ابراهیمی", phone: "09126666666", plan: "Pro", status: "فعال", joinedAt: "1404/11/11", courses: 5, ltv: "7,060,000" },
  { id: "USR-986", name: "سمیه فراهانی", phone: "09127777777", plan: "Pro", status: "فعال", joinedAt: "1404/05/09", courses: 9, ltv: "13,850,000" },
];

export const coursesData = [
  { id: "CRS-410", title: "مسترکلاس Next.js", instructor: "سروش مشایخی", students: 1840, completion: 68, revenue: "248,000,000", status: "منتشر شده" },
  { id: "CRS-407", title: "TypeScript پیشرفته", instructor: "الهام بهشتی", students: 1320, completion: 59, revenue: "187,500,000", status: "منتشر شده" },
  { id: "CRS-402", title: "Node.js از صفر", instructor: "امیر محمدی", students: 980, completion: 54, revenue: "131,000,000", status: "منتشر شده" },
  { id: "CRS-398", title: "Docker & CI/CD", instructor: "آیدا رضایی", students: 744, completion: 47, revenue: "102,300,000", status: "پیش‌نویس" },
  { id: "CRS-390", title: "UI Design Systems", instructor: "ناهید کشاورز", students: 520, completion: 73, revenue: "88,000,000", status: "منتشر شده" },
];

export const ticketsData = [
  { id: "T-1810", title: "خطا در پرداخت با درگاه", priority: "بحرانی", owner: "تیم مالی", updatedAt: "۵ دقیقه پیش", status: "باز" },
  { id: "T-1809", title: "عدم نمایش ویدیو در موبایل", priority: "بالا", owner: "تیم فنی", updatedAt: "۱۲ دقیقه پیش", status: "در حال بررسی" },
  { id: "T-1808", title: "درخواست فاکتور رسمی", priority: "متوسط", owner: "پشتیبانی", updatedAt: "۲۶ دقیقه پیش", status: "باز" },
  { id: "T-1807", title: "مشکل در ریست رمز", priority: "متوسط", owner: "تیم فنی", updatedAt: "۴۰ دقیقه پیش", status: "حل شده" },
  { id: "T-1806", title: "ویرایش اشتباه نام کاربری", priority: "پایین", owner: "پشتیبانی", updatedAt: "۵۵ دقیقه پیش", status: "حل شده" },
];
