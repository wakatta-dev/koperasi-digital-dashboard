/** @format */

type TimelineItem = {
  status: string;
  description: string;
  time: string;
  active?: boolean;
  done?: boolean;
};

type StatusTimelineProps = {
  items: TimelineItem[];
};

export function StatusTimeline({ items }: StatusTimelineProps) {
  const palette = {
    active: "bg-indigo-600 border-indigo-600 shadow-[0_0_0_3px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_3px_rgba(99,102,241,0.35)]",
    done: "bg-emerald-500 border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] dark:shadow-[0_0_0_3px_rgba(16,185,129,0.35)]",
    idle: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600",
  };

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Linimasa Status</h3>
      <div className="space-y-5 relative">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const tone = item.done ? palette.done : item.active ? palette.active : palette.idle;
          return (
            <div key={item.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all ${tone}`}
                />
                {!isLast ? (
                  <div className="flex-1 w-px bg-gradient-to-b from-indigo-100 via-slate-200 to-transparent dark:from-indigo-900/40 dark:via-slate-700 dark:to-transparent mt-1" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {item.status}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-medium tracking-tight">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
