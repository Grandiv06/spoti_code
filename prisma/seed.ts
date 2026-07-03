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
  { id: "USR-ADMIN-001", phone: "+989000000001", fullName: "ادمین تست", role: "ADMIN" as const },
  { id: "USR-INST-001", phone: "+989000000002", fullName: "مدرس تست", role: "INSTRUCTOR" as const },
  { id: "USR-USER-001", phone: "+989000000003", fullName: "کاربر تست", role: "USER" as const },
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

  const testUserId = "USR-USER-001";
  const testEnrollments = [
    { id: "ENR-USER-001-HTML", courseId: "html", progress: 72 },
    { id: "ENR-USER-001-CSS", courseId: "css", progress: 48 },
    { id: "ENR-USER-001-JS", courseId: "javascript", progress: 23 },
  ];

  for (const enrollment of testEnrollments) {
    await prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId: testUserId, courseId: enrollment.courseId } },
      update: { progress: enrollment.progress },
      create: {
        id: enrollment.id,
        userId: testUserId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
      },
    });
  }

  await prisma.userOrder.upsert({
    where: { id: "ORD-USER-001-PENDING" },
    update: {
      type: "payment",
      status: "pending",
      amount: 2_200_000,
      description: "خرید دوره جاوااسکریپت",
      paymentMethod: "درگاه بانکی",
      trackingCode: "BNK-922104",
      productTitle: "جادوی جاوااسکریپت",
      courseId: "javascript",
    },
    create: {
      id: "ORD-USER-001-PENDING",
      userId: testUserId,
      type: "payment",
      status: "pending",
      amount: 2_200_000,
      description: "خرید دوره جاوااسکریپت",
      paymentMethod: "درگاه بانکی",
      trackingCode: "BNK-922104",
      productTitle: "جادوی جاوااسکریپت",
      courseId: "javascript",
      createdAt: new Date("2026-05-18T11:10:00.000Z"),
    },
  });

  const testUserTransactions = [
    {
      id: "TRX-1001",
      userId: testUserId,
      type: "payment",
      status: "success",
      amount: 4_500_000,
      description: "خرید دوره متخصص React و Next.js",
      paymentMethod: "درگاه زرین‌پال",
      trackingCode: "ZP-835201",
      productTitle: "متخصص React و Next.js",
      courseId: "nextjs",
      createdAt: new Date("2026-05-20T14:25:00.000Z"),
    },
    {
      id: "TRX-1003",
      userId: testUserId,
      type: "refund",
      status: "refunded",
      amount: 980_000,
      description: "بازگشت وجه سفارش آزمایشی",
      paymentMethod: "کیف پول",
      trackingCode: "RF-113204",
      productTitle: "آشنایی با HTML",
      courseId: "html",
      createdAt: new Date("2026-05-11T09:45:00.000Z"),
    },
  ] as const;

  for (const transaction of testUserTransactions) {
    await prisma.userOrder.upsert({
      where: { id: transaction.id },
      update: transaction,
      create: transaction,
    });
  }

  const testUserComments = [
    {
      id: "comment-user-test-1",
      courseId: "html",
      content: "دوره HTML برای شروع عالی بود.",
      rating: 5,
      authorId: testUserId,
      authorName: "کاربر تست",
      authorRole: "دانشجو",
      authorAvatar: "/images/student1.jpg",
      createdAt: new Date("2026-05-10T10:00:00.000Z"),
    },
    {
      id: "comment-user-test-1-reply",
      courseId: "html",
      parentId: "comment-user-test-1",
      content: "خوشحالیم که مفید بوده.",
      authorName: "نیما علوی",
      authorRole: "مدرس",
      authorAvatar: "/images/inst3.jpg",
      isInstructorReply: true,
      createdAt: new Date("2026-05-10T12:00:00.000Z"),
    },
    {
      id: "comment-user-test-2",
      courseId: "css",
      content: "بخش Flexbox خیلی کاربردی توضیح داده شد.",
      rating: 4,
      authorId: testUserId,
      authorName: "کاربر تست",
      authorRole: "دانشجو",
      authorAvatar: "/images/student1.jpg",
      createdAt: new Date("2026-05-12T10:00:00.000Z"),
    },
    {
      id: "comment-user-test-2-reply",
      courseId: "css",
      parentId: "comment-user-test-2",
      content: "ممنون از بازخورد شما.",
      authorName: "سارا محمدی",
      authorRole: "مدرس",
      authorAvatar: "/images/inst2.jpg",
      isInstructorReply: true,
      createdAt: new Date("2026-05-12T14:00:00.000Z"),
    },
    {
      id: "comment-user-test-3",
      courseId: "javascript",
      content: "آیا نسخه جدید ویدیوها هم اضافه می‌شود؟",
      rating: 5,
      authorId: testUserId,
      authorName: "کاربر تست",
      authorRole: "دانشجو",
      authorAvatar: "/images/student1.jpg",
      createdAt: new Date("2026-05-14T10:00:00.000Z"),
    },
  ] as const;

  for (const comment of testUserComments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }

  await prisma.userProfile.upsert({
    where: { userId: testUserId },
    update: {
      occupation: "برنامه نویس شرکت",
      about: "من امیرم، برنامه هم مینویسم",
      location: "تهران، ایران",
      mbtiType: "INTJ",
      skills: "react, css, html",
      githubLink: "https://github.com/spoticode_user",
      image: "/images/student1.jpg",
    },
    create: {
      id: `PRF-${testUserId}`,
      userId: testUserId,
      occupation: "برنامه نویس شرکت",
      about: "من امیرم، برنامه هم مینویسم",
      location: "تهران، ایران",
      mbtiType: "INTJ",
      skills: "react, css, html",
      githubLink: "https://github.com/spoticode_user",
      image: "/images/student1.jpg",
    },
  });

  const testTickets = [
    {
      id: "TIC-8421",
      userId: testUserId,
      title: "مشکل در تماشای ویدیوهای دوره ریکت و جاوااسکریپت",
      category: "technical",
      status: "answered",
      priority: "high",
      createdAt: new Date("2026-05-20T10:30:00.000Z"),
      updatedAt: new Date("2026-05-20T12:15:00.000Z"),
      messages: [
        {
          id: "TIC-8421-msg-1",
          senderType: "user",
          senderName: "کاربر تست",
          body: "سلام، ویدیوهای بخش چهارم لود نمی‌شود و خطای اتصال می‌دهد.",
          createdAt: new Date("2026-05-20T10:30:00.000Z"),
        },
        {
          id: "TIC-8421-msg-2",
          senderType: "support",
          senderName: "پشتیبانی اسپاتی‌کد",
          body: "سلام وقت بخیر. مشکل سرور پخش ویدیو برطرف شده، لطفاً دوباره بررسی کنید.",
          createdAt: new Date("2026-05-20T12:15:00.000Z"),
        },
      ],
    },
    {
      id: "TIC-8415",
      userId: testUserId,
      title: "درخواست بازگشت وجه خرید اشتباه",
      category: "billing",
      status: "investigating",
      priority: "high",
      createdAt: new Date("2026-05-18T09:15:00.000Z"),
      updatedAt: new Date("2026-05-18T09:15:00.000Z"),
      messages: [
        {
          id: "TIC-8415-msg-1",
          senderType: "user",
          senderName: "کاربر تست",
          body: "اشتباهی اشتراک یک ساله خریدم و درخواست اصلاح دارم.",
          createdAt: new Date("2026-05-18T09:15:00.000Z"),
        },
      ],
    },
  ] as const;

  for (const ticket of testTickets) {
    const { messages, ...ticketData } = ticket;
    await prisma.supportTicket.upsert({
      where: { id: ticket.id },
      update: ticketData,
      create: ticketData,
    });

    for (const message of messages) {
      await prisma.supportTicketMessage.upsert({
        where: { id: message.id },
        update: { ...message, ticketId: ticket.id },
        create: { ...message, ticketId: ticket.id },
      });
    }
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
