import Link from "next/link";
import type { WaterRecord } from "@/lib/types";

type Props = {
  tankId: string;
  year: number;
  month: number; // 1-12
  records: WaterRecord[];
};

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function RecordCalendar({ tankId, year, month, records }: Props) {
  const recordedDates = new Set(records.map((r) => r.record_date));

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay(); // 0=日
  const today = toDateKey(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/tanks/${tankId}?year=${prevMonth.year}&month=${prevMonth.month}`}
          className="btn-secondary px-3 py-1 text-sm"
        >
          ← 前月
        </Link>
        <span className="font-medium text-water-800">
          {year}年 {month}月
        </span>
        <Link
          href={`/tanks/${tankId}?year=${nextMonth.year}&month=${nextMonth.month}`}
          className="btn-secondary px-3 py-1 text-sm"
        >
          次月 →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm text-water-500">
        {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;

          const dateKey = toDateKey(year, month, day);
          const hasRecord = recordedDates.has(dateKey);
          const isToday = dateKey === today;

          return (
            <Link
              key={dateKey}
              href={`/tanks/${tankId}/records/${dateKey}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition hover:bg-leaf-50 ${
                isToday ? "ring-1 ring-leaf-400" : ""
              }`}
            >
              <span className="text-water-800">{day}</span>
              {hasRecord && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-leaf-500" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
