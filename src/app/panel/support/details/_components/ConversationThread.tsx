"use client";

import { Headphones, Paperclip, UserRound } from "lucide-react";
import { Message } from "../../data";
import { cn } from "@/lib/utils";

export default function ConversationThread({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center px-5 py-10 text-center">
        <p className="text-sm font-bold text-gray-500 dark:text-slate-400">
          هنوز پیامی در این تیکت ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => {
        const isUser = msg.sender === "user";

        return (
          <div
            key={msg.id}
            dir="ltr"
            className={cn("flex w-full gap-2.5", isUser ? "justify-end" : "justify-start")}
          >
            {!isUser ? (
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Headphones className="size-3.5" />
              </div>
            ) : null}

            <div
              className={cn(
                "max-w-[min(85%,22rem)] rounded-2xl px-3.5 py-2 lg:max-w-[min(72%,34rem)] lg:px-4 lg:py-2.5",
                isUser
                  ? "rounded-br-md bg-primary text-white"
                  : "rounded-bl-md border border-gray-200 bg-white text-gray-800 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-200",
              )}
            >
              <p className="mb-0.5 text-right text-[11px] font-bold opacity-70">
                {isUser ? "شما" : "پشتیبانی اسپاتی‌کد"}
              </p>
              <p className="whitespace-pre-wrap break-words text-right text-sm leading-6">
                {msg.text}
              </p>
              {!!msg.attachments?.length && (
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  {msg.attachments.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold",
                        isUser
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
                      )}
                    >
                      <Paperclip className="size-3.5" />
                      <span className="max-w-[140px] truncate">{file.name}</span>
                    </a>
                  ))}
                </div>
              )}
              <p
                className={cn(
                  "mt-1 text-right text-[10px] font-bold [unicode-bidi:plaintext]",
                  isUser ? "text-white/60" : "text-gray-400 dark:text-slate-500",
                )}
                dir="rtl"
              >
                {msg.timestamp}
              </p>
            </div>

            {isUser ? (
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <UserRound className="size-3.5" />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
