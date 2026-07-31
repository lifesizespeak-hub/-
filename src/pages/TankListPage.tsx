import { useCallback, useEffect, useState } from "react";
import { fetchTanks } from "@/lib/api";
import TankCard from "@/components/TankCard";
import TankForm from "@/components/TankForm";
import type { Tank } from "@/lib/types";

export default function TankListPage() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTanks = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      setTanks(await fetchTanks());
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "水槽一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTanks();
  }, [loadTanks]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-water-800">水槽一覧</h1>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      {loading && <p className="text-water-400">読み込み中...</p>}

      <div className="space-y-3">
        {tanks.map((tank) => (
          <TankCard key={tank.id} tank={tank} />
        ))}
      </div>

      <TankForm onCreated={loadTanks} />
    </div>
  );
}
