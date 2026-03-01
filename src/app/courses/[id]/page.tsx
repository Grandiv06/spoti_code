import Image from "next/image";
import CourseCurriculum from "../../components/CourseCurriculum";
import CourseFAQ from "../../components/CourseFAQ";
import CourseReviews from "../../components/CourseReviews";
import CourseHero from "../../components/CourseHero";
import AddToCartButton from "../../components/AddToCartButton";

const COURSE_IDS = ["html", "css", "javascript", "react", "nextjs"];

export function generateStaticParams() {
  return COURSE_IDS.map((id) => ({ id }));
}

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg"></div>
      <div className="fixed top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-10">
        <CourseHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* About Section */}
            <section className="glass-panel rounded-4xl p-8 md:p-12 glass-card-hover">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 dark:border-gray-700">
                  <span className="material-symbols-outlined filled text-2xl">
                    description
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  درباره این دوره
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-9 font-medium">
                <p className="mb-4">
                  این دوره حاصل تجربه‌ی سال‌ها کار بر روی پروژه‌های بزرگ مقیاس
                  است. هدف ما صرفاً آموزش سینتکس نیست، بلکه انتقال{" "}
                  <span className="text-primary font-bold bg-primary/10 dark:bg-primary/20 px-1 rounded">
                    طرز تفکر مهندسی
                  </span>{" "}
                  است.
                </p>
                <p>
                  در طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید. از
                  بهینه‌سازی پرفرمنس گرفته تا مدیریت state‌های پیچیده با Redux
                  Toolkit و پیاده‌سازی Authentication امن در Next.js. این یک
                  دوره تئوری نیست؛ یک شبیه‌ساز محیط کار است.
                </p>
              </div>
            </section>

            {/* سرفصل‌های آموزشی - باکس جدا با دکمه بستن */}
            <CourseCurriculum totalLessons={120} />

            {/* سوالات متداول - باکس جدا با دکمه بستن */}
            <CourseFAQ />

            {/* Instructor Section */}
            <section className="glass-panel rounded-4xl p-8 md:p-12 glass-card-hover mt-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                <div className="relative shrink-0 group">
                  <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Image
                      className="w-full h-full object-cover"
                      alt="Instructor"
                      src="/images/inst1.jpg"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <Image
                      alt="TS"
                      className="size-8"
                      src="/images/inst4.jpg"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    امیررضا رضایی
                  </h3>
                  <span className="text-primary font-bold block mb-4">
                    توسعه‌دهنده ارشد در اسنپ
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                    عاشق جاوااسکریپت و یادگیری مستمر. در این سال‌ها به بیش از
                    ۵۰۰۰ دانشجو کمک کرده‌ام تا با اعتماد به نفس وارد دنیای
                    حرفه‌ای برنامه‌نویسی شوند. تمرکز من بر روی انتقال تجربیات
                    واقعی بازار کار است.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a
                      className="px-6 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-sm shadow-sm transition-colors border border-white dark:border-gray-700"
                      href="#"
                    >
                      مشاهده رزومه
                    </a>
                    <div className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold text-sm border border-primary/20 dark:border-primary/30">
                      <span className="material-symbols-outlined text-lg filled">
                        stars
                      </span>
                      <span>مدرس برگزیده سال</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <CourseReviews />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 relative z-20">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="glass-panel rounded-4xl p-8 border border-white/80 dark:border-gray-700 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 line-through decoration-red-500 decoration-2 mb-2">
                      ۶,۰۰۰,۰۰۰ تومان
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        ۴,۵۰۰,۰۰۰
                      </span>
                      <span className="text-lg font-bold text-primary">
                        تومان
                      </span>
                    </div>
                    <span className="mt-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/30">
                      ۲۰٪ تخفیف محدود
                    </span>
                  </div>
                  <AddToCartButton
                    course={{
                      id: params.id,
                      title: "دوره جامع React و Next.js",
                      price: "4,500,000",
                      image: "/images/react-green.png",
                      instructor: "امیررضا رضایی",
                    }}
                  />
                  <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 mt-5 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified_user
                    </span>
                    گارانتی بازگشت وجه تا ۳۰ روز
                  </p>
                </div>
              </div>

              {/* Features Card */}
              <div className="glass-panel rounded-4xl p-8 border border-white/60 dark:border-gray-700">
                <h4 className="font-black text-gray-900 dark:text-white text-lg mb-6 px-2 border-r-4 border-primary rounded-r">
                  ویژگی‌های متمایز
                </h4>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-primary-dark dark:text-primary flex items-center justify-center shrink-0 border border-primary/20 dark:border-primary/30">
                      <span className="material-symbols-outlined text-[20px]">
                        all_inclusive
                      </span>
                    </span>
                    دسترسی همیشگی به آپدیت‌ها
                  </li>
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                      <span className="material-symbols-outlined text-[20px]">
                        workspace_premium
                      </span>
                    </span>
                    مدرک معتبر و قابل ترجمه
                  </li>
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-purple-500 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/30">
                      <span className="material-symbols-outlined text-[20px]">
                        forum
                      </span>
                    </span>
                    پشتیبانی اختصاصی در دیسکورد
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
