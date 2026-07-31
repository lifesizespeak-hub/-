// 水槽マスタ
export type Tank = {
  id: string;
  name: string;
  created_at: string;
};

// 日々の水質・作業記録（1水槽×1日＝1レコード）
export type WaterRecord = {
  id: string;
  tank_id: string;
  record_date: string; // YYYY-MM-DD
  ph: number | null;
  nh3: number | null;
  no2: number | null;
  no3: number | null;
  water_temp: number | null;
  water_added: boolean;
  work_note: string | null;
  created_at: string;
  updated_at: string;
};

export type WaterRecordInput = {
  tank_id: string;
  record_date: string;
  ph: number | null;
  nh3: number | null;
  no2: number | null;
  no3: number | null;
  water_temp: number | null;
  water_added: boolean;
  work_note: string | null;
};
