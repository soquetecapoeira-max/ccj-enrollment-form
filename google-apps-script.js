// ============================================================
// Google Apps Script — 入会申し込みフォーム → スプレッドシート連携
// ============================================================
//
// 【セットアップ手順】
//
// 1. Google スプレッドシートを新規作成する
//    - シート名はそのまま「シート1」でOK
//    - 1行目（ヘッダー）に以下を入力:
//      A1: 入会申込日
//      B1: コース
//      C1: 氏名
//      D1: フリガナ
//      E1: 生年月日
//      F1: 電話番号
//      G1: メールアドレス
//      H1: 郵便番号
//      I1: 住所1
//      J1: 住所2
//      K1: 保護者氏名
//      L1: 支払い方法
//
// 2. メニュー「拡張機能」→「Apps Script」を開く
//
// 3. 下記のコードを貼り付けて保存する
//
// 4.「デプロイ」→「新しいデプロイ」を選択
//    - 種類：「ウェブアプリ」
//    - 実行するユーザー：「自分」
//    - アクセスできるユーザー：「全員」
//    - 「デプロイ」をクリック
//
// 5. 表示されるURLをコピーして、index.html の SCRIPT_URL に貼り付ける
//
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var row = [
      data['入会申込日'],
      data['コース'],
      data['氏名'],
      data['フリガナ'],
      data['生年月日'],
      data['電話番号'],
      data['メールアドレス'],
      data['郵便番号'],
      data['住所1'],
      data['住所2'],
      data['保護者氏名'],
      data['支払い方法']
    ];

    sheet.appendRow(row);

    // 確認メールを送信（任意）
    sendConfirmationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 申し込み者に確認メールを自動送信する（任意機能）
 * 不要な場合は sendConfirmationEmail(data); の行を削除してください
 */
function sendConfirmationEmail(data) {
  var subject = '【CCJ.CAPOEIRA OSAKA】入会申し込みを受け付けました';

  var body = data['氏名'] + ' 様\n\n'
    + 'この度は入会申し込みいただき、ありがとうございます。\n'
    + '以下の内容で受け付けいたしました。\n\n'
    + '━━━━━━━━━━━━━━━━━━━━\n'
    + '■ コース: ' + data['コース'] + '\n'
    + '■ 氏名: ' + data['氏名'] + '\n'
    + '■ フリガナ: ' + data['フリガナ'] + '\n'
    + '■ 生年月日: ' + data['生年月日'] + '\n'
    + '■ 電話番号: ' + data['電話番号'] + '\n'
    + '■ メールアドレス: ' + data['メールアドレス'] + '\n'
    + '■ 郵便番号: ' + data['郵便番号'] + '\n'
    + '■ 住所: ' + data['住所1'] + ' ' + (data['住所2'] || '') + '\n'
    + (data['保護者氏名'] ? '■ 保護者氏名: ' + data['保護者氏名'] + '\n' : '')
    + '■ 支払い方法: ' + data['支払い方法'] + '\n'
    + '━━━━━━━━━━━━━━━━━━━━\n\n'
    + '担当者よりご連絡を差し上げますので、\n'
    + 'しばらくお待ちくださいませ。\n\n'
    + 'ご不明な点がございましたら、\n'
    + 'お気軽にお問い合わせください。\n\n'
    + 'TEL: 050-3636-3410\n'
    + 'WEB: https://cordao.org/\n\n'
    + '━━━━━━━━━━━━━━━━━━━━\n'
    + 'CCJ.CAPOEIRA OSAKA\n'
    + 'コハダン・ジ・コンタス大阪\n'
    + '━━━━━━━━━━━━━━━━━━━━';

  MailApp.sendEmail(data['メールアドレス'], subject, body);
}

/**
 * GET リクエスト用（動作確認用）
 */
function doGet() {
  return ContentService
    .createTextOutput('CCJ.CAPOEIRA OSAKA 入会フォーム API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
