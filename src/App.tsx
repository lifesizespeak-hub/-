import { Routes, Route, Link } from "react-router-dom";
import TankListPage from "@/pages/TankListPage";
import TankDetailPage from "@/pages/TankDetailPage";
import RecordInputPage from "@/pages/RecordInputPage";

export default function App() {
  return (
    <div className="min-h-screen font-sans text-water-900">
      <header className="border-b border-water-100 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-leaf-700">
            🌿 アクアポニックス管理
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Routes>
          <Route path="/" element={<TankListPage />} />
          <Route path="/tanks/:tankId" element={<TankDetailPage />} />
          <Route path="/tanks/:tankId/records/:date" element={<RecordInputPage />} />
        </Routes>
      </main>
    </div>
  );
}
