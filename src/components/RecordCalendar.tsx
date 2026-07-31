import { Link } from "react-router-dom";
import type { WaterRecord } from "@/lib/types";
import { WEEKDAY_LABELS, daysInMonth as getDaysInMonth, toDateKey, todayDateKey } from "@/lib/date";

type Props = {
  tankId: string;
  year: number;
  month: number; // 1-12
  records: WaterRecord[];
  onChangeMonth: (year: number, month: number) => void;
};

export default function RecordCalendar({ tankId, year, month, records, onChangeMonth }: Props) {
  const recordedDates = new Set(records.map((r) => r.record_date));

  const firstDay = new Date(year, month - 1, 1);
  const startWeekday = firstDay.getDay(); // 0=日
  const today = todayDateKey();

  const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1),
  ];

  return (
    <div className="card p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => onChangeMonth(prevMonth.year, prevMonth.month)}
          className="btn-secondary px-2 py-0.5 text-xs"
        >
          ←
        </button>
        <span className="text-sm font-medium text-water-800">
          {year}年{month}月
        </span>
        <button
          onClick={() => onChangeMonth(nextMonth.year, nextMonth.month)}
          className="btn-secondary px-2 py-0.5 text-xs"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-water-500">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-0.5">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;

          const dateKey = toDateKey(year, month, day);
          const hasRecord = recordedDates.has(dateKey);
          const isToday = dateKey === today;

          return (
            <Link
              key={dateKey}
              to={`/tanks/${tankId}/records/${dateKey}`}
              className={`flex aspect-square items-center justify-center rounded text-[11px] transition ${
                hasRecord
                  ? "bg-water-500 text-white hover:bg-water-600"
                  : "text-water-800 hover:bg-leaf-50"
              } ${isToday ? "ring-1 ring-leaf-400" : ""}`}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
