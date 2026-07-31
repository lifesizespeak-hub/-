type Props = {
  label: string;
  value: number | null;
  plain?: boolean; // trueの場合は危険域の色分けを行わず数値のみ表示する（水温など安全域が種によって異なる項目向け）
};

// アンモニア・亜硝酸は数値が高いほど危険域として色分けする簡易目安
function toneFor(label: string, value: number): "safe" | "warn" | "danger" {
  if (label === "PH") {
    if (value < 5.5 || value > 7.5) return "danger";
    if (value < 6.0 || value > 7.0) return "warn";
    return "safe";
  }
  if (label === "NH3" || label === "NO2-") {
    if (value >= 1.0) return "danger";
    if (value >= 0.25) return "warn";
    return "safe";
  }
  // NO3-
  if (value >= 80) return "danger";
  if (value >= 40) return "warn";
  return "safe";
}

const toneClass: Record<string, string> = {
  safe: "bg-leaf-100 text-leaf-800",
  warn: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

export default function WaterQualityBadge({ label, value, plain = false }: Props) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-water-50 px-3 py-1 text-sm text-water-400">
        {label} —
      </span>
    );
  }

  const className = plain ? "bg-water-100 text-water-700" : toneClass[toneFor(label, value)];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${className}`}>
      {label} {value}
    </span>
  );
}
