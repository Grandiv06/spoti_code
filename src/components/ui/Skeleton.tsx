"use client";

type SkeletonBoxProps = {
  className?: string;
  rounded?: string;
};

export function SkeletonBox({ className = "", rounded = "rounded-2xl" }: SkeletonBoxProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.06)] ${rounded} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function SkeletonLine({ className = "", rounded = "rounded-full" }: SkeletonBoxProps) {
  return <SkeletonBox className={className} rounded={rounded} />;
}
