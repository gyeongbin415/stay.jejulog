/* ------------------------------------------------------------------
   콘텐츠 데이터 타입 정의
   실제 취재 내용으로 교체할 때는 src/data/programs.ts 만 수정하면 됩니다.
------------------------------------------------------------------- */

/** 사진이 아직 없을 때 대신 그려 줄 샘플 일러스트 키 (src/components/PlaceholderArt.tsx) */
export type ArtKey =
  | 'coast-dawn' | 'oreum' | 'stone-house' | 'road' | 'window' | 'sea-night'
  | 'night-bokeh' | 'night-crowd'
  | 'shoe' | 'cinema' | 'flower' | 'lp' | 'headphones' | 'book' | 'camera' | 'ring' | 'workbench'
  | 'campfire' | 'table' | 'wine';

export interface PhotoData {
  /** 실제 사진 경로 (예: 'photos/running-hero.jpg'). 비워 두면 샘플 일러스트가 표시됩니다. */
  src?: string;
  /** 대체 텍스트 — 사진이 무엇을 보여 주는지 한 문장으로 */
  alt: string;
  /** 샘플 일러스트 종류 */
  art: ArtKey;
  /** 사진 아래 캡션 (선택) */
  caption?: string;
  /** 칸에 맞춰 잘릴 때 남길 자리 (CSS object-position, 예: '80% 50%' — 간판 글씨가 잘리지 않게) */
  focus?: string;
  /** 프로그램 사진 한 장일 때 화면 비율 (예: '7 / 5') — 비우면 4 / 3 */
  ratio?: string;
}

export type ProgramId =
  | 'running' | 'cinema' | 'flower' | 'lp' | 'book' | 'craft' | 'camping' | 'homemeal' | 'wine';

export type TypeId = 'adventurer' | 'collector' | 'maker' | 'keeper';

/** 기사 페이지 테마 이름 — article--{layout} 클래스로 쓰입니다 (theater 는 어두운 페이지) */
export type ArticleLayout = 'horizon' | 'theater' | 'prints' | 'sleeve' | 'contact' | 'process';

export interface ProgramReport {
  /** true 이면 화면에 'SAMPLE · 취재 후 교체' 표시가 붙습니다. 취재를 마치면 false 로 바꾸세요. */
  sample: boolean;
  place: {
    /** 게스트하우스 이름 */
    name: string;
    /** 지역 (예: 제주시 구좌읍) */
    area: string;
    /** 상세 주소 */
    address: string;
  };
  visit: { date: string; editor: string; photographer: string };
  /** 에디터 체험 기록 — 문단 단위 배열 */
  experience: string[];
  /** 공간의 분위기 */
  atmosphere: string;
  /** 가장 인상 깊었던 순간 (짧은 인용구) */
  moment: string;
  /** 위치·운영 정보 — 비어 있으면 example(예시 형식)이 흐리게 표시됩니다. */
  info: { label: string; value: string; example: string }[];
  /** 게스트하우스 상세 정보 링크 */
  detailUrl: string;
  /** 예약 링크 */
  bookingUrl: string;
  /** 게스트하우스 한 줄 소개 */
  oneLine?: string;
  /** 프로그램 소개 위 작은 제목 (예: 프로그램 기획 의도) */
  introLabel?: string;
  /** 프로그램 소개 앞에 두는 인용 한 줄 */
  introQuote?: string;
  /**
   * 운영 프로그램 — 이름 · 정보(시간·가격 등) · 사진 · 설명 문단 · 안내사항.
   * 채워 두면 기사 페이지에서 체험 인터랙션 대신 대표 사진(hero)을 보여 줍니다.
   */
  programs?: {
    name: string;
    info: { label: string; value: string }[];
    photo?: PhotoData;
    /** 세로 사진 두 장 — 가로로 나란히 보여 줍니다 */
    photos?: [PhotoData, PhotoData];
    text: string[];
    note?: string;
  }[];
  /** 에디터 프로필 — 채우면 방문일·취재·사진 줄 대신 표시됩니다 */
  editorProfile?: { title?: string; label?: string; avatar?: string; tags: string[]; about?: string[] };
  /** 이런 사람에게 추천해요 — 문단 단위 배열 */
  recommend?: string[];
  /** 참여 전 확인 — 출처로 확인된 내용만 (참여 대상 · 참여 방법 · 공식 안내 링크). 없으면 박스를 띄우지 않음 */
  join?: { who?: string; how?: string; links?: { label: string; url: string }[] };
}

export interface Program {
  id: ProgramId;
  /** 사이트맵 페이지 ID */
  pageId: string;
  no: string;
  en: string;
  /** 'OO하는 방법' 형식의 기사 제목 */
  title: string;
  /** CHAPTER 01 에서 쓰는 동사 키워드 */
  verb: string;
  /** 한 줄 리드 */
  kicker: string;
  /** 프로그램 소개 (기본 문안 — 취재 후 실제 내용에 맞게 다듬으세요) */
  intro: string;
  /** 이런 사람에게 추천 */
  forWhom: string[];
  /** 인터랙션 안내 문구 */
  hint: string;
  /** 메인 목록에 보이는 짧은 체험 이름 (예: 셔터 누르기) */
  tryLabel: string;
  /** 대표 사진 + 갤러리 */
  hero: PhotoData;
  gallery: PhotoData[];
  layout: ArticleLayout;
  /** 챕터 색 톤 — CSS 변수로 들어갑니다 */
  tone: { paper: string; ink: string; accent: string };
  /** 취향 테스트에서 이 프로그램이 속한 유형 */
  type: TypeId;
  report: ProgramReport;
  /** 빈 칸에 표시될 작성 가이드 — 취재 기록을 쓸 때 참고하세요 */
  guide: { experience: string; atmosphere: string; moment: string };
}
