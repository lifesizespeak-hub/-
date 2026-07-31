import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RecordForm from "@/components/RecordForm";
import type { WaterRecord } from "@/lib/types";

type Props = {
  params: { tankId: string; date: string };
};

export default async function RecordInputPage({ params }: Props) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("water_records")
    .select("*")
    .eq("tank_id", params.tankId)
    .eq("record_date", params.date)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <Link href={`/tanks/${params.tankId}`} className="text-sm text-water-500 hover:underline">
        ← 水槽の管理画面へ戻る
      </Link>

      <RecordForm
        tankId={params.tankId}
        date={params.date}
        existing={(existing as WaterRecord) ?? null}
      />
    </div>
  );
}
