import { createTank } from "@/lib/actions";

export default function TankForm() {
  return (
    <form action={createTank} className="card flex items-center gap-3 px-5 py-4">
      <input
        name="name"
        placeholder="例：水槽１台目"
        required
        className="input-field"
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        水槽を追加
      </button>
    </form>
  );
}
