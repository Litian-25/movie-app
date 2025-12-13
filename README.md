# Movie App

映画を検索してお気に入りに追加できるReactアプリです。

## デモ

https://movie-app-pied-seven.vercel.app

## 機能

- １．映画検索（OMDB APIを使用）
- ２．お気に入り追加
- ３．お気に入り削除

## 技術スタック

- React 18
- Vite
- OMDB API
- Vercel（ホスティング）

## プロジェクト構成
```
src/
├── App.jsx           # メインコンポーネント
├── index.css         # スタイル
└── components/
    ├── MovieCard.jsx # 映画カード
    └── MovieList.jsx # 映画リスト
```


## 学んだこと

- useState によるstate管理
- コンポーネント分割と props
- 外部APIとの連携（async/await）
- 配列操作（map, filter, find）