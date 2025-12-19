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
  return (
    <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Linimasa Status</h3>
      <div className="space-y-4 relative">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div key={item.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    item.done
                      ? "bg-green-500 border-green-500"
                      : item.active
                      ? "bg-indigo-500 border-indigo-500"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                />
                {!isLast ? (
                  <div className="flex-1 w-px bg-gray-200 dark:bg-gray-700 mt-1" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {item.status}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
