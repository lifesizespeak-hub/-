import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { upsertWaterRecord, deleteWaterRecord } from "@/lib/api";
import { daysInMonth, parseDateKey, toDateKey, weekdayLabel } from "@/lib/date";
import type { WaterRecord } from "@/lib/types";

type Props = {
  tankId: string;
  date: string; // YYYY-MM-DD
  existing: WaterRecord | null;
};

const THIS_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 7 }, (_, i) => THIS_YEAR - 5 + i); // 年は現在年を基準に自動生成
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function RecordForm({ tankId, date, existing }: Props) {
  const navigate = useNavigate();
  const initialDate = parseDateKey(date);
  const [year, setYear] = useState(initialDate.year);
  const [month, setMonth] = useState(initialDate.month);
  const [day, setDay] = useState(initialDate.day);
  const [ph, setPh] = useState(existing?.ph?.toString() ?? "");
  const [nh3, setNh3] = useState(existing?.nh3?.toString() ?? "");
  const [no2, setNo2] = useState(existing?.no2?.toString() ?? "");
  const [no3, setNo3] = useState(existing?.no3?.toString() ?? "");
  const [waterTemp, setWaterTemp] = useState(existing?.water_temp?.toString() ?? "");
  const [waterAdded, setWaterAdded] = useState(existing?.water_added ?? false);
  const [workNote, setWorkNote] = useState(existing?.work_note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toNumberOrNull = (value: string) => (value === "" ? null : Number(value));

  // 月・年の変更で日数が変わる場合、選択中の日を月末に丸める
  function handleYearChange(newYear: number) {
    setYear(newYear);
    setDay((d) => Math.min(d, daysInMonth(newYear, month)));
  }
  function handleMonthChange(newMonth: number) {
    setMonth(newMonth);
    setDay((d) => Math.min(d, daysInMonth(year, newMonth)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await upsertWaterRecord({
        tank_id: tankId,
        record_date: toDateKey(year, month, day),
        ph: toNumberOrNull(ph),
        nh3: toNumberOrNull(nh3),
        no2: toNumberOrNull(no2),
        no3: toNumberOrNull(no3),
        water_temp: toNumberOrNull(waterTemp),
        water_added: waterAdded,
        work_note: workNote || null,
      });
      navigate(`/tanks/${tankId}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await deleteWaterRecord(existing.id);
      navigate(`/tanks/${tankId}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "削除に失敗しました");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div className="space-y-1">
        <span className="text-sm text-water-600">記録日</span>
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
            onChange={(e) => setDay(Number(e.target.value))}
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-water-600">PH</span>
          <input
            type="number"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NH3</span>
          <input
            type="number"
            step="0.01"
            value={nh3}
            onChange={(e) => setNh3(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NO2-</span>
          <input
            type="number"
            step="0.01"
            value={no2}
            onChange={(e) => setNo2(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NO3-</span>
          <input
            type="number"
            step="0.01"
            value={no3}
            onChange={(e) => setNo3(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">水温（℃）</span>
          <input
            type="number"
            step="0.1"
            value={waterTemp}
            onChange={(e) => setWaterTemp(e.target.value)}
            className="input-field"
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={waterAdded}
          onChange={(e) => setWaterAdded(e.target.checked)}
          className="h-4 w-4 rounded border-water-300 text-leaf-600 focus:ring-leaf-500"
        />
        <span className="text-sm text-water-600">水足しを行った</span>
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-water-600">作業内容</span>
        <textarea
          value={workNote}
          onChange={(e) => setWorkNote(e.target.value)}
          rows={3}
          placeholder="例：水替えをおこなった。微量要素を添加した"
          className="input-field"
        />
      </label>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <div className="flex items-center justify-between pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "保存中..." : "保存する"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="text-sm text-red-500 hover:underline"
          >
            この記録を削除
          </button>
        )}
      </div>
    </form>
  );
}
