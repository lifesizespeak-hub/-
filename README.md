# アクアポニックス管理

複数の水槽の水質（PH / NH3 / NO2- / NO3- / 水温）と作業記録をカレンダー形式で一括管理する個人用アプリです。

## 技術構成

- React + Vite / TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)

## 画面構成

1. 水槽一覧（`/`）— 水槽の追加・選択
2. 水槽の管理画面（`/tanks/:tankId`）— カレンダーと記録一覧（新しい順）
3. 日別の入力画面（`/tanks/:tankId/records/:date`）— PH・NH3・NO2-・NO3-・水温・水足しの有無・作業内容を入力
4. Excel出力画面（`/export`）— 水槽・期間を選択し、罫線と色分け付きの.xlsxレポートをダウンロード

## セットアップ

1. Supabaseプロジェクトを作成し、SQL Editorで `supabase/migrations/0001_init.sql` を実行する。
2. `.env.example` を `.env` にコピーし、SupabaseのProject URLとPublishable keyを設定する（`.env` は `.gitignore` 対象）。
3. 依存関係をインストールして起動する。

```bash
npm install
npm run dev
```

## 既知の注意点

- `npm audit` で以下の脆弱性が残るが、いずれも個人利用・非公開スコープでは影響が小さいため現状維持している。
  - `react-router-dom` 6系のオープンリダイレクト等（修正はv7系のみ。破壊的変更を伴うため見送り）
  - `esbuild`（Vite開発サーバーのみに影響。本番ビルドには影響しない）
  - `exceljs` が依存する `archiver`/`uuid` 系（Node.jsのファイル書き込み処理専用のコードパスで、ブラウザでの `writeBuffer()` 実行時には使われない）
  - 将来公開する場合はメジャーアップグレードを検討する。
- `exceljs` はファイルサイズが大きいため、Excel出力画面 (`/export`) のみ遅延読み込み（コード分割）にしてトップページの表示速度に影響しないようにしている。
