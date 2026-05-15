"use client";

import React from "react";
import { User, Headphones } from "lucide-react";
import { Message } from "../../data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ConversationThread({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-8">
      {messages.map((msg, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={msg.id}
          className={cn(
            "flex flex-col max-w-[90%] md:max-w-[80%]",
            msg.sender === "user" ? "mr-auto items-end" : "ml-auto items-start"
          )}
        >
          <div className={cn(
            "flex items-center gap-3 mb-2",
            msg.sender === "user" ? "flex-row" : "flex-row-reverse"
          )}>
            <span className="text-xs font-black text-gray-500 dark:text-gray-400">
              {msg.timestamp}
            </span>
            <span className="text-sm font-black text-gray-900 dark:text-white">
              {msg.senderName}
            </span>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2",
              msg.sender === "user" 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-blue-500/10 border-blue-500/20 text-blue-500"
            )}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
            </div>
          </div>

          <div className={cn(
            "p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
            msg.sender === "user"
              ? "bg-white dark:bg-[#1c1e26] text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-white/5 rounded-tr-none"
              : "bg-primary text-white shadow-lg shadow-primary/20 rounded-tl-none"
          )}>
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
