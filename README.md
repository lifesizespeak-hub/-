# アクアポニックス管理

複数の水槽の水質（PH / NH3 / NO2- / NO3-）と作業記録をカレンダー形式で一括管理する個人用アプリです。

## 技術構成

- Next.js (App Router) / TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)

## 画面構成

1. 水槽一覧（`/`）— 水槽の追加・選択
2. 水槽の管理画面（`/tanks/[tankId]`）— カレンダーと記録一覧（新しい順）
3. 日別の入力画面（`/tanks/[tankId]/records/[date]`）— PH・NH3・NO2-・NO3-・水足しの有無・作業内容を入力

## セットアップ

1. Supabaseプロジェクトを作成し、SQL Editorで `supabase/migrations/0001_init.sql` を実行する。
2. `.env.local.example` を `.env.local` にコピーし、SupabaseのURLとanon keyを設定する。
3. 依存関係をインストールして起動する。

```bash
npm install
npm run dev
```

## 今後の拡張予定

- 記録データをExcel(csv/xlsx)出力し、週次レポートとして活用

## 既知の注意点

- `next@14.2.35` を使用。SSRF(rewrites)・内部Server Function露出に関する脆弱性はNext.js 16系でのみ修正されるため、`npm audit` に高深刻度の警告が残る。本アプリは自分専用・非公開スコープのため現時点では14系のまま運用し、将来公開する場合はNext.js 16へのメジャーアップグレードを検討する。
