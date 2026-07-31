import { Link } from "react-router-dom";
import type { WaterRecord } from "@/lib/types";
import WaterQualityBadge from "@/components/WaterQualityBadge";

export default function RecordList({
  tankId,
  records,
}: {
  tankId: string;
  records: WaterRecord[];
}) {
  // 新しい順に表示する
  const sorted = [...records].sort((a, b) => (a.record_date < b.record_date ? 1 : -1));

  if (sorted.length === 0) {
    return <p className="py-8 text-center text-water-400">まだ記録がありません。</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {sorted.map((r) => (
        <Link
          key={r.id}
          to={`/tanks/${tankId}/records/${r.record_date}`}
          className="card flex aspect-square flex-col justify-between p-4 transition hover:ring-leaf-300"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-water-800">{r.record_date}</span>
              {r.water_added && (
                <span className="rounded-full bg-water-100 px-2 py-0.5 text-xs text-water-700">
                  水足し
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              <WaterQualityBadge label="PH" value={r.ph} small />
              <WaterQualityBadge label="NH3" value={r.nh3} unit=" ppm" small />
              <WaterQualityBadge label="NO2-" value={r.no2} unit=" ppm" small />
              <WaterQualityBadge label="NO3-" value={r.no3} unit=" ppm" small />
              <WaterQualityBadge label="水温" value={r.water_temp} unit="℃" plain small />
            </div>
          </div>

          <div className="flex items-end justify-between gap-2">
            {r.work_note ? (
              <p className="line-clamp-2 text-xs text-water-600">{r.work_note}</p>
            ) : (
              <span />
            )}
            <span className="btn-secondary shrink-0 px-2 py-0.5 text-xs">✎ 訂正</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
