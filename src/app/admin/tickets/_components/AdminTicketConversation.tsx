"use client";

import React from "react";
import { Headphones, User } from "lucide-react";
import type { Message } from "@/app/panel/support/data";
import { cn } from "@/lib/utils";

export default function AdminTicketConversation({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-8 text-center text-xs font-bold text-gray-400">
        هنوز پیامی برای این تیکت ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-1 sm:gap-5">
      {messages.map((message) => {
        const isAdmin = message.sender === "support";

        return (
          <div
            key={message.id}
            className={cn("flex w-full", isAdmin ? "justify-start" : "justify-end")}
          >
            <div
              className={cn(
                "flex max-w-[min(100%,16rem)] flex-col gap-1.5 sm:max-w-[20rem] sm:gap-2 md:max-w-[24rem]",
                isAdmin ? "items-start" : "items-end"
              )}
            >
              <div
                className={cn(
                  "flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black",
                  isAdmin ? "flex-row text-primary" : "flex-row-reverse text-gray-500 dark:text-gray-400"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 sm:h-8 sm:w-8",
                    isAdmin
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-gray-200 bg-gray-100 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                  )}
                >
                  {isAdmin ? <Headphones className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <span className="text-xs text-gray-900 dark:text-white">{message.senderName}</span>
                <span className="text-gray-400 dark:text-gray-500 shrink-0">{message.timestamp}</span>
              </div>

              <div
                className={cn(
                  "w-fit max-w-full break-words [overflow-wrap:anywhere] rounded-[1.5rem] px-4 py-3 text-sm font-medium leading-relaxed sm:rounded-[1.75rem] sm:px-5 sm:py-4",
                  isAdmin
                    ? "rounded-tr-md bg-primary text-white"
                    : "rounded-tl-md border border-gray-100 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-black/20 dark:text-gray-100"
                )}
              >
                {message.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
