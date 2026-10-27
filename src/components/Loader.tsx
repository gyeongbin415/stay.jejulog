import type { CSSProperties } from 'react';
import { useLang } from '../i18n';

/**
 * 로딩 화면 — 지도를 든 소라게 · '오늘의 보금자리 찾는 중…' (받은 그림 그대로, public/loading-crab.webp · loading-text.webp)
 * 소라게는 작게, 글씨는 메인 '에디터가 직접 제주에…' 문장과 같은 크기로 따로 맞춤
 * 밑의 점 세 개는 주황 점이 한 칸씩 옮겨 가며 기다리는 중임을 보여 줍니다.
 * 첫 화면이 뜨기 전에는 index.html 의 같은 모양(#boot-loader)이 대신 보입니다.
 * 글씨 그림은 언어마다 따로 — 영어 · 중국어판은 한국어 그림과 같은 갈색 · 같은 글자 크기로 만든 것
 */
const TEXT = {
  ko: { src: 'loading-text.webp', w: 514, h: 76 },
  en: { src: 'loading-text-en.webp', w: 589, h: 82 },
  zh: { src: 'loading-text-zh.webp', w: 567, h: 76 },
} as const;

export function Loader({ label }: { label: string }) {
  const { lang } = useLang();
  const text = TEXT[lang];
  return (
    <div className="loader" role="status" aria-live="polite">
      <img className="loader__art" src="loading-crab.webp" alt="" width={636} height={361} />
      {/* 폭은 한국어 그림 기준 크기 × 그림 폭 비율 → 언어가 달라도 글자 크기는 같음 */}
      <img className="loader__text" src={text.src} alt="" width={text.w} height={text.h} style={{ '--k': text.w / 514 } as CSSProperties} />
      <span className="loader__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
