import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTanksOverview, fetchWaterRecords } from "@/lib/api";
import { formatDateJa, parseDateKey, startOfMonthDateKey, todayDateKey, toDateKey } from "@/lib/date";
import { exportToExcel, type ExportTankData } from "@/lib/export";
import DateSelect from "@/components/DateSelect";
import type { TankOverview } from "@/lib/types";

export default function ExportPage() {
  const [tanks, setTanks] = useState<TankOverview[]>([]);
  const [selectedTankIds, setSelectedTankIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const start = parseDateKey(startOfMonthDateKey());
  const end = parseDateKey(todayDateKey());
  const [startYear, setStartYear] = useState(start.year);
  const [startMonth, setStartMonth] = useState(start.month);
  const [startDay, setStartDay] = useState(start.day);
  const [endYear, setEndYear] = useState(end.year);
  const [endMonth, setEndMonth] = useState(end.month);
  const [endDay, setEndDay] = useState(end.day);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchTanksOverview();
        setTanks(data);
        setSelectedTankIds(new Set(data.map((t) => t.id)));
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "水槽一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function toggleTank(tankId: string) {
    setSelectedTankIds((prev) => {
      const next = new Set(prev);
      if (next.has(tankId)) {
        next.delete(tankId);
      } else {
        next.add(tankId);
      }
      return next;
    });
  }

  function toggleAll() {
    setSelectedTankIds((prev) =>
      prev.size === tanks.length ? new Set() : new Set(tanks.map((t) => t.id))
    );
  }

  async function handleExport() {
    const selectedTanks = tanks.filter((t) => selectedTankIds.has(t.id));
    if (selectedTanks.length === 0) {
      setErrorMessage("出力する水槽を1つ以上選択してください");
      return;
    }

    const startKey = toDateKey(startYear, startMonth, startDay);
    const endKey = toDateKey(endYear, endMonth, endDay);
    if (startKey > endKey) {
      setErrorMessage("開始日は終了日より前の日付にしてください");
      return;
    }

    setExporting(true);
    setErrorMessage(null);
    try {
      const data: ExportTankData[] = await Promise.all(
        selectedTanks.map(async (tank) => {
          const allRecords = await fetchWaterRecords(tank.id); // 新しい順で取得済み
          const periodRecords = allRecords.filter(
            (r) => r.record_date >= startKey && r.record_date <= endKey
          );
          return { tank, latestRecord: tank.latestRecord, periodRecords };
        })
      );
      await exportToExcel(data, `${formatDateJa(startKey)}〜${formatDateJa(endKey)}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Excel出力に失敗しました");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link to="/" className="text-sm text-water-500 hover:underline">
          ← 水槽一覧へ戻る
        </Link>
        <h1 className="text-2xl font-semibold text-water-800">Excel出力</h1>
      </div>

      {loading && <p className="text-water-400">読み込み中...</p>}

      {!loading && (
        <div className="card space-y-6 p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-water-600">出力する水槽</span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-sm text-water-500 hover:underline"
              >
                全て選択／解除
              </button>
            </div>
            <div className="space-y-1">
              {tanks.map((tank) => (
                <label key={tank.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTankIds.has(tank.id)}
                    onChange={() => toggleTank(tank.id)}
                    className="h-4 w-4 rounded border-water-300 text-leaf-600 focus:ring-leaf-500"
                  />
                  <span className="text-water-800">{tank.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-water-600">開始日</span>
            <DateSelect
              year={startYear}
              month={startMonth}
              day={startDay}
              onChange={(y, m, d) => {
                setStartYear(y);
                setStartMonth(m);
                setStartDay(d);
              }}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm text-water-600">終了日</span>
            <DateSelect
              year={endYear}
              month={endMonth}
              day={endDay}
              onChange={(y, m, d) => {
                setEndYear(y);
                setEndMonth(m);
                setEndDay(d);
              }}
            />
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary"
          >
            {exporting ? "出力中..." : "Excelをダウンロード"}
          </button>
        </div>
      )}
    </div>
  );
}
