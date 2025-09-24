# GokiCare

React + Tailwind CSS で作られたミニアプリです。Vite を使ってビルドし、GitHub Pages へデプロイできるように GitHub Actions のワークフローも用意しています。

## 開発環境の使い方

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます。

## デプロイ（GitHub Actions）

`main` ブランチへ push すると `.github/workflows/deploy.yml` が走り、ビルド成果物が GitHub Pages に自動公開されます。手動実行したい場合は GitHub の Actions タブから `Run workflow` を選択してください。
