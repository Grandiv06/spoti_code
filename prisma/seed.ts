import { PrismaClient, CourseCategory, CourseLevel, CourseStatus } from "@prisma/client";
import { COURSE_CONTENT_BY_ID } from "./course-content";
import { COMMENT_SEED, INSTRUCTOR_PROFILE_SEED } from "./instructor-profiles";

const prisma = new PrismaClient();

const instructors = [
  { id: "INS-101", slug: "amirreza-rezaei", name: "امیررضا رضایی", avatar: "/images/inst1.jpg" },
  { id: "INS-102", slug: "mehrdad-heidari", name: "مهرداد حیدری", avatar: "/images/inst4.jpg" },
  { id: "INS-103", slug: "sara-mohammadi", name: "سارا محمدی", avatar: "/images/inst2.jpg" },
  { id: "INS-104", slug: "nima-alavi", name: "نیما علوی", avatar: "/images/inst3.jpg" },
] as const;

const users = [
  {
    id: "USR-ADMIN-001",
    phone: "+989104138412",
    fullName: "ادمین اسپاتی‌کد",
    role: "ADMIN" as const,
  },
  {
    id: "USR-INST-001",
    phone: "+989395063084",
    fullName: "مدرس اسپاتی‌کد",
    role: "INSTRUCTOR" as const,
  },
  {
    id: "USR-INST-002",
    phone: "+989196979921",
    fullName: "ایلیا مرادی",
    role: "INSTRUCTOR" as const,
  },
];

const courses = [
  {
    id: "html",
    slug: "html",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-104",
    title: "آشنایی با HTML",
    shortDescription: "آشنایی با پایه و اساس وب و ساختار صفحات",
    description:
      "در این دوره از صفر با ساختار صفحات وب، تگ‌های معنایی و استانداردهای HTML آشنا می‌شوید.",
    cover: "/images/html-green.png",
    thumbnail: "/images/html-green.png",
    difficulty: "مقدماتی",
    level: CourseLevel.elementary,
    durationHours: 12,
    studentsCount: 1850,
    price: 980_000,
    rating: 4.7,
    status: CourseStatus.published,
    revenue: BigInt(1_813_000_000),
    createdAt: new Date("2026-01-12T08:30:00.000Z"),
  },
  {
    id: "css",
    slug: "css",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-103",
    title: "استایل‌دهی با CSS",
    shortDescription: "جادوی بصری وب، Flexbox، Grid و طراحی واکنش‌گرا",
    description: "از مبانی CSS تا ساخت چیدمان‌های مدرن و responsive را با پروژه‌های واقعی تمرین می‌کنید.",
    cover: "/images/css-green.png",
    thumbnail: "/images/css-green.png",
    difficulty: "مقدماتی",
    level: CourseLevel.elementary,
    durationHours: 18,
    studentsCount: 2120,
    price: 1_450_000,
    rating: 4.8,
    status: CourseStatus.published,
    revenue: BigInt(3_074_000_000),
    createdAt: new Date("2026-01-24T08:30:00.000Z"),
  },
  {
    id: "javascript",
    slug: "javascript",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    title: "جادوی جاوااسکریپت",
    shortDescription: "ES6، DOM، Fetch API و مدیریت داده",
    description:
      "در این مسیر منطق برنامه‌نویسی، تعامل با صفحه و ارتباط با API را به شکل عملی یاد می‌گیرید.",
    cover: "/images/js-green.png",
    thumbnail: "/images/js-green.png",
    difficulty: "متوسط",
    level: CourseLevel.intermediate,
    durationHours: 32,
    studentsCount: 1650,
    price: 2_200_000,
    rating: 4.9,
    status: CourseStatus.published,
    revenue: BigInt(3_630_000_000),
    createdAt: new Date("2026-02-08T08:30:00.000Z"),
  },
  {
    id: "react",
    slug: "react",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-102",
    title: "فریمورک React",
    shortDescription: "تفکر کامپوننتی، هوک‌ها و مدیریت وضعیت",
    description:
      "React را با تمرکز روی معماری کامپوننتی، state management و ساخت اپلیکیشن‌های واقعی یاد می‌گیرید.",
    cover: "/images/react-green.png",
    thumbnail: "/images/react-green.png",
    difficulty: "متوسط",
    level: CourseLevel.intermediate,
    durationHours: 40,
    studentsCount: 1240,
    price: 3_500_000,
    rating: 4.9,
    status: CourseStatus.published,
    revenue: BigInt(4_340_000_000),
    createdAt: new Date("2026-03-02T08:30:00.000Z"),
  },
  {
    id: "nextjs",
    slug: "nextjs",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    title: "متخصص React و Next.js",
    shortDescription: "مسیر صفر تا صد ورود به بازار کار جهانی با Next.js",
    description: "در این دوره با SSR، App Router، معماری مدرن وب و ساخت محصول واقعی آشنا می‌شوید.",
    cover: "/images/course3.jpg",
    thumbnail: "/images/course3.jpg",
    difficulty: "پیشرفته",
    level: CourseLevel.advanced,
    durationHours: 65,
    studentsCount: 1340,
    price: 4_500_000,
    rating: 4.9,
    status: CourseStatus.published,
    revenue: BigInt(6_030_000_000),
    createdAt: new Date("2026-03-20T08:30:00.000Z"),
  },
  {
    id: "typescript",
    slug: "typescript",
    category: CourseCategory.frontend,
    categoryTitle: "فرانت‌اند",
    instructorId: "INS-101",
    title: "تایپ‌اسکریپت پیشرفته",
    shortDescription: "کدنویسی امن و مقیاس‌پذیر با Typeها، Interfaceها و Generics",
    description: "TypeScript را برای پروژه‌های بزرگ و تیمی به شکل عمیق و کاربردی یاد می‌گیرید.",
    cover: "/images/course2.jpg",
    thumbnail: "/images/course2.jpg",
    difficulty: "پیشرفته",
    level: CourseLevel.advanced,
    durationHours: 25,
    studentsCount: 980,
    price: 1_900_000,
    rating: 4.6,
    status: CourseStatus.draft,
    revenue: BigInt(0),
    createdAt: new Date("2026-04-10T08:30:00.000Z"),
  },
] as const;

function withCourseContent(course: (typeof courses)[number]) {
  const content = COURSE_CONTENT_BY_ID[course.id];
  if (!content) return course;

  return {
    ...course,
    aboutDescription: content.aboutDescription ?? course.description,
    specialWord: content.specialWord,
    introVideo: content.introVideo,
    introVideoDuration: content.introVideoDuration,
    chapters: content.chapters ?? [],
    faqs: content.faqs ?? [],
  };
}

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { phone: user.phone },
      update: user,
      create: user,
    });
  }

  for (const instructor of instructors) {
    const profile = INSTRUCTOR_PROFILE_SEED[instructor.id as keyof typeof INSTRUCTOR_PROFILE_SEED];
    await prisma.instructor.upsert({
      where: { id: instructor.id },
      update: { ...instructor, ...profile },
      create: { ...instructor, ...profile },
    });
  }

  for (const course of courses) {
    const payload = withCourseContent(course);
    await prisma.course.upsert({
      where: { id: course.id },
      update: payload,
      create: payload,
    });
  }

  for (const comment of COMMENT_SEED) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }

  const discountCodes = [
    {
      id: "DSC-TEST-USER-20",
      title: "کد تست کاربر — ۲۰٪ همه دوره‌ها",
      code: "TESTUSER20",
      discountType: "percentage" as const,
      discountValue: 20,
      scope: "all" as const,
      applyType: "user" as const,
      isEnabled: true,
      startsAt: new Date("2026-01-01T00:00:00.000Z"),
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      globalUsageLimit: 1000,
      perUserUsageLimit: 3,
      usedCount: 0,
    },
    {
      id: "DSC-TEST-AUTO-15",
      title: "تخفیف خودکار ادمین — ۱۵٪ همه دوره‌ها",
      code: "AUTOALL15",
      discountType: "percentage" as const,
      discountValue: 15,
      scope: "all" as const,
      applyType: "admin" as const,
      isEnabled: true,
      startsAt: new Date("2026-01-01T00:00:00.000Z"),
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      globalUsageLimit: null,
      perUserUsageLimit: null,
      usedCount: 0,
    },
    {
      id: "DSC-TEST-REACT-10",
      title: "کد تست دوره React",
      code: "REACTONLY10",
      discountType: "percentage" as const,
      discountValue: 10,
      scope: "specific" as const,
      applyType: "user" as const,
      isEnabled: true,
      startsAt: new Date("2026-01-01T00:00:00.000Z"),
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      globalUsageLimit: 500,
      perUserUsageLimit: 1,
      usedCount: 0,
      courseIds: ["react"],
    },
  ] as const;

  for (const discount of discountCodes) {
    const { courseIds = [], ...discountData } = discount as typeof discount & { courseIds?: string[] };
    await prisma.discountCode.upsert({
      where: { id: discount.id },
      update: {
        ...discountData,
        courses: {
          deleteMany: {},
          create: courseIds.map((courseId) => ({ courseId })),
        },
      },
      create: {
        ...discountData,
        courses: {
          create: courseIds.map((courseId) => ({ courseId })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
