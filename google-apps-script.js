// ============================================================
// Google Apps Script — 入会 / プラン変更 → スプレッドシート連携
// プラン変更・休会・大会などの追加時はリポジトリの docs/member-services.md を参照
// ============================================================
//
// 【セットアップ手順】
//
// 1. Google スプレッドシートを新規作成する
//    - 1行目（ヘッダー）に以下を入力（入会用・先頭シートまたは「入会」シート）:
//      A1: 入会申込日 … L1: 支払い方法（README の表どおり）
//
// 2. プラン変更用シート「プラン変更」は、初回のプラン変更送信時に自動作成されます。
//    手動で用意する場合は 1 行目を次のとおりにしてください:
//      申請日時 | 氏名 | メールアドレス | 電話番号 | 現コース | 希望コース | 希望反映 | 備考
//
// 3. メニュー「拡張機能」→「Apps Script」を開き、下記を貼り付けて保存
//
// 4.「デプロイ」→「新しいデプロイ」→ ウェブアプリ（実行: 自分 / アクセス: 全員）
//
// 5. 表示された URL を index.html および plan-change.html の SCRIPT_URL に設定
//
// ============================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var raw = JSON.parse(e.postData.contents);

    if (raw.formType === 'plan_change' && raw.payload) {
      handlePlanChange_(ss, raw);
    } else {
      handleEnrollmentLegacy_(ss, raw);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** 入会（従来どおりフラット JSON） */
function handleEnrollmentLegacy_(ss, data) {
  var sheet = ss.getSheetByName('入会');
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }

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
    data['支払い方法'],
    data['年会費規定同意'] || '',
    data['個人情報取扱同意'] || '',
    data['規約バージョン'] || ''
  ];

  sheet.appendRow(row);
  sendConfirmationEmail(data);
}

var PLAN_CHANGE_HEADERS_ = [
  '申請日時',
  '氏名',
  'メールアドレス',
  '電話番号',
  '現コース',
  '希望コース',
  '希望反映',
  '備考'
];

/** プラン変更（formType + payload） */
function handlePlanChange_(ss, root) {
  var p = root.payload;
  var sheet = ss.getSheetByName('プラン変更');
  if (!sheet) {
    sheet = ss.insertSheet('プラン変更');
    sheet.appendRow(PLAN_CHANGE_HEADERS_);
  }

  var ts = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
  var row = [
    ts,
    p['氏名'] || '',
    p['メールアドレス'] || '',
    p['電話番号'] || '',
    p['現コース'] || '',
    p['希望コース'] || '',
    p['希望反映'] || '',
    p['備考'] || ''
  ];
  sheet.appendRow(row);
  sendPlanChangeConfirmationEmail_(p);
}

/**
 * 申し込み者に確認メールを自動送信する（任意機能）
 * 不要な場合は handleEnrollmentLegacy_ 内の sendConfirmationEmail(data); を削除してください
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
    + '■ 年会費: 入会時および毎年3月に3,500円\n'
    + '■ 規約同意: ' + (data['年会費規定同意'] || '同意') + '\n'
    + '■ 個人情報同意: ' + (data['個人情報取扱同意'] || '同意') + '\n'
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
 * プラン変更申出の確認メール（任意・不要なら handlePlanChange_ 内の呼び出しを削除）
 */
function sendPlanChangeConfirmationEmail_(p) {
  var subject = '【CCJ.CAPOEIRA OSAKA】プラン変更のお申し出を受け付けました';
  var body = (p['氏名'] || '会員') + ' 様\n\n'
    + 'プラン変更のお申し出を以下の内容で受け付けました。\n'
    + '担当にて内容を確認のうえ、ご連絡いたします。\n\n'
    + '━━━━━━━━━━━━━━━━━━━━\n'
    + '■ 現コース: ' + (p['現コース'] || '') + '\n'
    + '■ 希望コース: ' + (p['希望コース'] || '') + '\n'
    + '■ 希望反映: ' + (p['希望反映'] || '') + '\n'
    + '■ 電話番号: ' + (p['電話番号'] || '') + '\n'
    + '■ メールアドレス: ' + (p['メールアドレス'] || '') + '\n'
    + (p['備考'] ? '■ 備考: ' + p['備考'] + '\n' : '')
    + '━━━━━━━━━━━━━━━━━━━━\n\n'
    + 'ご不明な点は TEL: 050-3636-3410 までお問い合わせください。\n\n'
    + 'CCJ.CAPOEIRA OSAKA\n'
    + 'コハダン・ジ・コンタス大阪\n';

  if (p['メールアドレス']) {
    MailApp.sendEmail(p['メールアドレス'], subject, body);
  }
}

/**
 * GET リクエスト用（動作確認用）
 */
function doGet() {
  return ContentService
    .createTextOutput('CCJ.CAPOEIRA OSAKA フォーム API（入会・プラン変更） is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
