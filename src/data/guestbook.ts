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

export async function fetchBoard(): Promise<GuestBoard | null> {
  if (!GUESTBOOK_URL) return null;
  try {
    const res = await fetch(GUESTBOOK_URL);
    const d = await res.json();
    return { count: Number(d.count) || 0, notes: Array.isArray(d.notes) ? d.notes : [] };
  } catch {
    return null;
  }
}

/** 노트 남기기 — 시트에 보내고(연결돼 있으면) 내 노트에도 저장. 보내지 못하면 false */
export async function postNote(note: GuestNote, lang: string): Promise<boolean> {
  if (GUESTBOOK_URL) {
    try {
      // 본문을 글자(text/plain)로 보내야 브라우저가 따로 허락을 묻지 않고 바로 보냄
      const res = await fetch(GUESTBOOK_URL, { method: 'POST', body: JSON.stringify({ ...note, lang }) });
      const d = await res.json();
      if (!d.ok) return false;
    } catch {
      return false;
    }
  }
  saveMine([...loadMine(), { ...note, t: Date.now() }]);
  return true;
}
