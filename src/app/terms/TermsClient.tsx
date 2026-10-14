"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  UserCheck,
  MonitorPlay,
  Trophy,
  Copyright,
  ShieldAlert,
  CreditCard,
  RotateCcw,
  Lock,
  Scale,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
}

const termSections: TermSection[] = [
  {
    id: "account",
    number: "۱",
    title: "ثبت‌نام و حساب کاربری",
    icon: UserCheck,
    content:
      "جهت استفاده از دوره‌ها، کاربر باید با اطلاعات صحیح و واقعی ثبت‌نام کند. هر فرد تنها مجاز به ایجاد یک حساب کاربری است. استفاده مشترک چند نفر از یک حساب اکیداً ممنوع بوده و سایت حق مسدودسازی چنین حساب‌هایی را دارد. حفظ امنیت اطلاعات ورود بر عهده کاربر است و استفاده از هویت جعلی پیگرد قانونی دارد.",
  },
  {
    id: "spotplayer",
    number: "۲",
    title: "دسترسی به دوره‌ها و اسپات‌پلیر",
    icon: MonitorPlay,
    content:
      "دوره‌های غیررایگان صرفاً از طریق نرم‌افزار SpotPlayer قابل پخش هستند. هر کاربر مجاز است نرم‌افزار را روی یک سیستم دسکتاپ و یک دستگاه موبایل فعال کند. در صورت نیاز به تعویض دستگاه، کاربر باید فاکتور رسمی تعمیر یا خرید را در تیکت پشتیبانی ارسال کند تا لایسنس قبلی باطل و لایسنس جدید صادر شود. در صورت تشخیص استفاده اشتراکی از لایسنس، دسترسی کاربر فوراً قطع خواهد شد.",
  },
  {
    id: "support-leaderboard",
    number: "۳",
    title: "پشتیبانی دائم و لیدربورد",
    icon: Trophy,
    content:
      "خریداران دوره‌ها به محتوای ویدیوها دسترسی مادام‌العمر دارند و از پشتیبانی دائمی (شامل رفع اشکال و پاسخ به سؤالات) بهره‌مند می‌شوند.\nهمچنین جهت ایجاد انگیزه، امکان شرکت در «لیدربورد» (جدول رتبه‌بندی) فراهم شده است. حضور در این بخش کاملاً اختیاری است و هرگونه تقلب یا تلاش برای دستکاری امتیازها ممنوع می‌باشد.",
  },
  {
    id: "copyright",
    number: "۴",
    title: "حقوق مالکیت فکری (کپی‌رایت)",
    icon: Copyright,
    content:
      "تمامی حقوق مادی و معنوی محتوای آموزشی سایت (شامل ویدیوها، متون، سورس‌کدها و پروژه‌ها) متعلق به پلتفرم است و تحت قوانین کپی‌رایت ایران محافظت می‌شود. کاربران صرفاً مجاز به استفاده شخصی هستند. هرگونه تکثیر، ضبط، انتشار، فروش مجدد یا دور زدن قفل‌های امنیتی (DRM) اکیداً ممنوع است و موجب مسدود شدن حساب و پیگرد قضایی خواهد شد.",
  },
  {
    id: "security",
    number: "۵",
    title: "رفتار کاربران و امنیت سایت",
    icon: ShieldAlert,
    content:
      "کاربران موظفند در تعاملات سایت (نظرات و پروفایل‌ها) شئونات اخلاقی را رعایت کنند. انتشار مطالب توهین‌آمیز، غیرقانونی، اسپم و تبلیغاتی ممنوع است. همچنین هرگونه تلاش برای خرابکاری، نفوذ، حملات سایبری یا استفاده از ربات‌ها جهت استخراج داده‌ها ممنوع بوده و سریعاً از طریق مراجع قانونی پیگیری می‌شود.",
  },
  {
    id: "payments",
    number: "۶",
    title: "پرداخت‌ها و امور مالی",
    icon: CreditCard,
    content:
      "پرداخت‌ها به تومان و از طریق درگاه‌های امن انجام می‌شود. کاربر موظف است از کارت بانکی معتبر که متعلق به خود اوست (یا اجازه قانونی دارد) استفاده کند. تمامی مالیات‌ها و عوارض در قیمت دوره لحاظ شده‌اند و هزینه پنهانی دریافت نمی‌شود. پس از پرداخت موفق، دسترسی به دوره بلافاصله فعال می‌گردد.",
  },
  {
    id: "refund",
    number: "۷",
    title: "سیاست انصراف و استرداد وجه",
    icon: RotateCcw,
    content:
      "ما برای رضایت کاربران سیاست بازگشت وجه منصفانه‌ای داریم. در صورتی که پس از خرید دوره از محتوای آن رضایت نداشتید، چنانچه کمتر از ۷ روز تقویمی از زمان خرید گذشته باشد و کمتر از ۲ ساعت از ویدیوهای دوره را تماشا کرده باشید، می‌توانید درخواست بازگشت وجه دهید. در این صورت کل مبلغ (پس از کسر کارمزدهای درگاه و صدور لایسنس) عودت داده می‌شود. درخواست‌ها باید از طریق تیکت پشتیبانی ثبت شوند. پس از تأیید، مبلغ ظرف ۷۲ ساعت کاری بازگردانده شده و دسترسی کاربر به دوره لغو می‌گردد. تقاضای استرداد وجه مکرر و سوءاستفاده از این سیاست مجاز نیست.",
  },
  {
    id: "privacy",
    number: "۸",
    title: "حریم خصوصی و حفاظت از داده‌ها",
    icon: Lock,
    content:
      "اطلاعات شخصی شما (نام، شماره تماس، ایمیل و سوابق آموزشی) نزد ما کاملاً محرمانه است و به هیچ شخص ثالثی فروخته نمی‌شود (مگر با حکم مراجع ذی‌صلاح). این اطلاعات صرفاً جهت بهبود کیفیت آموزش، تحلیل وضعیت یادگیری شما و اطلاع‌رسانی استفاده می‌گردد.",
  },
  {
    id: "disputes",
    number: "۹",
    title: "تغییرات مقررات و حل اختلاف",
    icon: Scale,
    content:
      "این توافقنامه ممکن است در طول زمان به‌روزرسانی شود و ادامه استفاده از سایت به معنای پذیرش مقررات جدید است. در صورت بروز هرگونه اختلاف، ابتدا موضوع از طریق مذاکره با پشتیبانی پیگیری می‌شود و در صورت عدم توافق، مراجع قضایی جمهوری اسلامی ایران صالح به رسیدگی خواهند بود.",
  },
];

export default function TermsClient() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* المان‌های نوری Ambient Glow شبیه سبک اپل */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-1/2 translate-x-1/2 w-[700px] h-[500px] bg-primary/[0.07] rounded-full blur-[140px] transform-gpu" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/[0.04] rounded-full blur-[150px] transform-gpu" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/[0.05] rounded-full blur-[130px] transform-gpu" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-24 text-right" dir="rtl">
        {/* هدر صفحه (Apple-Inspired Hero Header) */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-zinc-300 backdrop-blur-md mb-6 shadow-sm hover:border-white/20 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>اسپاتی‌کد • شفافیت، امنیت و اعتماد متقابل</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 tracking-tight leading-[1.25] sm:leading-[1.2] mb-5 max-w-3xl">
            قوانین و مقررات پلتفرم آموزشی اسپاتی کد
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-medium leading-relaxed max-w-2xl">
            شرایط و ضوابط حاکم بر استفاده از خدمات، دوره‌های تخصصی، سیستم پخش امن و حقوق متقابل دانشجو و پلتفرم در اسپاتی‌کد
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>مطابق با قوانین تجارت الکترونیک جمهوری اسلامی ایران</span>
          </div>
        </div>

        {/* کارت گلس مقدمه و تعاریف */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 mb-10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-primary shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  مقدمه و تعاریف
                </h2>
                <span className="text-[11px] text-zinc-500 font-medium">
                  پیش‌درآمد توافق‌نامه کاربری
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-loose sm:leading-loose text-justify font-normal">
              به پلتفرم آموزشی ما خوش آمدید. این وبسایت مطابق با قوانین تجارت الکترونیکی جمهوری اسلامی ایران فعالیت میکند و استفاده از خدمات آن، به معنی پذیرش کامل مقررات زیر است. در این متن منظور از «پلتفرم»، وبسایت و دورههای آموزشی ماست و منظور از «کاربر»، هر فردی است که از این خدمات استفاده میکند.
            </p>
          </div>
        </div>

        {/* بخش آکاردئون‌ها (Shadcn UI Accordion) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm sm:text-base font-bold text-zinc-200">
                بخش‌های تفصیلی قوانین و مقررات
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-medium">
              برای مشاهده جزئیات روی هر بخش کلیک کنید
            </span>
          </div>

          <Accordion
            type="multiple"
            defaultValue={["account", "spotplayer"]}
            className="space-y-3.5"
          >
            {termSections.map((section) => {
              const Icon = section.icon;

              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.045] backdrop-blur-md transition-all duration-300 overflow-hidden shadow-lg data-[state=open]:border-primary/30 data-[state=open]:bg-white/[0.04] group"
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-4.5 sm:py-5 text-right hover:no-underline select-none">
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 text-right">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-primary group-hover:border-primary/30 group-data-[state=open]:text-primary group-data-[state=open]:border-primary/40 transition-all shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono text-zinc-500 font-semibold">
                          #{section.number}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
                          {section.title}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 sm:px-6 pb-6 pt-2">
                    <div className="pt-3 border-t border-white/[0.06]">
                      <p className="text-xs sm:text-sm text-zinc-300 leading-loose sm:leading-loose text-justify font-normal whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* باکس تماس با پشتیبانی و سوالات (Apple-Style Support Callout) */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-right shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 shrink-0">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                سوالی درباره قوانین و مقررات دارید؟
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                تیم پشتیبانی اسپاتی‌کد همواره در بخش تیکت‌ها و تماس با ما پاسخگوی ابهامات حقوقی و فنی شماست.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>ارتباط با پشتیبانی</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
