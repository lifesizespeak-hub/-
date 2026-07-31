import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteTank, fetchTank, fetchWaterRecords } from "@/lib/api";
import RecordCalendar from "@/components/RecordCalendar";
import RecordList from "@/components/RecordList";
import type { Tank, WaterRecord } from "@/lib/types";

export default function TankDetailPage() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tank, setTank] = useState<Tank | null>(null);
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const now = new Date();
  const year = Number(searchParams.get("year")) || now.getFullYear();
  const month = Number(searchParams.get("month")) || now.getMonth() + 1;

  const load = useCallback(async () => {
    if (!tankId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const [tankData, recordsData] = await Promise.all([
        fetchTank(tankId),
        fetchWaterRecords(tankId),
      ]);
      setTank(tankData);
      setRecords(recordsData);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [tankId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeleteTank() {
    if (!tankId) return;
    await deleteTank(tankId);
    navigate("/");
  }

  if (!tankId) return null;
  if (loading) return <p className="text-water-400">読み込み中...</p>;
  if (errorMessage) return <p className="text-sm text-red-500">{errorMessage}</p>;
  if (!tank) return <p className="text-water-400">水槽が見つかりません。</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/" className="text-sm text-water-500 hover:underline">
            ← 水槽一覧へ戻る
          </Link>
          <h1 className="text-2xl font-semibold text-water-800">{tank.name}</h1>
        </div>
        <button onClick={handleDeleteTank} className="text-sm text-red-500 hover:underline">
          この水槽を削除
        </button>
      </div>

      <RecordCalendar
        tankId={tankId}
        year={year}
        month={month}
        records={records}
        onChangeMonth={(y, m) => setSearchParams({ year: String(y), month: String(m) })}
      />

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-water-800">記録一覧（新しい順）</h2>
        <RecordList tankId={tankId} records={records} />
      </div>
    </div>
  );
}
