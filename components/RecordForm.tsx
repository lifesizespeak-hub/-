import { upsertWaterRecord, deleteWaterRecord } from "@/lib/actions";
import type { WaterRecord } from "@/lib/types";

type Props = {
  tankId: string;
  date: string; // YYYY-MM-DD
  existing: WaterRecord | null;
};

export default function RecordForm({ tankId, date, existing }: Props) {
  async function save(formData: FormData) {
    "use server";

    const num = (key: string) => {
      const v = formData.get(key);
      if (v === null || v === "") return null;
      return Number(v);
    };

    await upsertWaterRecord({
      tank_id: tankId,
      record_date: date,
      ph: num("ph"),
      nh3: num("nh3"),
      no2: num("no2"),
      no3: num("no3"),
      water_added: formData.get("water_added") === "on",
      work_note: (formData.get("work_note") as string) || null,
    });
  }

  async function remove() {
    "use server";
    if (existing) {
      await deleteWaterRecord(tankId, existing.id);
    }
  }

  return (
    <form action={save} className="card space-y-4 p-6">
      <h2 className="text-lg font-medium text-water-800">{date} の記録</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-water-600">PH</span>
          <input
            name="ph"
            type="number"
            step="0.1"
            defaultValue={existing?.ph ?? ""}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NH3</span>
          <input
            name="nh3"
            type="number"
            step="0.01"
            defaultValue={existing?.nh3 ?? ""}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NO2-</span>
          <input
            name="no2"
            type="number"
            step="0.01"
            defaultValue={existing?.no2 ?? ""}
            className="input-field"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-water-600">NO3-</span>
          <input
            name="no3"
            type="number"
            step="0.01"
            defaultValue={existing?.no3 ?? ""}
            className="input-field"
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          name="water_added"
          type="checkbox"
          defaultChecked={existing?.water_added ?? false}
          className="h-4 w-4 rounded border-water-300 text-leaf-600 focus:ring-leaf-500"
        />
        <span className="text-sm text-water-600">水足しを行った</span>
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-water-600">作業内容</span>
        <textarea
          name="work_note"
          rows={3}
          defaultValue={existing?.work_note ?? ""}
          placeholder="例：水替えをおこなった。微量要素を添加した"
          className="input-field"
        />
      </label>

      <div className="flex items-center justify-between pt-2">
        <button type="submit" className="btn-primary">
          保存する
        </button>
        {existing && (
          <button formAction={remove} className="text-sm text-red-500 hover:underline">
            この記録を削除
          </button>
        )}
      </div>
    </form>
  );
}
