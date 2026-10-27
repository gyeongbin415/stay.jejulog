import { useEffect, useRef, useState } from 'react';
import { useContent } from '../i18n';
import gehageUrl from '../assets/gehage.png';
import crabUrl from '../assets/gehage-crab.webp';
import bubbleUrl from '../assets/gehage-bubble.webp';
import marksUrl from '../assets/gehage-marks.webp';

/** 말풍선 모양 — 타원 몸통(가운데 112,58 · 반지름 100×52)과 왼쪽 아래로 뻗은 꼬리 */
const BUBBLE_PATH = 'M54.6 100.6 A100 52 0 1 0 30.1 87.8 Q29 110 14 126 Q38 117 54.6 100.6 Z';

/** 화면에 들어올 때마다 true (나가면 false) — 다시 내려올 때마다 처음부터 움직이게 */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(([en]) => setOn(en.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/**
 * 짐을 메고 지도를 든 여행자 소라게 게하게 + 말풍선 — 메인 FIND YOUR STAY 칸
 * 한국어는 받은 입체 그림을 소라게 · 말풍선 · 느낌표 세 겹으로 오려(그림은 그대로) 따로 움직임:
 * 화면에 들어오면 소라게가 뒤뚱뒤뚱 걸어 들어오고 → 말풍선이 톡 튀어나오고 → 집게 옆 느낌표가 깜빡.
 * 누르거나 마우스를 올리면 몸을 흔들어 반가워함. (동작 줄이기 설정이면 멈춘 그림 그대로)
 * 다른 언어는 글자를 바꿀 수 있게 그린 말풍선
 */
export function GehageScene({ bubbleId = 'story-bubble-fill' }: { bubbleId?: string }) {
  const { lang, ui } = useContent();
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [poke, setPoke] = useState(0);
  useEffect(() => {
    if (!poke) return;
    const t = window.setTimeout(() => setPoke(0), 700);
    return () => window.clearTimeout(t);
  }, [poke]);
  const wiggle = () => setPoke((n) => n || Date.now());

  if (lang === 'ko') {
    return (
      <div className="story__scene">
        <div
          ref={ref}
          className={`story__scene-art gehage${on ? ' is-on' : ''}${poke ? ' is-poke' : ''}`}
          role="img"
          aria-label={ui.test.storyBubble.replace('\n', ' ')}
          onPointerEnter={wiggle}
          onClick={wiggle}
        >
          <img className="gehage__crab" src={crabUrl} alt="" width={900} height={616} />
          <img className="gehage__bubble" src={bubbleUrl} alt="" width={900} height={616} />
          <img className="gehage__marks" src={marksUrl} alt="" width={900} height={616} />
        </div>
      </div>
    );
  }
  return (
    <div className="story__scene">
      <img className="story__char gehage-walk" src={gehageUrl} alt="" aria-hidden="true" />
      {/* 소라게 옆 말풍선 — 크림색 몸통 · 갈색 테두리 · 오른쪽 아래 베이지 그림자 · 왼쪽 아래 꼬리 */}
      <div className="story__bubble">
        <svg className="story__bubble-bg" viewBox="0 0 220 130" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={bubbleId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0.45" stopColor="#FCF1E2" />
              <stop offset="1" stopColor="#F4E2CB" />
            </linearGradient>
          </defs>
          <path d={BUBBLE_PATH} transform="translate(5 5)" fill="#EFDCC3" />
          <path d={BUBBLE_PATH} fill={`url(#${bubbleId})`} stroke="#A3683F" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="story__bubble-text pre">{ui.test.storyBubble}</p>
      </div>
    </div>
  );
}
