# CCJ.CAPOEIRA OSAKA 入会申し込みフォーム

カポエイラ教室（CCJ.CAPOEIRA OSAKA）の入会申し込みWebフォームです。

## 本番フォーム（GitHub Pages）

次のURLで公開されています（閲覧・申し込み用）。

- 入会: https://soquetecapoeira-max.github.io/ccj-enrollment-form/
- プラン変更（会員向け）: https://soquetecapoeira-max.github.io/ccj-enrollment-form/plan-change.html

## 機能

- コース選択（ビギナー / アドバンス / プロ / キッズ / ドロップイン）
- コースに応じた支払い方法の自動切替
  - ドロップイン → 現金のみ
  - その他のコース → クレジットカード(PayPal) / 口座振替
- キッズクラス選択時は保護者氏名が必須に
- 郵便番号から住所自動入力（zipcloud API）
- 入力内容の確認画面
- Google スプレッドシートへのデータ自動保存
- 申し込み者への確認メール自動送信（任意）
- **プラン変更**（`plan-change.html`）— 会員向け。申請内容はスプレッドシートの「プラン変更」シートに追記（初回送信時にシートが無ければ GAS が作成）

## セットアップ手順

### 1. Google スプレッドシートの準備

1. [Google スプレッドシート](https://sheets.google.com/)を新規作成
2. 1行目（ヘッダー）に以下を入力：

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 入会申込日 | コース | 氏名 | フリガナ | 生年月日 | 電話番号 | メールアドレス | 郵便番号 | 住所1 | 住所2 | 保護者氏名 | 支払い方法 | 年会費規定同意 | 個人情報取扱同意 | 規約バージョン |

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

このリポジトリの `index.html` と `plan-change.html` には、運用用の Google Apps Script の **同一 URL が設定されています**（1 本のウェブアプリで入会とプラン変更の両方を受け付けます）。自分用のスプレッドシートとスクリプトを新規に用意した場合だけ、**両ファイル**の `SCRIPT_URL` を書き換えてください。

```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/xxxxxxxxxxxx/exec';
```

初回セットアップ時は空文字のままにしておき、デプロイ後に貼り付けても構いません。未設定のときはデモモード（コンソール出力のみ）で動作します。

**プラン変更を使うとき:** スプレッドシートに紐づいた Apps Script のエディタを開き、リポジトリの `google-apps-script.js` の内容に**置き換え**たうえで、「デプロイ」→「デプロイを管理」→ 既存ウェブアプリの **新バージョンをデプロイ** してください（コード差し替えのみでは反映されません）。

### 5. 公開

`index.html` を以下のいずれかの方法で公開：

- **既存のホームページに設置** — HTMLをグーペやサーバーにアップロード
- **GitHub Pages** — このリポジトリのSettingsからPages有効化
- **Netlify / Vercel** — ドラッグ&ドロップで簡単デプロイ

## ファイル構成

```
ccj-enrollment-form/
├── index.html              # 入会フォーム（HTML + CSS + JS 一体型）
├── plan-change.html        # プラン変更（会員向け）
├── google-apps-script.js   # Google Apps Script（スプレッドシート連携用）
├── docs/
│   └── member-services.md  # プラン変更・休会・大会など拡張の設計メモ
├── PROGRESS.md             # 進捗・デプロイ情報のメモ（運用向け）
└── README.md               # このファイル
```

## メンバー向け手続きの拡張

**プラン変更（フェーズ1）は実装済み**です。休会・大会など今後の足し方は次のドキュメントにまとめています。

[docs/member-services.md](docs/member-services.md)

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

入会は `index.html` の `.course-option`、プラン変更は `plan-change.html` 内のコース用 `<select>` を編集してください（表記を揃えること）。

## 注意事項

- Google Apps Script のURLが未設定の場合、フォームはデモモードで動作します（送信データはコンソールに出力）
- 確認メール機能を使わない場合は `google-apps-script.js` 内の `sendConfirmationEmail(data);` の行を削除してください
- プラン変更の確認メールを止める場合は `handlePlanChange_` 内の `sendPlanChangeConfirmationEmail_(p);` を削除してください
- 入会用データは、シート名が **入会** のタブがあればそこに、なければ **ブック内の先頭シート** に書き込みます
