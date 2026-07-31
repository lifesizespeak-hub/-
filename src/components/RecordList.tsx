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
    <ul className="space-y-3">
      {sorted.map((r) => (
        <li key={r.id}>
          <Link
            to={`/tanks/${tankId}/records/${r.record_date}`}
            className="card block space-y-2 px-5 py-4 transition hover:ring-leaf-300"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-water-800">{r.record_date}</span>
              {r.water_added && (
                <span className="rounded-full bg-water-100 px-3 py-1 text-xs text-water-700">
                  水足しあり
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <WaterQualityBadge label="PH" value={r.ph} />
              <WaterQualityBadge label="NH3" value={r.nh3} />
              <WaterQualityBadge label="NO2-" value={r.no2} />
              <WaterQualityBadge label="NO3-" value={r.no3} />
              <WaterQualityBadge label="水温℃" value={r.water_temp} plain />
            </div>
            {r.work_note && <p className="text-sm text-water-600">{r.work_note}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
