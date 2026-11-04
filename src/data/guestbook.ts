/* ------------------------------------------------------------------
   방명록(GUEST NOTE) — 방문자가 질문 5개에 짧게 답하거나 자유롭게 적어 남기는 노트
   · 글은 팀 구글 스프레드시트에 쌓입니다 (Apps Script 웹 앱 — tools/guestbook/Code.gs 의 안내대로 배포)
   · GUESTBOOK_URL 이 비어 있으면 아직 연결 전 — 남긴 노트는 이 브라우저에만 보입니다
------------------------------------------------------------------- */

/** Apps Script 웹 앱 주소 (…/exec) */
export const GUESTBOOK_URL = 'https://script.google.com/macros/s/AKfycbxmU6Q-VC66VMrLKUTzEi04CVOt3CF0YpkpP23y--_yZYK8juTSlpusOzkVot0uq50/exec';

/** 답 한 칸 · 자유 노트 · 이름 최대 글자 수 (Code.gs 와 같게) */
export const MAX_ANSWER = 80;
export const MAX_FREE = 200;
export const MAX_NAME = 12;

export interface GuestNote {
  name: string;
  /** 질문 5개에 대한 답 + 마지막 칸은 자유 노트 (건너뛴 칸은 빈 글자) */
  a: string[];
  t?: number;
  /** 내 노트 — 시트에 들어갔는지 (연결 전 · 예전 버전에서 쓴 노트는 없음) */
  sent?: boolean;
}

export interface GuestBoard {
  count: number;
  notes: GuestNote[];
}

/** 내가 남긴 노트 — 연결 전이거나, 시트에서 다시 읽어 오기 전에도 바로 보이게 */
const MINE_KEY = 'jejulog-guest-mine';

export function loadMine(): GuestNote[] {
  try {
    const v = JSON.parse(localStorage.getItem(MINE_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function saveMine(list: GuestNote[]) {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    /* 저장 못 해도 화면은 그대로 */
  }
}

/** 마지막으로 읽어 온 노트 — 방명록에 들어가자마자 먼저 보여 주고(시트에서 읽어 오는 데 2~3초), 새로 읽어 오면 바꿈 */
const BOARD_KEY = 'jejulog-guest-board';
export function loadCachedBoard(): GuestBoard | null {
  try {
    const v = JSON.parse(localStorage.getItem(BOARD_KEY) || 'null');
    return v && Array.isArray(v.notes) ? v : null;
  } catch {
    return null;
  }
}

/** 같은 때 여러 곳에서 불러도 한 번만 읽음 */
let inflight: Promise<GuestBoard | null> | null = null;
export function fetchBoard(): Promise<GuestBoard | null> {
  if (!GUESTBOOK_URL) return Promise.resolve(null);
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch(GUESTBOOK_URL);
      const d = await res.json();
      const b = { count: Number(d.count) || 0, notes: Array.isArray(d.notes) ? d.notes : [] };
      try {
        localStorage.setItem(BOARD_KEY, JSON.stringify(b));
      } catch {
        /* 저장 못 해도 그대로 */
      }
      return b;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

// 웹진을 열 때 미리 읽어 둠 — 처음 방명록에 들어가도 바로 보이게
if (typeof window !== 'undefined' && GUESTBOOK_URL) fetchBoard();

/** 시트에 한 장 보내기 — 받았으면 true */
async function send(note: GuestNote, lang: string): Promise<boolean> {
  try {
    // 본문을 글자(text/plain)로 보내야 브라우저가 따로 허락을 묻지 않고 바로 보냄
    const res = await fetch(GUESTBOOK_URL, { method: 'POST', body: JSON.stringify({ name: note.name, a: note.a, lang }) });
    const d = await res.json();
    return !!d.ok;
  } catch {
    return false;
  }
}

/** 노트 남기기 — 시트에 보내고(연결돼 있으면) 내 노트에도 저장. 보내지 못하면 false */
export async function postNote(note: GuestNote, lang: string): Promise<boolean> {
  if (GUESTBOOK_URL && !(await send(note, lang))) return false;
  saveMine([...loadMine(), { ...note, t: Date.now(), sent: !!GUESTBOOK_URL }]);
  return true;
}

/**
 * 이 브라우저에만 남아 있던 노트를 시트로 — 시트 연결(2026-11-03 23:03) 전에 썼거나,
 * 학교 웹진 주소에 연결 전 버전이 올라가 있던 동안 쓴 노트 ('sent' 표시 없음). 시트에 이미 같은 노트가 있으면 보내지 않음
 * 하나라도 새로 보냈으면 true
 */
const CONNECTED_AT = 1793714608000;
let syncing = false;
export async function syncMine(board: GuestBoard, lang: string): Promise<boolean> {
  if (!GUESTBOOK_URL || syncing) return false;
  const old = (n: GuestNote) => !n.sent && (window.location.hostname === 'lxwebzine.hankyung.com' || (n.t ?? 0) < CONNECTED_AT);
  const list = loadMine();
  if (!list.some(old)) return false;
  syncing = true;
  const key = (n: GuestNote) => `${n.name?.trim() ?? ''}|${n.a.map((x) => (x ?? '').trim()).join('|')}`;
  const onBoard = new Set(board.notes.map(key));
  let added = false;
  for (const n of list) {
    if (!old(n)) continue;
    if (!n.a.some((x) => x?.trim()) || onBoard.has(key(n))) n.sent = true;
    else if (await send(n, lang)) n.sent = added = true;
  }
  saveMine(list);
  syncing = false;
  return added;
}
