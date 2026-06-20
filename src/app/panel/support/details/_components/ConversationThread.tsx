"use client";

import React from "react";
import { User, Headphones } from "lucide-react";
import { Message } from "../../data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ConversationThread({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">هنوز پیامی در این تیکت ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {messages.map((msg, index) => {
        const isUser = msg.sender === "user";

        return (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.2) }}
            key={msg.id}
            className={cn("flex w-full", isUser ? "justify-start" : "justify-end")}
          >
            <div
              className={cn(
                "flex max-w-[88%] flex-col gap-2 md:max-w-[75%]",
                isUser ? "items-start" : "items-end"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400",
                  isUser ? "flex-row" : "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    isUser
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-blue-500/20 bg-blue-500/10 text-blue-500"
                  )}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                </div>
                <span className="text-sm text-gray-900 dark:text-white">{msg.senderName}</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={cn(
                  "rounded-[1.75rem] px-5 py-4 text-sm font-medium leading-relaxed shadow-sm",
                  isUser
                    ? "rounded-tr-md bg-primary text-white shadow-lg shadow-primary/20"
                    : "rounded-tl-md border border-gray-100 bg-white text-gray-900 dark:border-white/5 dark:bg-[#1c1e26] dark:text-gray-100"
                )}
              >
                {msg.text}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
