import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RecordCalendar from "@/components/RecordCalendar";
import RecordList from "@/components/RecordList";
import { deleteTank } from "@/lib/actions";
import type { Tank, WaterRecord } from "@/lib/types";

type Props = {
  params: { tankId: string };
  searchParams: { year?: string; month?: string };
};

export default async function TankDetailPage({ params, searchParams }: Props) {
  const supabase = createClient();

  const { data: tank } = await supabase
    .from("tanks")
    .select("*")
    .eq("id", params.tankId)
    .single();

  if (!tank) notFound();

  const { data: records } = await supabase
    .from("water_records")
    .select("*")
    .eq("tank_id", params.tankId)
    .order("record_date", { ascending: false });

  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/" className="text-sm text-water-500 hover:underline">
            ← 水槽一覧へ戻る
          </Link>
          <h1 className="text-2xl font-semibold text-water-800">{(tank as Tank).name}</h1>
        </div>
        <form action={deleteTank.bind(null, (tank as Tank).id)}>
          <button className="text-sm text-red-500 hover:underline">この水槽を削除</button>
        </form>
      </div>

      <RecordCalendar
        tankId={params.tankId}
        year={year}
        month={month}
        records={(records ?? []) as WaterRecord[]}
      />

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-water-800">記録一覧（新しい順）</h2>
        <RecordList tankId={params.tankId} records={(records ?? []) as WaterRecord[]} />
      </div>
    </div>
  );
}
