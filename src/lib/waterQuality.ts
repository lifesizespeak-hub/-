export type Tone = "ideal" | "safe" | "danger";

// 理想値・安全値・危険値の3段階で色分けする
export function toneFor(label: string, value: number): Tone {
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
