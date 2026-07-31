import { useState, type FormEvent } from "react";
import { createTank } from "@/lib/api";

export default function TankForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await createTank(trimmed);
      setName("");
      onCreated();
    } catch (err) {
      // Supabaseへの接続失敗時などにエラー内容を画面に表示する
      setErrorMessage(err instanceof Error ? err.message : "水槽の追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card flex items-center gap-3 px-5 py-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例：水槽１台目"
        required
        className="input-field"
      />
      <button type="submit" disabled={submitting} className="btn-primary whitespace-nowrap">
        {submitting ? "追加中..." : "水槽を追加"}
      </button>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </form>
  );
}
