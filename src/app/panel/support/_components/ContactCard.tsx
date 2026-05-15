"use client";

import React from "react";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";

export default function ContactCard() {
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "ایمیل پشتیبانی",
      value: "support@spoticode.ir",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "تماس تلفنی",
      value: "۰۲۱-۱۲۳۴۵۶۷۸",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "ساعات پاسخگویی",
      value: "شنبه تا پنجشنبه، ۹ تا ۱۸",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">ارتباط با ما</h3>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${method.bg} ${method.color} flex items-center justify-center shrink-0`}>
              {method.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{method.label}</p>
              <p className="text-base font-black text-gray-900 dark:text-white dir-ltr text-right">{method.value}</p>
            </div>
          </div>
        ))}

        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
            تیم پشتیبانی اسپاتی‌کد همواره در تلاش است تا بهترین تجربه یادگیری را برای شما فراهم کند. اگر سوالی دارید که در تیکت‌ها مطرح نشده، می‌توانید از طریق راه‌های بالا با ما در تماس باشید.
          </p>
        </div>
      </div>
    </div>
  );
}
