import { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TankListPage from "@/pages/TankListPage";
import TankDetailPage from "@/pages/TankDetailPage";
import RecordInputPage from "@/pages/RecordInputPage";

// xlsxライブラリを含むため、遷移時にのみ読み込む
const ExportPage = lazy(() => import("@/pages/ExportPage"));

export default function App() {
  return (
    <div className="min-h-screen font-sans text-water-900">
      <header className="border-b border-water-100 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-leaf-700">
            🐠 アクアポニックス管理
          </Link>
          <Link to="/export" className="text-sm text-water-600 hover:underline">
            Excel出力
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Suspense fallback={<p className="text-water-400">読み込み中...</p>}>
          <Routes>
            <Route path="/" element={<TankListPage />} />
            <Route path="/tanks/:tankId" element={<TankDetailPage />} />
            <Route path="/tanks/:tankId/records/:date" element={<RecordInputPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
