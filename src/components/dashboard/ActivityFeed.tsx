"use client";

import { History, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityFeedProps = {
  events: Array<{ id: string; title: string; subtitle: string; time: string }>;
};

export default function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-black">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5 dark:border-neutral-900">
        <History size={18} className="text-blue-600" />
        <h3 className="text-base font-bold text-black dark:text-white">
          Recent Activity
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900">
              <History
                className="text-gray-300 dark:text-neutral-700"
                size={24}
              />
            </div>
            <p className="text-sm font-medium text-slate-500">
              No recent activity available.
            </p>
          </div>
        ) : (
          <div className="relative space-y-6 before:absolute before:left-1.75 before:top-2 before:h-[calc(100%-12px)] before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-800">
            {events.map((event) => (
              <div key={event.id} className="relative pl-7 group">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 z-10 flex h-4 w-4 items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 ring-4 ring-blue-50 dark:border-black dark:ring-blue-900/20 transition-transform group-hover:scale-125" />
                </div>

                {/* Event Text */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold leading-tight text-slate-900 dark:text-neutral-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {event.title}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-neutral-400">
                    {event.subtitle}
                  </p>
                  <time className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-600">
                    {event.time}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="border-t border-gray-50 p-4 text-center dark:border-neutral-900">
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          View Full Audit Log
        </button>
      </div>
    </div>
  );
}
