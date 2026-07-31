import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteTank, fetchTank, fetchWaterRecords, updateTankName } from "@/lib/api";
import { todayDateKey } from "@/lib/date";
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

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

  function startEditingName() {
    if (!tank) return;
    setEditedName(tank.name);
    setNameError(null);
    setIsEditingName(true);
  }

  async function handleSaveName() {
    if (!tankId) return;
    const trimmed = editedName.trim();
    if (!trimmed) return;

    setSavingName(true);
    setNameError(null);
    try {
      await updateTankName(tankId, trimmed);
      setTank((t) => (t ? { ...t, name: trimmed } : t));
      setIsEditingName(false);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "水槽名の更新に失敗しました");
    } finally {
      setSavingName(false);
    }
  }

  if (!tankId) return null;
  if (loading) return <p className="text-water-400">読み込み中...</p>;
  if (errorMessage) return <p className="text-sm text-red-500">{errorMessage}</p>;
  if (!tank) return <p className="text-water-400">水槽が見つかりません。</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Link to="/" className="text-sm text-water-500 hover:underline">
              ← 水槽一覧へ戻る
            </Link>

            {isEditingName ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="input-field w-auto"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="btn-primary px-3 py-1 text-sm"
                  >
                    {savingName ? "保存中..." : "保存"}
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-sm text-water-500 hover:underline"
                  >
                    キャンセル
                  </button>
                </div>
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-water-800">{tank.name}</h1>
                <button
                  onClick={startEditingName}
                  className="text-sm text-water-500 hover:underline"
                >
                  ✎ 名前を変更
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link to={`/tanks/${tankId}/records/${todayDateKey()}`} className="btn-primary">
              ＋ 作業登録
            </Link>
            <button onClick={handleDeleteTank} className="text-sm text-red-500 hover:underline">
              この水槽を削除
            </button>
          </div>
        </div>

        <div className="w-56 shrink-0">
          <RecordCalendar
            tankId={tankId}
            year={year}
            month={month}
            records={records}
            onChangeMonth={(y, m) => setSearchParams({ year: String(y), month: String(m) })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-water-800">更新履歴（新しい順）</h2>
        <RecordList tankId={tankId} records={records} />
      </div>
    </div>
  );
}
