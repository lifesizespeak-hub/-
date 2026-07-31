import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchWaterRecord } from "@/lib/api";
import RecordForm from "@/components/RecordForm";
import type { WaterRecord } from "@/lib/types";

export default function RecordInputPage() {
  const { tankId, date } = useParams<{ tankId: string; date: string }>();
  const [existing, setExisting] = useState<WaterRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tankId || !date) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      setExisting(await fetchWaterRecord(tankId, date));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "記録の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [tankId, date]);

  useEffect(() => {
    load();
  }, [load]);

  if (!tankId || !date) return null;

  return (
    <div className="space-y-6">
      <Link to={`/tanks/${tankId}`} className="text-sm text-water-500 hover:underline">
        ← 水槽の管理画面へ戻る
      </Link>

      {loading && <p className="text-water-400">読み込み中...</p>}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      {!loading && !errorMessage && (
        <RecordForm tankId={tankId} date={date} existing={existing} />
      )}
    </div>
  );
}
