import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "アクアポニックス管理",
  description: "水槽の水質・作業記録を一括管理",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans text-water-900">
        <header className="border-b border-water-100 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <a href="/" className="text-lg font-semibold text-leaf-700">
              🌿 アクアポニックス管理
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
