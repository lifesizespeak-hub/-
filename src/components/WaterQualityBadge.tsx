type Props = {
  label: string;
  value: number | null;
  unit?: string; // 数値の直後に付ける単位（例: "ppm", "℃"）。ラベルと数値の間の区切り記号(：)と分けて表示することで、NO2-のような末尾が"-"の記号でも読み違えないようにする
  plain?: boolean; // trueの場合は危険域の色分けを行わず数値のみ表示する（水温など安全域が種によって異なる項目向け）
  small?: boolean; // trueの場合はカードグリッドなど省スペース箇所向けの小型表示にする
};

// 理想値・安全値・危険値の3段階で色分けする
function toneFor(label: string, value: number): "ideal" | "safe" | "danger" {
  if (label === "PH") {
    if (value >= 6.8 && value <= 7.0) return "ideal";
    if (value >= 6.0 && value <= 7.5) return "safe";
    return "danger";
  }
  if (label === "NH3" || label === "NO2-") {
    if (value === 0) return "ideal";
    if (value <= 0.5) return "safe";
    return "danger";
  }
  // NO3-（低すぎる場合も高すぎる場合も危険とする）
  if (value >= 80 && value <= 120) return "ideal";
  if (value >= 60 && value < 80) return "safe";
  return "danger";
}

const toneClass: Record<string, string> = {
  ideal: "bg-water-800 text-white",
  safe: "bg-leaf-100 text-leaf-800",
  danger: "bg-red-100 text-red-800",
};

export default function WaterQualityBadge({
  label,
  value,
  unit = "",
  plain = false,
  small = false,
}: Props) {
  const sizeClass = small ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  if (value === null) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-water-50 text-water-400 ${sizeClass}`}>
        {label}：—
      </span>
    );
  }

  const toneClassName = plain ? "bg-water-100 text-water-700" : toneClass[toneFor(label, value)];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClass} ${toneClassName}`}>
      {label}：{value}
      {unit}
    </span>
  );
}
