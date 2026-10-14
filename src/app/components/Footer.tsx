import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white rounded-t-[4rem] mt-12 pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={32}
              height={32}
              className="w-8 h-8 group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-black">اسپاتی کد</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            تخصصی‌ترین مرکز آموزش برنامه‌نویسی در ایران با هدف تربیت نیروهای
            حرفه‌ای برای بازارهای جهانی.
          </p>
          <div className="flex gap-4">
            <a
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1 text-xl"
              href="https://t.me/spoticode"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegramPlane />
            </a>
            <a
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1 text-xl"
              href="https://www.instagram.com/spoti_code?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1 text-xl"
              href="#"
            >
              <FaLinkedinIn />
            </a>
            <a
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1 text-xl"
              href="https://www.youtube.com/@spoticode"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
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
              <Link
                className="hover:text-primary transition-colors flex items-center gap-2"
                href="/learning-path"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                مسیرهای یادگیری
              </Link>
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
              <Link
                className="hover:text-primary transition-colors flex items-center gap-2"
                href="/contact"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                ارتباط با ما
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary transition-colors flex items-center gap-2"
                href="/faq"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                سوالات متداول
              </Link>
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
            نماد اعتماد و ارتباط
          </h4>
          <div className="space-y-6 text-gray-400">
            <a
              href="mailto:info@spoticode.com"
              className="flex items-center gap-4 hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                mail
              </span>
              <span className="text-sm font-semibold dir-ltr text-right">
                info@spoticode.com
              </span>
            </a>
            <div className="pt-2 flex justify-center items-center gap-3">
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=8093749&Code=liRC5Z6KudPpc1L6eZdTppbZEdbYqgf9"
                className="inline-flex items-center justify-center bg-white/10 p-2 rounded-2xl hover:bg-white/20 transition-all hover:scale-105"
                title="نماد اعتماد الکترونیکی"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=8093749&Code=liRC5Z6KudPpc1L6eZdTppbZEdbYqgf9"
                  alt="اینماد"
                  style={{ cursor: "pointer" }}
                  className="w-20 h-20 object-contain rounded-xl bg-white p-1"
                />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://gateway.zibal.ir/trustMe/spoticode.com"
                className="inline-flex items-center justify-center bg-white/10 p-2 rounded-2xl hover:bg-white/20 transition-all hover:scale-105"
                title="پرداخت امن زیبال"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://zibal.ir/trust/assets/2.png"
                  alt="پرداخت امن زیبال"
                  className="w-20 h-20 object-contain rounded-xl bg-white p-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">
        <p>تمامی حقوق مادی و معنوی برای اسپاتی‌کد محفوظ است © ۱۴۰۵</p>
        <div className="flex gap-10">
          <a className="hover:text-white transition-colors cursor-pointer" href="#">
            حریم خصوصی
          </a>
          <a className="hover:text-white transition-colors cursor-pointer" href="#">
            شرایط استفاده
          </a>
        </div>
      </div>
    </footer>
  );
}
