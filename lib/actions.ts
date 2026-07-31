"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WaterRecordInput } from "@/lib/types";

export async function createTank(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = createClient();
  await supabase.from("tanks").insert({ name });

  revalidatePath("/");
  redirect("/");
}

export async function deleteTank(tankId: string) {
  const supabase = createClient();
  await supabase.from("tanks").delete().eq("id", tankId);

  revalidatePath("/");
  redirect("/");
}

export async function upsertWaterRecord(input: WaterRecordInput) {
  const supabase = createClient();

  await supabase
    .from("water_records")
    .upsert(input, { onConflict: "tank_id,record_date" });

  revalidatePath(`/tanks/${input.tank_id}`);
  redirect(`/tanks/${input.tank_id}`);
}

export async function deleteWaterRecord(tankId: string, recordId: string) {
  const supabase = createClient();
  await supabase.from("water_records").delete().eq("id", recordId);

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}
