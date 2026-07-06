import React from "react";
import { Sparkles, Shield, User as UserIcon } from "lucide-react";
import {
  ApplicationMainRoles,
  getApplicationMainRoleLabel,
  type ApplicationMainRole,
} from "@/lib/application-roles";

interface StatusBadgeProps {
  status: "فعال" | "غیرفعال" | string;
}

export function UserStatusBadge({ status }: StatusBadgeProps) {
  let classes = "";
  let dotClass = "";

  switch (status) {
    case "فعال":
      classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      dotClass = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
      break;
    case "غیرفعال":
      classes = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      dotClass = "bg-zinc-400";
      break;
    default:
      classes = "bg-gray-500/10 text-gray-400 border-gray-500/20";
      dotClass = "bg-gray-400";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span>{status}</span>
    </span>
  );
}

interface PlanBadgeProps {
  plan: "Starter" | "Pro" | "Enterprise" | string;
}

export function UserPlanBadge({ plan }: PlanBadgeProps) {
  switch (plan) {
    case "Starter":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400">
          <span>Starter</span>
        </span>
      );
    case "Pro":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Pro</span>
        </span>
      );
    case "Enterprise":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.08)]">
          <Shield className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Enterprise</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
          <span>{plan}</span>
        </span>
      );
  }
}

interface RoleBadgeProps {
  role: ApplicationMainRole | string;
}

export function UserRoleBadge({ role }: RoleBadgeProps) {
  const label = getApplicationMainRoleLabel(role);

  switch (role) {
    case ApplicationMainRoles.SUPER_ADMIN:
    case ApplicationMainRoles.ADMIN:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md border border-red-500/20 bg-red-500/5 text-red-400">
          <span>{label}</span>
        </span>
      );
    case ApplicationMainRoles.INSTRUCTOR:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md border border-violet-500/20 bg-violet-500/5 text-violet-400">
          <span>{label}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400">
          <UserIcon className="w-3 h-3" />
          <span>{label}</span>
        </span>
      );
  }
}
