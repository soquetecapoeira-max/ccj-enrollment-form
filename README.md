# CCJ.CAPOEIRA OSAKA 入会申し込みフォーム

カポエイラ教室（CCJ.CAPOEIRA OSAKA）の入会申し込みWebフォームです。

## 機能

- コース選択（ビギナー / アドバンス / プロ / キッズ / ドロップイン）
- コースに応じた支払い方法の自動切替
  - ドロップイン → 現金のみ
  - その他のコース → PayPal / 口座振替
- キッズクラス選択時は保護者氏名が必須に
- 郵便番号から住所自動入力（zipcloud API）
- 入力内容の確認画面
- Google スプレッドシートへのデータ自動保存
- 申し込み者への確認メール自動送信（任意）

## セットアップ手順

### 1. Google スプレッドシートの準備

1. [Google スプレッドシート](https://sheets.google.com/)を新規作成
2. 1行目（ヘッダー）に以下を入力：

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 入会申込日 | コース | 氏名 | フリガナ | 生年月日 | 電話番号 | メールアドレス | 郵便番号 | 住所1 | 住所2 | 保護者氏名 | 支払い方法 |

### 2. Google Apps Script の設定

1. スプレッドシートのメニュー「**拡張機能**」→「**Apps Script**」を開く
2. `google-apps-script.js` の中身をすべてコピーして貼り付け
3. 保存（Ctrl+S）

### 3. デプロイ

1. 「**デプロイ**」→「**新しいデプロイ**」
2. 種類: **ウェブアプリ**
3. 説明: `入会フォーム` など（任意）
4. 実行するユーザー: **自分**
5. アクセスできるユーザー: **全員**
6. 「**デプロイ**」をクリック
7. 表示される **URL をコピー**

### 4. フォームとの連携

`index.html` 内の以下の行を見つけ、コピーした URL を貼り付け：

```javascript
const SCRIPT_URL = ''; // ← ここにURLを貼り付け
```

例：
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/xxxxxxxxxxxx/exec';
```

### 5. 公開

`index.html` を以下のいずれかの方法で公開：

- **既存のホームページに設置** — HTMLをグーペやサーバーにアップロード
- **GitHub Pages** — このリポジトリのSettingsからPages有効化
- **Netlify / Vercel** — ドラッグ&ドロップで簡単デプロイ

## ファイル構成

```
ccj-enrollment-form/
├── index.html              # フォーム本体（HTML + CSS + JS 一体型）
├── google-apps-script.js   # Google Apps Script（スプレッドシート連携用）
└── README.md               # このファイル
```

## カスタマイズ

### 色の変更

`index.html` の `:root` セクションでカラー変数を変更できます：

```css
:root {
  --green: #00854A;       /* メインカラー */
  --yellow: #F5C518;      /* アクセントカラー */
}
```

### コース情報の更新

HTML内の `.course-option` ブロックを編集してください。

## 注意事項

- Google Apps Script のURLが未設定の場合、フォームはデモモードで動作します（送信データはコンソールに出力）
- 確認メール機能を使わない場合は `google-apps-script.js` 内の `sendConfirmationEmail(data);` の行を削除してください
