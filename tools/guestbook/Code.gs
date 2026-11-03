/**
 * STAY JEJULOG 방명록(GUEST NOTE) — 구글 스프레드시트 저장소
 *
 * 쓰는 법 (한 번만)
 *  1. 구글 스프레드시트를 새로 만들고, 메뉴 [확장 프로그램] → [Apps Script] 를 엽니다.
 *  2. 이 파일 내용을 통째로 붙여 넣고 저장합니다.
 *  3. [배포] → [새 배포] → 유형 '웹 앱'
 *       · 실행 사용자: 나
 *       · 액세스 권한: 모든 사용자
 *     → [배포] → 권한 승인 → 나오는 '웹 앱 URL'(…/exec)을 웹진 src/data/guestbook.ts 의 GUESTBOOK_URL 에 넣습니다.
 *
 * 시트 '방명록' 이 저절로 만들어지고, 한 줄에 노트 하나씩 쌓입니다.
 *   시간 · 이름 · Q1 · Q2 · Q3 · Q4 · Q5 · 언어 · 숨김
 * 부적절한 글은 그 줄의 '숨김' 칸에 아무 글자(예: x)나 적으면 웹진에서 사라집니다. (줄을 지워도 됩니다)
 */

const SHEET_NAME = '방명록';
const HEADER = ['시간', '이름', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', '언어', '숨김'];
const QUESTIONS = 5;
const HIDE = HEADER.length - 1; // '숨김' 칸 자리
const MAX_ANSWER = 80; // 답 한 칸 최대 글자 수 (웹진 입력 칸과 같게)
const MAX_NAME = 12;
const SHOW = 150; // 웹진에 보내는 최근 노트 수

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

/** 웹진이 읽어 가는 목록 — { count, notes: [{ name, a: [Q1 … Q5], t }] } (최근 것부터, 숨김 뺌) */
function doGet() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, HEADER.length).getValues() : [];
  const shown = rows.filter((r) => !String(r[HIDE]).trim());
  const notes = shown
    .slice(-SHOW)
    .reverse()
    .map((r) => ({ t: r[0] instanceof Date ? r[0].getTime() : r[0], name: String(r[1]), a: r.slice(2, 2 + QUESTIONS).map(String) }));
  return json_({ count: shown.length, notes: notes });
}

/** 웹진에서 남긴 노트 한 줄 — 본문은 JSON 글자 { name, a: [..5], lang } */
function doPost(e) {
  const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  const a = HEADER.slice(2, 2 + QUESTIONS).map((_, i) => clean(d.a && d.a[i], MAX_ANSWER));
  if (!a.some(Boolean)) return json_({ ok: false, error: 'empty' });
  // 수식으로 읽히지 않게 (= + - @ 로 시작하는 글 앞에 ' )
  const safe = (s) => (/^[=+\-@]/.test(s) ? "'" + s : s);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), safe(clean(d.name, MAX_NAME))].concat(a.map(safe), [clean(d.lang, 5), '']));
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
