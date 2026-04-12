# CCJ.CAPOEIRA OSAKA 入会フォーム — 進捗メモ

最終更新: 2026年4月12日

---

## 完了したこと

- [x] フォームの要件整理
- [x] `index.html` 作成（デザイン・バリデーション・条件分岐すべて込み）
- [x] `google-apps-script.js` 作成（スプレッドシート連携 + 確認メール自動送信）
- [x] Google スプレッドシート「CCJカポエイラ入会申し込み」作成済み（ヘッダー行入力済み）
- [x] Google Apps Script にコード貼り付け・デプロイ済み
- [x] デプロイURL を `index.html` の `SCRIPT_URL` に設定済み
- [x] 支払い方法の表示を「クレジットカード(PayPal)」に変更済み
- [x] 送信ボタンの不具合修正済み（type="submit" → type="button"）

## まだやっていないこと

- [ ] **テスト送信**（フォームに入力 → スプレッドシートにデータが入るか確認）
- [ ] **GitHub Pages で公開**（URLを発行して、メールで送れるようにする）
  - GitHub のユーザー名が必要
  - 手順: git init → push → Settings > Pages で有効化

---

## デプロイ情報

| 項目 | 値 |
|------|-----|
| Apps Script URL | `https://script.google.com/macros/s/AKfycbxrVHm38s5AjyAVRdQEeIRBtjZAQ4tnCT2deRMDx0VC7XaiZtpkWoboaPlBIlnBDz3v4g/exec` |
| スプレッドシート名 | CCJカポエイラ入会申し込み |
| ローカルファイル | `/Users/kuboyamatakeshi/Desktop/GitHub/ccj-enrollment-form/index.html` |

---

## フォームの仕様

### コース一覧
1. ビギナーコース ¥6,700/月（月4回）
2. アドバンスコース ¥9,400/月（月8回）
3. プロコース ¥13,000/月（無制限）
4. キッズクラス ¥5,000/月（週2回）
5. ドロップイン ¥2,500/回

### 支払い方法
- コース1〜4: クレジットカード(PayPal) / 口座振替
- ドロップイン: 現金のみ

### フォーム項目
氏名 / フリガナ / 生年月日 / TEL / メールアドレス / 郵便番号 / 住所1 / 住所2 / 保護者氏名 / コース / 支払い方法 / 入会申込日(自動)

### 機能
- コース選択で支払い方法が自動切替
- キッズクラス選択時は保護者氏名が必須に
- 郵便番号から住所自動入力
- 送信前の確認画面
- Google スプレッドシートへ自動保存
- 申し込み者に確認メール自動送信

---

## 次回やること

1. フォームのテスト送信を行う
2. GitHub ユーザー名を確認
3. GitHub Pages にデプロイしてURLを発行
4. 発行したURLを体験者へのメールテンプレートに組み込む
