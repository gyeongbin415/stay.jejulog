import type { ProgramId } from './types';

/**
 * 제주 게하 취향지도 — 조용한 체험형 게스트하우스 22곳 (대규모 파티 · 헌팅형은 뺌)
 * 출처: 팀 조사 리스트(제주게하_취향지도_리스트.md)에서 출처를 직접 열어 확인한 곳 + 웹진 9곳.
 *  '확인 필요'로 남은 곳은 확인되면 더합니다. 좌표는 카카오맵 장소 정보(위도 · 경도) 그대로.
 * stay — 웹진 상세페이지가 있는 곳 (한 줄 소개는 상세페이지 문장을 씀)
 */
export type TasteLayer = 'book' | 'music' | 'dinner' | 'potluck' | 'active' | 'class' | 'rest';

export const TASTE_LAYERS: { id: TasteLayer; ko: string; en: string; zh: string; color: string }[] = [
  { id: 'book', ko: '책·대화', en: 'Books & talk', zh: '书·对话', color: '#3F7D58' },
  { id: 'music', ko: '음악·영화', en: 'Music & film', zh: '音乐·电影', color: '#7A4FB0' },
  { id: 'dinner', ko: '집밥·디너', en: 'Home meals & dinner', zh: '家常饭·晚餐', color: '#E0752D' },
  { id: 'potluck', ko: '포틀럭·불멍', en: 'Potluck & campfire', zh: '聚餐·篝火', color: '#C2432F' },
  { id: 'active', ko: '자연·액티비티', en: 'Nature & activity', zh: '自然·活动', color: '#2C7FB8' },
  { id: 'class', ko: '클래스·웰니스', en: 'Class & wellness', zh: '课程·身心', color: '#B8860B' },
  { id: 'rest', ko: '조용한 휴식', en: 'Quiet rest', zh: '安静休息', color: '#6B7A70' },
];

export interface TastePlace {
  name: string;
  layer: TasteLayer;
  area: string;
  address: string;
  lat: number;
  lng: number;
  /** 웹진에 없는 곳의 한 줄 소개 (한국어) */
  desc?: string;
  stay?: ProgramId;
  insta?: string;
  kakao: string;
}

export const TASTE_PLACES: TastePlace[] = [
  // 웹진에 소개한 9곳
  { name: '새애월', layer: 'dinner', area: '제주시 애월읍', address: '제주특별자치도 제주시 애월읍 애월로4길 18', lat: 33.463314, lng: 126.314124, stay: 'running', kakao: 'https://place.map.kakao.com/1334315689' },
  { name: '쉼게스트하우스', layer: 'music', area: '제주시 한림읍', address: '제주특별자치도 제주시 한림읍 옹포2길 30', lat: 33.398474, lng: 126.249724, stay: 'cinema', kakao: 'https://place.map.kakao.com/1433929568' },
  { name: '코코코', layer: 'rest', area: '제주시 구좌읍', address: '제주특별자치도 제주시 구좌읍 상하도길 44-1', lat: 33.516327, lng: 126.867749, stay: 'flower', kakao: 'https://place.map.kakao.com/20435890' },
  { name: '서론 게스트하우스', layer: 'music', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 사계신항로39번길 17-13', lat: 33.249559, lng: 126.322555, stay: 'lp', kakao: 'https://place.map.kakao.com/1836147992' },
  { name: '서점숙소', layer: 'book', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 북촌14길 13-12', lat: 33.549114, lng: 126.699387, stay: 'book', kakao: 'https://place.map.kakao.com/1394668805' },
  { name: '스르르 게스트하우스', layer: 'class', area: '서귀포시', address: '제주특별자치도 서귀포시 일주동로 8867', lat: 33.254914, lng: 126.542076, stay: 'craft', kakao: 'https://place.map.kakao.com/248728425' },
  { name: '무릉쉼표', layer: 'potluck', area: '서귀포시 대정읍', address: '제주특별자치도 서귀포시 대정읍 무릉중앙로 43-11', lat: 33.267593, lng: 126.199088, stay: 'camping', kakao: 'https://place.map.kakao.com/98984565' },
  { name: '수수민박', layer: 'dinner', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 소기왓로 22', lat: 33.236696, lng: 126.368844, stay: 'homemeal', kakao: 'https://place.map.kakao.com/183203151' },
  { name: '루프탑정원', layer: 'dinner', area: '서귀포시 남원읍', address: '제주특별자치도 서귀포시 남원읍 태위로912번길 37', lat: 33.283468, lng: 126.745289, stay: 'wine', kakao: 'https://place.map.kakao.com/1207036664' },
  // 더 찾은 곳
  { name: '하모제주', layer: 'music', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 함덕14길 28-2', lat: 33.539927, lng: 126.665052, desc: "음반 900여 장이 있는 청음실과 '낯가림 책방'이 있고, 책방에서 영화도 봅니다. 마당에서 소소한 포틀럭을 합니다.", insta: 'https://www.instagram.com/hamojeju/', kakao: 'https://place.map.kakao.com/1262718773' },
  { name: '제제댁', layer: 'active', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 남조로 3028', lat: 33.529925, lng: 126.644865, desc: '노란 대문 집. 10명 이내 포틀럭에 밤수영 · 별 보기 · 밤 산책까지 이어집니다.', insta: 'https://www.instagram.com/zezedaek/', kakao: 'https://place.map.kakao.com/1738718608' },
  { name: '까사까미노', layer: 'rest', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 선진안길 21', lat: 33.457646, lng: 126.704328, desc: '혼자 온 여행자 7명만 받는 스테이. 숙소동과 휴게동이 나뉘어 있고, 공용 공간 플레이리스트를 함께 씁니다.', insta: 'https://www.instagram.com/casa_camino/', kakao: 'https://place.map.kakao.com/795262652' },
  { name: '샨티샨티 게스트하우스', layer: 'dinner', area: '제주시 구좌읍', address: '제주특별자치도 제주시 구좌읍 동복로 70-1', lat: 33.552622, lng: 126.713959, desc: "이름이 산스크리트어로 '평화'라는 뜻인 아늑한 게하. 사장님이 차리는 건강한 조식이 대표입니다.", insta: 'https://www.instagram.com/shantishanti_guesthouse/', kakao: 'https://place.map.kakao.com/770588299' },
  { name: '모들공간', layer: 'dinner', area: '제주시 구좌읍', address: '제주특별자치도 제주시 구좌읍 월정1길 66-5', lat: 33.556383, lng: 126.793953, desc: '1~2인 여행자 8명만 받습니다. 원테이블 다이닝 디너와 사장님이 차리는 조식이 있습니다.', insta: 'https://www.instagram.com/jeju_modlespace/', kakao: 'https://place.map.kakao.com/1426565334' },
  { name: '수상한소금밭', layer: 'book', area: '제주시 구좌읍', address: '제주특별자치도 제주시 구좌읍 종달동길 36-10', lat: 33.490498, lng: 126.902441, desc: "2012년부터 종달리 '소심한책방' 복도 끝에서 운영해 온 고요한 북스테이. 싱글룸과 더블룸이 있습니다.", insta: 'https://www.instagram.com/mysterysalt_jeju/', kakao: 'https://place.map.kakao.com/18761500' },
  { name: '히든스테이', layer: 'potluck', area: '서귀포시 성산읍', address: '제주특별자치도 서귀포시 성산읍 성산중앙로40번길 12', lat: 33.462966, lng: 126.934446, desc: '성산일출봉에서 걸어서 1분. 원하는 사람만 모여 가볍게 포틀럭과 불멍을 합니다.', insta: 'https://www.instagram.com/hiddenstay_seongsan/', kakao: 'https://place.map.kakao.com/112646260' },
  { name: '낯선하루', layer: 'potluck', area: '서귀포시 성산읍', address: '제주특별자치도 서귀포시 성산읍 신양로122번길 30-8', lat: 33.436234, lng: 126.920887, desc: '구옥 마당이 예쁜 동쪽 게하. 매일 저녁 포틀럭이 있고 조식 메뉴가 날마다 바뀝니다.', insta: 'https://www.instagram.com/strange_jeju/', kakao: 'https://place.map.kakao.com/1216888218' },
  { name: '미도호스텔', layer: 'class', area: '서귀포시', address: '제주특별자치도 서귀포시 동문동로 13-1', lat: 33.250064, lng: 126.566365, desc: "1970년대 여관 '미도장'을 고친 여행자 숙소. 티 라이브러리와 포틀럭이 있고, 해변 모닝 · 선셋 요가를 연결해 줍니다.", insta: 'https://www.instagram.com/midohostel/', kakao: 'https://place.map.kakao.com/8338148' },
  { name: '산방댁', layer: 'rest', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 사계신항로 6', lat: 33.24974, lng: 126.320815, desc: '산방산 앞 안채 · 바깥채로 된 구옥 게하. 자연 친화적이고 서쪽 노을을 보기 좋습니다.', insta: 'https://www.instagram.com/sanbangdaek/', kakao: 'https://place.map.kakao.com/1859182049' },
  { name: '소규모게스트하우스', layer: 'potluck', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 난드르로21번길 7-1', lat: 33.234493, lng: 126.366075, desc: '대평리의 작은 게하. 불멍과 밤 산책이 있고, 중문 서핑 할인을 연결해 줍니다.', insta: 'https://www.instagram.com/smallscalegh/', kakao: 'https://place.map.kakao.com/438740655' },
  { name: '아무일없는 게스트하우스', layer: 'dinner', area: '서귀포시 대정읍', address: '제주특별자치도 서귀포시 대정읍 하모중앙로 61', lat: 33.222874, lng: 126.252566, desc: '매일 저녁 6시쯤 공용 거실에 모여 함께 밥을 먹습니다. 평상에 누워 LP를 듣는 느긋한 오후가 콘셉트입니다.', insta: 'https://www.instagram.com/nothing.day.guest.house/', kakao: 'https://place.map.kakao.com/348377700' },
  { name: '옹포리 게스트하우스', layer: 'potluck', area: '제주시 한림읍', address: '제주특별자치도 제주시 한림읍 옹포3길 1', lat: 33.404925, lng: 126.253749, desc: '하루 10명만 받습니다. 저녁 7~9시 포틀럭, 9~10시 불멍으로 시간이 정해져 있습니다.', insta: 'https://www.instagram.com/jejuongpori/', kakao: 'https://place.map.kakao.com/1540026068' },
];
