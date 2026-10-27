import { useContent } from '../i18n';
import gehageUrl from '../assets/gehage.png';
import sceneUrl from '../assets/gehage-3d.webp';

/** 말풍선 모양 — 타원 몸통(가운데 112,58 · 반지름 100×52)과 왼쪽 아래로 뻗은 꼬리 */
const BUBBLE_PATH = 'M54.6 100.6 A100 52 0 1 0 30.1 87.8 Q29 110 14 126 Q38 117 54.6 100.6 Z';

/**
 * 짐을 메고 지도를 든 여행자 소라게 게하게 + 말풍선 — 메인 FIND YOUR STAY 칸
 * 한국어는 받은 입체 그림 한 장(소라게 + 말풍선). 다른 언어는 글자를 바꿀 수 있게 그린 말풍선
 */
export function GehageScene({ bubbleId = 'story-bubble-fill' }: { bubbleId?: string }) {
  const { lang, ui } = useContent();
  if (lang === 'ko') {
    // 받은 그림 그대로 — 입체 소라게 + 말풍선('오늘은 어떤 집에서 묵어볼까?') 한 장, 바깥 배경만 뺌
    return (
      <div className="story__scene">
        <img className="story__scene-art" src={sceneUrl} alt={ui.test.storyBubble.replace('\n', ' ')} />
      </div>
    );
  }
  return (
    <div className="story__scene">
      <img className="story__char" src={gehageUrl} alt="" aria-hidden="true" />
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
