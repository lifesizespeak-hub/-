import { daysInMonth, weekdayLabel } from "@/lib/date";

const THIS_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => THIS_YEAR - 5 + i); // 年は現在年を基準に自動生成
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

type Props = {
  year: number;
  month: number;
  day: number;
  onChange: (year: number, month: number, day: number) => void;
};

export default function DateSelect({ year, month, day, onChange }: Props) {
  // 月・年の変更で日数が変わる場合、選択中の日を月末に丸める
  function handleYearChange(newYear: number) {
    onChange(newYear, month, Math.min(day, daysInMonth(newYear, month)));
  }
  function handleMonthChange(newMonth: number) {
    onChange(year, newMonth, Math.min(day, daysInMonth(year, newMonth)));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={year}
        onChange={(e) => handleYearChange(Number(e.target.value))}
        className="input-field w-auto"
      >
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}年
          </option>
        ))}
      </select>
      <select
        value={month}
        onChange={(e) => handleMonthChange(Number(e.target.value))}
        className="input-field w-auto"
      >
        {MONTH_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {m}月
          </option>
        ))}
      </select>
      <select
        value={day}
        onChange={(e) => onChange(year, month, Number(e.target.value))}
        className="input-field w-auto"
      >
        {Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            {d}日
          </option>
        ))}
      </select>
      <span className="text-water-500">（{weekdayLabel(year, month, day)}曜日）</span>
    </div>
  );
}
