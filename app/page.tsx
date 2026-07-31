import { createClient } from "@/lib/supabase/server";
import TankCard from "@/components/TankCard";
import TankForm from "@/components/TankForm";
import type { Tank } from "@/lib/types";

export default async function TankListPage() {
  const supabase = createClient();
  const { data: tanks } = await supabase
    .from("tanks")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-water-800">水槽一覧</h1>

      <div className="space-y-3">
        {((tanks ?? []) as Tank[]).map((tank) => (
          <TankCard key={tank.id} tank={tank} />
        ))}
      </div>

      <TankForm />
    </div>
  );
}
