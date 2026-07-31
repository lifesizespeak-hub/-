import { Link } from "react-router-dom";
import type { Tank } from "@/lib/types";

export default function TankCard({ tank }: { tank: Tank }) {
  return (
    <Link
      to={`/tanks/${tank.id}`}
      className="card flex items-center justify-between px-5 py-4 transition hover:ring-leaf-300"
    >
      <span className="text-lg font-medium text-water-800">{tank.name}</span>
      <span className="text-water-400">→</span>
    </Link>
  );
}
