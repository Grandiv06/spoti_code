import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body transition-colors duration-300">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob-shape bg-primary/20 w-96 h-96 rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 dark:bg-primary/10"></div>
        <div className="blob-shape bg-blue-400/20 w-80 h-80 rounded-full bottom-0 left-0 translate-y-1/2 -translate-x-1/2 dark:bg-blue-600/10"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span className="material-icons-round text-2xl">code</span>
          </div>
          <span className="text-xl font-bold tracking-tight">آکادمی کد</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md px-2 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
          <a className="px-5 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary transition-colors" href="#">
            دوره‌ها
          </a>
          <a className="px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" href="#">
            منتورینگ
          </a>
          <a className="px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" href="#">
            داستان موفقیت
          </a>
          <a className="px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" href="#">
            درباره ما
          </a>
        </div>
        <a className="hidden md:flex bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg" href="#">
          ورود / ثبت‌نام
          <span className="material-icons-round mr-2 text-base">login</span>
        </a>
        <button className="md:hidden p-2 rounded-lg bg-white dark:bg-surface-dark shadow-sm">
          <span className="material-icons-round">menu</span>
        </button>
      </nav>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-full shadow-sm text-xs font-medium text-primary border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              دوره جدید جامعه شروع شد
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">
              مسیر <span className="text-primary underline decoration-wavy decoration-2 underline-offset-8">حرفه‌ای</span> شدن <br />
              در دنیای برنامه‌نویسی
            </h1>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark leading-loose max-w-2xl mx-auto lg:mx-0">
              با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما هستیم.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group" href="#">
                شروع یادگیری
                <span className="material-icons-round group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </a>
              <a className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-text-light dark:text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-700" href="#">
                <span className="material-icons-round text-primary">grid_view</span>
                مشاهده دوره‌ها
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
              <div className="flex -space-x-3 space-x-reverse">
                <Image
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAazZSzTe3MdhTzPF3dHu5a6qk3uJvliezBsbiDS3J6kmbeMjRET2LFFgodqE-LJZCWx1AB2FQ9ff40jaoL-3sdL1D31YU7tiI16JUMc-SxIANn7-Wqr4Y4UlAJZ1616qaBJTNEFT4YDLkK8ZSEGecrKibdo7A13LPmBPOqL4AWRAOm2J__H_Csu3wbl88JoKaI9GtSuvhOWwzzMRVmtfp7pN8xVgW1-HhJmePeASf2FacBQ01gBsbVCkcvaQEZ4T9RXwxNVKHJfY6f"
                  width={40}
                  height={40}
                />
                <Image
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhZjlbzi0KH6Wc7h8OA-Cc_Xj8c9-6WhzM_W4HCaeUFUOOmGyFYuQwii6uHEo724TYDLAMJj0OdQwJ-WtDiia8g6EnTj-yA8o85_qQreW-eBJpQKHD4aO1GKcBPRNSOQeTn9WkyIC9zwDo-1EUcyM_2gZzYG768GNRAQgDOa4ncQuKfisUESSr4LLLviJE5CcQroYqkm70XPUxP3Z5UARAmIjSENSbAZSYMws7udJ5Od_xVL0zpLfXC7PQSR9czdBcCi7adN5roKef"
                  width={40}
                  height={40}
                />
                <Image
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZzvndaxs8tWctegXESOt8G2Sr-B4h_6eK7iWg3kDFqTY6rpYKsU_L-lEMpL8I2xIyYN-F9v_XHqxxzW3pqXn048bQ6kcgSGqhzSASgHbI8U_viS-5EC-k6IaCLpyjYwZ3R3vRvB9PmjWziTLp1iK4phbkmxcmqTit5dDQmW09UMMunD6AObFRj1GrNPDjmHxpE60Hrr2Bf5FnyzhwK55t776K9raMzDGPW8Q83dpreAv9e5sFP4D8oHapuRtY5n1g8XFeyB5zvgVq"
                  width={40}
                  height={40}
                />
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-primary/20 flex items-center justify-center text-xs font-bold text-primary backdrop-blur-sm">+۲۵۰</div>
              </div>
              <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">دانشجوی فعال در این ترم</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-video w-full bg-black rounded-4xl shadow-2xl overflow-hidden relative group cursor-pointer border-4 border-white dark:border-surface-dark/50">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
              <Image
                alt="Coding workspace"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBGwIz3RE15OuWqY3np5mw1yisfwiNcY8K57Nce439EBABYm3Xcw2nEvmBbnqHNQkeY1O1_fC57JSTlKYFjCkfbuyk2uUeSd4vWMt1gpXGT5DnFiBtWg_Ld6ry6bvUNXZo0B4rxCCG2X1C0vhRQGoAodnqHYleM02CjAd3fLz2lppGur5EAicFs18-8dD_7yWjiDgMz_hh0CfTJJnuv1KIxcmD1FVlw1CfUJMfr8ZpZBd1EeTJTdFMhbG9EuyHvojHVHrLLebGhYpO"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/90 backdrop-blur rounded-full flex items-center justify-center pl-1 text-white shadow-[0_0_40px_rgba(34,197,94,0.6)] group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-5xl">play_arrow</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-3xl -z-10 rotate-12 opacity-80 animate-bounce" style={{ animationDuration: "3s" }}></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500 rounded-full -z-10 opacity-60 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-surface-dark rounded-4xl p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-green-100/50 dark:shadow-none border border-green-50 dark:border-gray-700 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mb-6 text-primary rotate-3">
                <span className="material-icons-round text-5xl">school</span>
              </div>
              <h3 className="text-4xl font-black text-text-light dark:text-white mb-2">۱۰,۰۰۰+</h3>
              <p className="text-xl font-medium text-text-muted-light dark:text-text-muted-dark">دانشجو فعال</p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-4xl p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-green-100/50 dark:shadow-none border border-green-50 dark:border-gray-700 hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6 text-blue-500 -rotate-3">
                <span className="material-icons-round text-5xl">library_books</span>
              </div>
              <h3 className="text-4xl font-black text-text-light dark:text-white mb-2">۵۰+</h3>
              <p className="text-xl font-medium text-text-muted-light dark:text-text-muted-dark">دوره تخصصی</p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-4xl p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-green-100/50 dark:shadow-none border border-green-50 dark:border-gray-700 hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mb-6 text-purple-500 rotate-3">
                <span className="material-icons-round text-5xl">support_agent</span>
              </div>
              <h3 className="text-4xl font-black text-text-light dark:text-white mb-2">۲۴/۷</h3>
              <p className="text-xl font-medium text-text-muted-light dark:text-text-muted-dark">پشتیبانی و منتورینگ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black mb-4">دسته‌بندی‌های آموزشی</h2>
              <p className="text-text-muted-light dark:text-text-muted-dark">مسیر مورد علاقه خود را انتخاب کنید و متخصص شوید</p>
            </div>
            <a className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4 md:mt-0" href="#">
              مشاهده همه دوره‌ها
              <span className="material-icons-round">arrow_back</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-surface-dark rounded-4xl p-8 border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xs">HTML</div>
                <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors text-3xl rotate-45 group-hover:rotate-0 transform duration-300">arrow_outward</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">توسعه وب (Full Stack)</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6 leading-relaxed">یادگیری HTML, CSS, React و Nodejs برای ساخت وب‌سایت‌های مدرن و مقیاس‌پذیر.</p>
              <div className="flex gap-3 text-xs font-bold">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۸۵ ساعت</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۲۰ پروژه</span>
              </div>
            </div>
            <div className="group bg-white dark:bg-surface-dark rounded-4xl p-8 border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-500">
                  <span className="material-icons-round text-2xl">smartphone</span>
                </div>
                <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors text-3xl rotate-45 group-hover:rotate-0 transform duration-300">arrow_outward</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">برنامه‌نویسی موبایل</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6 leading-relaxed">ساخت اپلیکیشن‌های اندروید و iOS با فلاتر و کاتلین. ورود به بازار جهانی اپ استور.</p>
              <div className="flex gap-3 text-xs font-bold">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۶۰ ساعت</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۱۷ پروژه</span>
              </div>
            </div>
            <div className="group bg-white dark:bg-surface-dark rounded-4xl p-8 border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
                  <span className="material-icons-round text-2xl">smart_toy</span>
                </div>
                <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors text-3xl rotate-45 group-hover:rotate-0 transform duration-300">arrow_outward</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">هوش مصنوعی و داده</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6 leading-relaxed">ورود به دنیای پایتون، ماشین لرنینگ و تحلیل داده. پردرآمدترین تخصص دهه آینده.</p>
              <div className="flex gap-3 text-xs font-bold">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۱۲۰ ساعت</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">۳۰ پروژه</span>
              </div>
            </div>
          </div>
          <a className="flex md:hidden items-center justify-center gap-2 text-primary font-bold mt-8 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm" href="#">
            مشاهده همه دوره‌ها
            <span className="material-icons-round">arrow_back</span>
          </a>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">نظرات دانشجویان</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark">تجربه علاقه خود را انتخاب کنید و متخصص شوید</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative bg-white dark:bg-surface-dark rounded-4xl p-8 pt-12 text-center shadow-lg border border-gray-50 dark:border-gray-700 mt-0 lg:mt-8">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Image
                  alt="Student"
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrf1RdMrodFjhWJh-iK0XhouvsguIc_tqt1eWfmtW3mlexRVf7sjoWuI1x5IZhQ_gGygXex_D75Z8Gb4m1jNnP21y21f7eAriTeXNUGubdtVgFMN8AsNoTcD778AyQvO07-blnfK4wJptF2aQaiO545okVeIJJOJYSe_oW3I9W6xvJb--Zo2ngO0C8LX8Xii18oga40DOPc0xTC8Q0-g4H8ScMBysCL2_5SNcMWbHYPU7MNS-zF_ehST9IpneJvGx0r6JcuDIAGrYG"
                  width={80}
                  height={80}
                />
              </div>
              <span className="material-icons-round text-4xl text-gray-200 dark:text-gray-600 mb-4 block">format_quote</span>
              <p className="text-sm leading-7 text-text-muted-light dark:text-text-muted-dark mb-6">
                &quot;ورود به دنیای پایتون این قدر جذاب خواهد بود فکر نمی‌کردم. پشتیبانی عالی و پروژه‌های عملی اعتماد به نفس من رو بالا برد.&quot;
              </p>
              <h4 className="font-bold text-lg">احسان حسینی</h4>
              <span className="text-xs text-primary">فول‌استک دولوپر</span>
            </div>
            <div className="relative bg-white dark:bg-surface-dark rounded-4xl p-8 pt-12 text-center shadow-2xl border-2 border-primary/10 dark:border-primary/20 scale-105 z-10">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Image
                  alt="Student"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-surface-dark shadow-md bg-green-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SOsEeQSj_gKZRlFLcvtfLiORWOblAq9GHZkXeH1i8LD1wdGmu27BM3y3BbYzz7yLk4SJXNM-Dnbe5Ep0xW2NeGOU-AYO-mNcl4PQNUu7pzG8rQ4OaWpmZ6PVNwfgjXeusQ8t_Q3pQ4bdTf25pxvnoKeDidCF6BsDT09ldAYoaFsF-qJ57-K2b34YgtcXa-r2N9KoR9l0D0Th8PSGkJwfXQOT-ceVI1e24ifGlVlm4PLRR8NpCRSmSh7pLDDzCy7fuS-AZflC8wsR"
                  width={96}
                  height={96}
                />
              </div>
              <span className="material-icons-round text-4xl text-primary/30 mb-4 block">format_quote</span>
              <p className="text-base font-medium leading-7 text-text-light dark:text-text-dark mb-6">
                &quot;برای اولین بار تونستم اپلیکیشن‌های iOS خودم رو به اپ‌استور بفرستم. واقعا از نصحیت‌های منتورینگ ممنونم که مسیر رو برام شفاف کردند.&quot;
              </p>
              <h4 className="font-bold text-xl">تایماز منافی</h4>
              <span className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full mt-1 inline-block">توسعه‌دهنده موبایل</span>
            </div>
            <div className="relative bg-white dark:bg-surface-dark rounded-4xl p-8 pt-12 text-center shadow-lg border border-gray-50 dark:border-gray-700 mt-0 lg:mt-8">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Image
                  alt="Student"
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqLxI5l9LptlDqcl0isYj3mv3ijPcEak2a_0B9KGXDgpWeUhLqT9ZOo0VPRVbS5RWuRe9NoFAMrLpRotrUiE7kbg9AUfefCiItSixRrYQaAPwE15VNOQ2_bFaQfOOsOLsgCEZILMAcB7YUOE9g2-KIRX0movKlctPaGhr5OvTKGBYzxSUczp3OXnUIXsZb22C2iNZhoLs43irP4mtL8810m4KPk4S-qDYe9mVm4o-fizV_u2z7BBs8vzfcf6lu8aAWCv92egcw6ALl"
                  width={80}
                  height={80}
                />
              </div>
              <span className="material-icons-round text-4xl text-gray-200 dark:text-gray-600 mb-4 block">format_quote</span>
              <p className="text-sm leading-7 text-text-muted-light dark:text-text-muted-dark mb-6">
                &quot;مرکز تخصصی یادگیری، کیفیت آموزش و تمرین‌های مداوم باعث شد در کمتر از ۶ ماه وارد بازار کار شوم.&quot;
              </p>
              <h4 className="font-bold text-lg">سارا احمدی</h4>
              <span className="text-xs text-primary">فرانت‌اند کار</span>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-12">
            <span className="w-8 h-2 bg-primary rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white rounded-t-5xl mt-12 pt-20 pb-10 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <span className="material-icons-round text-2xl">code</span>
              </div>
              <span className="text-xl font-bold">آکادمی کد</span>
            </div>
            <p className="text-gray-400 text-sm leading-7">
              تخصصی‌ترین مرکز آموزش برنامه‌نویسی در ایران با جدیدترین متد‌های آموزشی مهندسی برای بازار کار بین‌المللی.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                <span className="material-icons-round text-lg">alternate_email</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                <span className="material-icons-round text-lg">photo_camera</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">دوره‌های محبوب</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">آموزش فرانت‌اند</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">آموزش پایتون</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">آموزش فلاتر</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">آموزش بلاکچین</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">دسترسی سریع</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a className="hover:text-primary transition-colors" href="#">درباره ما</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">تماس با ما</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">سوالات متداول</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">قوانین و مقررات</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">تماس با ما</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="material-icons-round text-primary text-lg">location_on</span>
                تهران، خیابان آزادی، کارخانه نوآوری، ساختمان آکادمی
              </li>
              <li className="flex items-center gap-3">
                <span className="material-icons-round text-primary text-lg">phone</span>
                ۰۲۱-۹۱۰۰۱۰۰۰
              </li>
              <li className="flex items-center gap-3">
                <span className="material-icons-round text-primary text-lg">email</span>
                info@codeacademy.ir
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>تمامی حقوق برای آکادمی کد محفوظ است © ۱۴۰۳</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#">حریم خصوصی</a>
            <a href="#">شرایط استفاده</a>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-t from-gray-900 to-transparent opacity-50 pointer-events-none"></div>
      </footer>
    </div>
  );
}
