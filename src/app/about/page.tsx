import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-[#105230]/40 dark:bg-[#105230]/20 rounded-full blur-[140px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="flex-1 flex flex-col items-center w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-12 gap-20 sm:gap-32">
        {/* Hero Section */}
        <section className="w-full pt-10 sm:pt-16">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 animate-float">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              نسل جدید آموزش
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/50 dark:from-white dark:via-white dark:to-white/50 drop-shadow-sm max-w-4xl">
              <span className="text-glow">درباره اسپاتی کد</span>
            </h1>
            <h2 className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium leading-normal max-w-2xl">
              ما در حال ساختن آینده برنامه‌نویسی در ایران هستیم. جایی که
              تکنولوژی، هنر و آموزش با هم ترکیب می‌شوند.
            </h2>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 glass-panel rounded-4xl p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col gap-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">
                  auto_stories
                </span>
                داستان ما
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-loose text-justify">
                ما با هدف دموکراتیک کردن دانش مهندسی نرم‌افزار شروع کردیم. در
                اسپاتی کد، ما متعهد به ارائه محتوای آموزشی با بالاترین کیفیت و
                متدهای روز دنیا هستیم تا جامعه‌ای از توسعه‌دهندگان حرفه‌ای
                بسازیم. داستان ما از یک اتاق کوچک و یک ایده بزرگ شروع شد: اینکه
                هر ایرانی بتواند به دانشی دسترسی داشته باشد که در سیلیکون ولی
                تدریس می‌شود.
              </p>
              <button className="w-fit mt-2 text-primary font-bold hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 group-hover:gap-4 transition-all">
                بیشتر بخوانید
                <span className="material-symbols-outlined rotate-180 text-sm">
                  arrow_right_alt
                </span>
              </button>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-full min-h-[300px] lg:min-h-[500px] rounded-4xl overflow-hidden glass-panel-light p-2 relative">
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/20 mix-blend-color z-10 pointer-events-none"></div>
              <Image
                className="w-full h-full transition-transform duration-700 hover:scale-105"
                alt="Group of diverse developers collaborating around a laptop in a modern office with glass walls"
                src="/images/about_hero.jpg"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="w-full">
          <div className="flex flex-col gap-4 mb-10 text-center items-center">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              ماموریت و چشم‌انداز
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              قطب‌نمای ما برای هدایت مسیر آموزش تکنولوژی در خاورمیانه
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-6 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border-t-4 border-t-primary/50">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-3xl">
                  target
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ماموریت ما
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  دموکراتیک کردن دانش سطح بالای مهندسی نرم‌افزار برای همه
                  فارسی‌زبانان. ما می‌خواهیم مرزهای جغرافیایی را حذف کنیم.
                </p>
              </div>
            </div>
            {/* Vision Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-6 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border-t-4 border-t-primary/50">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-3xl">
                  visibility
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  چشم‌انداز ما
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  ایجاد یک جامعه جهانی از توسعه‌دهندگان ایرانی با مهارت‌های
                  بین‌المللی که می‌توانند آینده دیجیتال را شکل دهند.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-4 px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              تیم مدرسین ما
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              با متخصصینی که مسیر را طی کرده‌اند همراه شوید
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="glass-panel rounded-4xl p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="relative size-32 rounded-full p-1 bg-gradient-to-b from-primary/50 to-transparent">
                <Image
                  alt="Professional portrait of Ali, Senior Backend Engineer"
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-500"
                  src="/images/inst5.jpg"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  علی رضایی
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                  Senior Backend
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    alternate_email
                  </span>
                </a>
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    link
                  </span>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="glass-panel rounded-4xl p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="relative size-32 rounded-full p-1 bg-gradient-to-b from-primary/50 to-transparent">
                <Image
                  alt="Professional portrait of Maryam, Lead UI/UX Designer"
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-500"
                  src="/images/inst6.jpg"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  مریم کمالی
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                  Lead Designer
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    alternate_email
                  </span>
                </a>
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    link
                  </span>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="glass-panel rounded-4xl p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="relative size-32 rounded-full p-1 bg-gradient-to-b from-primary/50 to-transparent">
                <Image
                  alt="Professional portrait of Reza, DevOps Specialist"
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-500"
                  src="/images/about1.jpg"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  رضا احمدی
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                  DevOps Lead
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    alternate_email
                  </span>
                </a>
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    link
                  </span>
                </a>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="glass-panel rounded-4xl p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="relative size-32 rounded-full p-1 bg-gradient-to-b from-primary/50 to-transparent">
                <Image
                  alt="Professional portrait of Sara, Frontend Architect"
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 grayscale group-hover:grayscale-0 transition-all duration-500"
                  src="/images/about2.jpg"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  سارا نبوی
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                  Frontend Architect
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    alternate_email
                  </span>
                </a>
                <a
                  className="size-8 rounded-full bg-white/5 dark:bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">
                    link
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white rounded-t-[4rem] mt-12 pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl font-bold">
                  terminal
                </span>
              </div>
              <span className="text-2xl font-black">آکادمی کد</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              تخصصی‌ترین مرکز آموزش برنامه‌نویسی در ایران با هدف تربیت نیروهای
              حرفه‌ای برای بازارهای جهانی.
            </p>
            <div className="flex gap-4">
              <a
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                href="#"
              >
                <span className="material-icons-round">alternate_email</span>
              </a>
              <a
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                href="#"
              >
                <span className="material-icons-round">camera_alt</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              دسترسـی
            </h4>
            <ul className="space-y-5 text-gray-400 font-medium">
              <li>
                <Link
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="/courses"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  دوره‌ها
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  مسیرهای یادگیری
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  وبلاگ آموزشی
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  داستان موفقیت
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              پشتیبانی
            </h4>
            <ul className="space-y-5 text-gray-400 font-medium">
              <li>
                <Link
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="/about"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  درباره ما
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  ارتباط با ما
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  سوالات متداول
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  قوانین و مقررات
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              تماس بـا مـا
            </h4>
            <div className="space-y-6 text-gray-400">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">
                  location_on
                </span>
                <p className="text-sm">
                  تهران، خیابان آزادی، کارخانه نوآوری، ساختمان آکادمی کد
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  call
                </span>
                <p className="text-lg font-black dir-ltr text-right">
                  ۰۲۱-۹۱۰۰۱۰۰۰
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  mail
                </span>
                <p className="text-sm">support@codeacademy.ir</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">
          <p>تمامی حقوق مادی و معنوی برای آکادمی کد محفوظ است © ۱۴۰۳</p>
          <div className="flex gap-10">
            <a className="hover:text-white transition-colors" href="#">
              حریم خصوصی
            </a>
            <a className="hover:text-white transition-colors" href="#">
              شرایط استفاده
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
