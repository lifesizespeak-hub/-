import { Link } from "react-router-dom";
import type { TankOverview } from "@/lib/types";
import WaterQualityBadge from "@/components/WaterQualityBadge";

export default function TankCard({ tank }: { tank: TankOverview }) {
  const record = tank.latestRecord;

  return (
    <Link
      to={`/tanks/${tank.id}`}
      className="card flex flex-col gap-2 p-3 transition hover:ring-leaf-300"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-water-800">{tank.name}</p>
        {record && <span className="shrink-0 text-xs text-water-400">{record.record_date}</span>}
      </div>

      {record ? (
        <>
          <div className="flex flex-wrap gap-1">
            <WaterQualityBadge label="PH" value={record.ph} />
            <WaterQualityBadge label="NH3" value={record.nh3} unit=" ppm" />
            <WaterQualityBadge label="NO2-" value={record.no2} unit=" ppm" />
            <WaterQualityBadge label="NO3-" value={record.no3} unit=" ppm" />
            <WaterQualityBadge label="水温" value={record.water_temp} unit="℃" plain />
          </div>
          {record.work_note && (
            <p className="line-clamp-2 text-xs text-water-600">{record.work_note}</p>
          )}
        </>
      ) : (
        <p className="text-sm text-water-400">まだ記録がありません</p>
      )}
    </Link>
  );
}
