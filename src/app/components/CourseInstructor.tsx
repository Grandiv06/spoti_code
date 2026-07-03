import Image from "next/image";
import Link from "next/link";

interface CourseInstructorProps {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  profileHref?: string;
}

export default function CourseInstructor({
  name = "مدرس دوره",
  title,
  bio,
  avatar = "/images/inst1.jpg",
  profileHref,
}: CourseInstructorProps) {
  const content = (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
      <div className="relative shrink-0">
        <div className="relative size-28 overflow-hidden rounded-[1.75rem] border border-gray-200/80 shadow-sm dark:border-white/10 md:size-36 md:rounded-[2rem]">
          <Image src={avatar} alt={name} width={144} height={144} className="size-full object-cover" />
        </div>
        <span className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200/80 bg-white px-3 py-1 text-[10px] font-black text-gray-600 shadow-sm dark:border-white/10 dark:bg-[#151821] dark:text-gray-300">
          <span className="material-symbols-outlined text-sm text-primary">verified</span>
          مدرس تأییدشده
        </span>
      </div>

      <div className="min-w-0 flex-1 text-center md:text-right">
        <h3 className="text-xl font-black text-gray-900 dark:text-white md:text-2xl">{name}</h3>
        {title ? (
          <p className="mt-2 text-sm font-bold text-primary md:text-base">{title}</p>
        ) : null}
        {bio ? (
          <p className="mt-4 text-sm leading-8 text-gray-600 dark:text-gray-300 md:text-[15px] text-justify md:text-right">
            {bio}
          </p>
        ) : null}
        {profileHref ? (
          <div className="mt-5 flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:group-hover:border-primary/30 dark:group-hover:bg-primary/10 dark:group-hover:text-primary">
              مشاهده پروفایل استاد
              <span className="material-symbols-outlined text-[18px] rtl:rotate-180 transition-transform group-hover:-translate-x-1">
                arrow_right_alt
              </span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <section className="glass-panel mt-2 overflow-hidden rounded-[2rem] border border-gray-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:shadow-none md:mt-4 md:rounded-4xl">
      <div className="border-b border-gray-200/80 px-5 py-5 dark:border-white/[0.06] md:px-8 md:py-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-gradient-to-br from-emerald-100 to-white text-primary shadow-sm dark:border-gray-700 dark:from-emerald-900/30 dark:to-gray-800 md:size-12 md:rounded-2xl">
            <span className="material-symbols-outlined filled text-xl md:text-2xl">person</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white md:text-2xl">مدرس دوره</h2>
            <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">
              با مدرس این دوره آشنا شوید
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="rounded-[1.5rem] border border-gray-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.02] md:rounded-[1.75rem] md:p-6">
          {profileHref ? (
            <Link href={profileHref} className="group block transition-opacity hover:opacity-95">
              {content}
            </Link>
          ) : (
            content
          )}
        </div>
      </div>
    </section>
  );
}
