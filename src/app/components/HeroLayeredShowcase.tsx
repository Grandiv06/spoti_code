import Image from "next/image";

export default function HeroLayeredShowcase() {
  return (
    <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto select-none">
      {/* Ambient Neon Glows behind the showcase */}
      <div className="pointer-events-none absolute -top-10 -left-10 size-72 sm:size-96 rounded-full bg-emerald-500/20 dark:bg-emerald-500/25 blur-3xl -z-10 animate-pulse duration-1000" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-72 sm:size-96 rounded-full bg-cyan-500/15 dark:bg-sky-500/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-primary/10 blur-2xl -z-10" />

      {/* Main Clean Showcase Frame */}
      <div className="relative rounded-3xl sm:rounded-4xl border border-gray-200/80 dark:border-white/10 bg-[#070b13] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9),0_0_80px_-20px_rgba(34,197,94,0.3)] overflow-hidden group/showcase transition-all duration-500 hover:shadow-[0_30px_90px_-20px_rgba(34,197,94,0.35)]">
        {/* Aspect Ratio Box with Cinematic Image */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] overflow-hidden bg-black flex items-center justify-center">
          <Image
            src="/images/spoticode_hero_male.jpg"
            alt="برنامه‌نویسی و یادگیری اسپاتی‌کد"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/showcase:scale-105"
          />

          {/* Subtle cinematic gradient overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b13]/60 via-transparent to-[#070b13]/20" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl sm:rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
