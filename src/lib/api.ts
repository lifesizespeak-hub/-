import { supabase } from "@/lib/supabaseClient";
import type { Tank, WaterRecord, WaterRecordInput } from "@/lib/types";

// 水槽一覧を作成日時の古い順で取得する
export async function fetchTanks(): Promise<Tank[]> {
  const { data, error } = await supabase
    .from("tanks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTank(name: string): Promise<void> {
  const { error } = await supabase.from("tanks").insert({ name });
  if (error) throw error;
}

export async function deleteTank(tankId: string): Promise<void> {
  const { error } = await supabase.from("tanks").delete().eq("id", tankId);
  if (error) throw error;
}

export async function fetchTank(tankId: string): Promise<Tank | null> {
  const { data, error } = await supabase
    .from("tanks")
    .select("*")
    .eq("id", tankId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 指定の水槽の記録を新しい順で取得する
export async function fetchWaterRecords(tankId: string): Promise<WaterRecord[]> {
  const { data, error } = await supabase
    .from("water_records")
    .select("*")
    .eq("tank_id", tankId)
    .order("record_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchWaterRecord(
  tankId: string,
  date: string
): Promise<WaterRecord | null> {
  const { data, error } = await supabase
    .from("water_records")
    .select("*")
    .eq("tank_id", tankId)
    .eq("record_date", date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 同じ水槽・同じ日付の記録があれば上書きする（カレンダー式：1日1件）
export async function upsertWaterRecord(input: WaterRecordInput): Promise<void> {
  const { error } = await supabase
    .from("water_records")
    .upsert(input, { onConflict: "tank_id,record_date" });

  if (error) throw error;
}

export async function deleteWaterRecord(recordId: string): Promise<void> {
  const { error } = await supabase.from("water_records").delete().eq("id", recordId);
  if (error) throw error;
}
