import type { ProgramId } from './types';

/**
 * 제주 게하 취향지도 — 프로그램이 있는 제주 게스트하우스 95곳 (대규모 헌팅 · 파티형만 뺌)
 * 출처: 팀 조사 리스트(제주게하_취향지도_리스트_v2.md · .json) — 장소마다 직접 연 출처가 있음.
 *  좌표는 카카오맵 장소 정보(위도 · 경도) 그대로. 한 줄 소개는 웹진처럼 '~ 숙소'로 끝맺음.
 * stay — 웹진 상세페이지가 있는 곳 (한 줄 소개는 상세페이지 문장을 씀)
 */
export type TasteLayer = 'book' | 'music' | 'dinner' | 'potluck' | 'active' | 'class' | 'rest';

export const TASTE_LAYERS: { id: TasteLayer; ko: string; en: string; zh: string; color: string }[] = [
  { id: 'book', ko: '책·대화', en: 'Books & talk', zh: '书·对话', color: '#3F7D58' },
  { id: 'music', ko: '음악·영화', en: 'Music & film', zh: '音乐·电影', color: '#7A4FB0' },
  { id: 'dinner', ko: '집밥·디너', en: 'Home meals & dinner', zh: '家常饭·晚餐', color: '#E0752D' },
  { id: 'potluck', ko: '포틀럭·불멍', en: 'Potluck & campfire', zh: '聚餐·篝火', color: '#C2432F' },
  { id: 'active', ko: '자연·액티비티', en: 'Nature & activity', zh: '自然·活动', color: '#2C7FB8' },
  { id: 'class', ko: '클래스', en: 'Class', zh: '课程', color: '#B8860B' },
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
  { name: "새애월", layer: "dinner", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 애월로4길 18 1층", lat: 33.463314, lng: 126.314124, stay: "running", insta: "https://www.instagram.com/sae_aewol/", kakao: "https://place.map.kakao.com/1334315689" },
  { name: "쉼게스트하우스", layer: "music", area: "제주시 한림읍", address: "제주특별자치도 제주시 한림읍 옹포2길 30", lat: 33.398474, lng: 126.249724, stay: "cinema", insta: "https://www.instagram.com/jejushym/", kakao: "https://place.map.kakao.com/1433929568" },
  { name: "코코코", layer: "rest", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 상하도길 44-1", lat: 33.516327, lng: 126.867749, stay: "flower", insta: "https://www.instagram.com/cococolife/", kakao: "https://place.map.kakao.com/20435890" },
  { name: "서론 게스트하우스", layer: "music", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 사계신항로39번길 17-13", lat: 33.249559, lng: 126.322555, stay: "lp", insta: "https://www.instagram.com/seolon_zip/", kakao: "https://place.map.kakao.com/1836147992" },
  { name: "서점숙소", layer: "book", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 북촌14길 13-12", lat: 33.549114, lng: 126.699387, stay: "book", insta: "https://www.instagram.com/jejubookhome/", kakao: "https://place.map.kakao.com/1394668805" },
  { name: "스르르 게스트하우스", layer: "class", area: "서귀포시 호근동", address: "제주특별자치도 서귀포시 일주동로 8867", lat: 33.254914, lng: 126.542076, stay: "craft", insta: "https://www.instagram.com/jeju_srr_house/", kakao: "https://place.map.kakao.com/248728425" },
  { name: "무릉쉼표", layer: "potluck", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 무릉중앙로 43-11", lat: 33.267593, lng: 126.199088, stay: "camping", insta: "https://www.instagram.com/mr_shuimpyo__/", kakao: "https://place.map.kakao.com/98984565" },
  { name: "수수민박", layer: "dinner", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 소기왓로 22", lat: 33.236696, lng: 126.368844, stay: "homemeal", insta: "https://www.instagram.com/soosoohouse/", kakao: "https://place.map.kakao.com/183203151" },
  { name: "루프탑정원", layer: "dinner", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 태위로912번길 37", lat: 33.283468, lng: 126.745289, stay: "wine", insta: "https://www.instagram.com/rooftop_guesthouse/", kakao: "https://place.map.kakao.com/1207036664" },
  { name: "하모제주", layer: "music", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 함덕14길 28-2", lat: 33.539927, lng: 126.665052, desc: "음반 900여 장의 청음실과 '낯가림 책방'에서 음악과 영화를 즐기고, 마당에서 소소한 포틀럭도 하는 숙소", insta: "https://www.instagram.com/hamojeju/", kakao: "https://place.map.kakao.com/1262718773" },
  { name: "프롤로그", layer: "music", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 북촌북길 44", lat: 33.550086, lng: 126.691183, desc: "하루 8명만 머무는 북촌 바닷가에서 LP를 듣고 크루아상 조식과 소규모 포틀럭을 즐기는 숙소", insta: "https://www.instagram.com/prologue_guesthouse/", kakao: "https://place.map.kakao.com/891518659" },
  { name: "구주택", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 북촌14길 13-10 영오오션빌리지 204동", lat: 33.548999, lng: 126.69931, desc: "북유럽 오두막 느낌 속에서 매일 저녁 소규모 포틀럭과 조식을 함께하는 숙소", insta: "https://www.instagram.com/9_jutaek/", kakao: "https://place.map.kakao.com/1715167790" },
  { name: "제제댁", layer: "active", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 남조로 3028", lat: 33.529925, lng: 126.644865, desc: "10명 이내 포틀럭에 밤수영 · 별 보기 · 밤 산책까지 함께하는 노란 대문 숙소", insta: "https://www.instagram.com/zezedaek/", kakao: "https://place.map.kakao.com/1738718608" },
  { name: "까사까미노", layer: "rest", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 선진안길 21", lat: 33.457646, lng: 126.704328, desc: "혼자 온 여행자 7명만 받아, 숙소동과 휴게동을 나누고 공용 플레이리스트를 함께 쓰는 조용한 숙소", insta: "https://www.instagram.com/casa_camino/", kakao: "https://place.map.kakao.com/795262652" },
  { name: "샨티샨티 게스트하우스", layer: "dinner", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 동복로 70-1", lat: 33.552622, lng: 126.713959, desc: "사장님이 차리는 건강한 조식이 대표인, 산스크리트어로 '평화'라는 이름의 아늑한 숙소", insta: "https://www.instagram.com/shantishanti_guesthouse/", kakao: "https://place.map.kakao.com/770588299" },
  { name: "모들공간", layer: "dinner", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 월정1길 66-5", lat: 33.556383, lng: 126.793953, desc: "1~2인 여행자 8명만 받아, 사장님이 직접 만드는 파인다이닝 디너와 조식을 함께하는 숙소", insta: "https://www.instagram.com/jeju_modlespace/", kakao: "https://place.map.kakao.com/1426565334" },
  { name: "수상한소금밭", layer: "book", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 종달동길 36-10", lat: 33.490498, lng: 126.902441, desc: "종달리 '소심한책방'과 이어져 2012년부터 운영해 온, 싱글룸과 더블룸이 있는 고요한 북스테이 숙소", insta: "https://www.instagram.com/mysterysalt_jeju/", kakao: "https://place.map.kakao.com/18761500" },
  { name: "책닦는남자 북스테이", layer: "book", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 한동북1길 34-6", lat: 33.541034, lng: 126.828887, desc: "한동리 시골 마을에서 책과 함께 조용히 머무는 북스테이 숙소", kakao: "https://place.map.kakao.com/26808711" },
  { name: "히든스테이", layer: "potluck", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 성산중앙로40번길 12", lat: 33.462966, lng: 126.934446, desc: "성산일출봉에서 걸어서 1분, 불꽃놀이와 불멍을 함께하는 숙소", insta: "https://www.instagram.com/hiddenstay_seongsan/", kakao: "https://place.map.kakao.com/112646260" },
  { name: "낯선하루", layer: "potluck", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 신양로122번길 30-8", lat: 33.436234, lng: 126.920887, desc: "구옥 마당에서 매일 저녁 포틀럭을 하고 날마다 다른 조식을 내는 동쪽 숙소", insta: "https://www.instagram.com/strange_jeju/", kakao: "https://place.map.kakao.com/1216888218" },
  { name: "자고가 게스트하우스", layer: "potluck", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 신양로122번길 29", lat: 33.435545, lng: 126.920431, desc: "술을 마시지 않아도 함께하는 포틀럭과 불멍이 있고, 서핑까지 이어 주는 성산의 작은 숙소", kakao: "https://place.map.kakao.com/683456020" },
  { name: "미도호스텔", layer: "class", area: "서귀포시 서귀동", address: "제주특별자치도 서귀포시 동문동로 13-1 1층", lat: 33.250064, lng: 126.566365, desc: "1970년대 여관 '미도장'을 고쳐, 티 라이브러리 · 포틀럭 · 해변 요가를 즐길 수 있는 숙소", insta: "https://www.instagram.com/midohostel/", kakao: "https://place.map.kakao.com/8338148" },
  { name: "적당한", layer: "music", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 사계로114번길 54-93", lat: 33.235846, lng: 126.308619, desc: "기타 치는 사장님의 모닥불 라이브 공연과 '제주네컷' 사진, 저녁 식사 · 포틀럭이 있는 음악 숙소", insta: "https://www.instagram.com/jeokdanghan/", kakao: "https://place.map.kakao.com/896828177" },
  { name: "산방댁", layer: "potluck", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 사계신항로 6", lat: 33.24974, lng: 126.320815, desc: "산방산 앞 구옥에서 참여비 없는 포틀럭 파티를 소주 없이 즐기고 서쪽 노을을 보는 숙소", insta: "https://www.instagram.com/sanbangdaek/", kakao: "https://place.map.kakao.com/1859182049" },
  { name: "소규모게스트하우스", layer: "potluck", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 난드르로21번길 7-1 1층", lat: 33.234493, lng: 126.366075, desc: "대평리에서 불멍과 별 보며 걷는 밤 산책을 하고, 중문 서핑 할인까지 이어 주는 작은 숙소", insta: "https://www.instagram.com/smallscalegh/", kakao: "https://place.map.kakao.com/438740655" },
  { name: "아무일없는 게스트하우스", layer: "dinner", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 하모중앙로 61", lat: 33.222874, lng: 126.252566, desc: "매일 저녁 6시쯤 함께 밥을 먹고, 평상에 누워 LP를 듣는 느긋한 오후의 숙소", insta: "https://www.instagram.com/nothing.day.guest.house/", kakao: "https://place.map.kakao.com/348377700" },
  { name: "제주공감게스트하우스", layer: "active", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 일과대수로27번길 35", lat: 33.238096, lng: 126.2293, desc: "날씨가 좋으면 함께 야생 돌고래를 보러 가고, 불멍과 수제 잼 조식이 있는 숙소", kakao: "https://place.map.kakao.com/1905538916" },
  { name: "오소소 게스트하우스", layer: "active", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 비자낭로 23", lat: 33.285342, lng: 126.183949, desc: "매일 아침 돌고래를 보러 바다로, 오름으로 함께 산책을 나가는 느슨한 교류의 숙소", insta: "https://www.instagram.com/ososojeju/", kakao: "https://place.map.kakao.com/933100322" },
  { name: "옹포리 게스트하우스", layer: "potluck", area: "제주시 한림읍", address: "제주특별자치도 제주시 한림읍 옹포3길 1", lat: 33.404925, lng: 126.253749, desc: "하루 10명만 받아 저녁 7~9시 포틀럭, 9~10시 불멍을 함께하는 숙소", insta: "https://www.instagram.com/jejuongpori/", kakao: "https://place.map.kakao.com/1540026068" },
  { name: "1미리 게스트하우스", layer: "potluck", area: "제주시 한림읍", address: "제주특별자치도 제주시 한림읍 협재6길 22-4", lat: 33.393524, lng: 126.242252, desc: "고양이가 많아 알레르기약까지 챙겨 주고, 저녁마다 소규모 포틀럭과 불멍을 하는 협재 숙소", insta: "https://www.instagram.com/1mm_guesthouse/", kakao: "https://place.map.kakao.com/767805794" },
  { name: "우도 스페이스01", layer: "rest", area: "제주시 우도면", address: "제주특별자치도 제주시 우도면 영일길 115-41", lat: 33.504354, lng: 126.962461, desc: "게하와 펜션 객실 중 고를 수 있고, 한가한 날엔 사장님이 음식을 대접하기도 하는 우도 숙소", kakao: "https://place.map.kakao.com/2104319592" },
  { name: "정원책방", layer: "book", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 원님로25번길 14", lat: 33.315108, lng: 126.719845, desc: "루프탑정원 2호점으로, 파티 없이 책과 영화를 보며 쉬는 여성 전용 북스테이 숙소", insta: "https://www.instagram.com/rooftop_guesthouse/", kakao: "https://place.map.kakao.com/1228455030" },
  { name: "우리두리 게스트하우스", layer: "dinner", area: "서귀포시 표선면", address: "제주특별자치도 서귀포시 표선면 민속해안로119번길 10-1", lat: 33.307467, lng: 126.81273, desc: "사장님이 차린 저녁을 다 함께 먹고 소규모 자리로 이어지는, 혼자 오는 손님이 많은 표선 숙소", kakao: "https://place.map.kakao.com/27167182" },
  { name: "굿나잇굿럭", layer: "potluck", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 애월로9길 60 1동", lat: 33.466531, lng: 126.31869, desc: "한옥을 고친 애월 게하에서 1차 포틀럭, 2차 불멍으로 이어지는 숙소", insta: "https://www.instagram.com/goodnight.luck/", kakao: "https://place.map.kakao.com/1320154203" },
  { name: "도토리 게스트하우스", layer: "dinner", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 신흥고수로 9", lat: 33.299505, lng: 126.764388, desc: "돌집 디너 식당에서 함께 저녁을 먹고, 원하면 2차 자리까지 이어지는 숙소", kakao: "https://place.map.kakao.com/1025949183" },
  { name: "함덕주택", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 함덕16길 1-4", lat: 33.540319, lng: 126.668668, desc: "함덕해수욕장과 가장 가깝고, 개인 화장실 딸린 1 · 2인실에 저녁 파티는 골라서 참여하는 숙소", insta: "https://www.instagram.com/hamdeokhouse/", kakao: "https://place.map.kakao.com/676864548" },
  { name: "소낭게스트하우스 1호점", layer: "active", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 월정1길 1 가동 1호", lat: 33.552025, lng: 126.790961, desc: "월정리 바다 앞에서 매일 아침 '소낭스냅투어'와 밤 야경 스냅을 찍는 숙소", insta: "https://www.instagram.com/sonang_guesthouse/", kakao: "https://place.map.kakao.com/2063256946" },
  { name: "벼리 게스트하우스", layer: "active", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 면수1길 27", lat: 33.523821, lng: 126.864603, desc: "세화바다 가까이에서 사장님과 별을 보러 가는 별빛투어와 4천 원 보말죽 조식이 있는 숙소", insta: "https://www.instagram.com/byuli_guesthouse/", kakao: "https://place.map.kakao.com/26870979" },
  { name: "다독다독 북스테이", layer: "book", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 송당6길 75", lat: 33.464825, lng: 126.783671, desc: "송당리에서 책이 있는 방에 오래 머물며 오름을 산책하는 한 달 살기형 숙소", kakao: "https://place.map.kakao.com/1571277383" },
  { name: "바언제주", layer: "class", area: "제주시 한경면", address: "제주특별자치도 제주시 한경면 녹차분재로 827-53", lat: 33.328976, lng: 126.243125, desc: "젊은 차 농부가 직접 만든 차 한 잔과 시향 공간, 책, 저녁 불멍이 있는 티 게스트하우스 숙소", kakao: "https://place.map.kakao.com/27202479" },
  { name: "오름게스트하우스", layer: "active", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 충렬로 147-19", lat: 33.50993, lng: 126.84659, desc: "매일 아침 오름투어를 나가고, 시골밥상 조식과 마당 장작 불멍을 즐기는 세화 시골집 숙소", insta: "https://www.instagram.com/oreum_gha/", kakao: "https://place.map.kakao.com/12389182" },
  { name: "송당온도", layer: "potluck", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 송당서3길 13", lat: 33.465926, lng: 126.770708, desc: "송당리에서 스냅 사진 촬영과 포틀럭, 불멍을 함께하는 숙소", kakao: "https://place.map.kakao.com/40411089" },
  { name: "각자의섬", layer: "rest", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 종달논길 82", lat: 33.490305, lng: 126.900496, desc: "종달리에서 1인 여행자가 각자의 방에서 조용히 쉬는 숙소", insta: "https://www.instagram.com/gakjasum/", kakao: "https://place.map.kakao.com/58879455" },
  { name: "소담소담 게스트하우스", layer: "class", area: "제주시 용담이동", address: "제주특별자치도 제주시 흥운길 63-4", lat: 33.514504, lng: 126.513258, desc: "공항 근처 바다 앞에서 5천 원 포틀럭과 타로 · 향수 만들기 체험을 즐기는 체험형 숙소", insta: "https://www.instagram.com/sodam._.sodam/", kakao: "https://place.map.kakao.com/256404578" },
  { name: "다랑들락", layer: "rest", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 종달로3길 33-17", lat: 33.49543, lng: 126.900933, desc: "종달리의 여성 전용 1~2인실에서 원하면 불멍을 하고 조식이 나오는 숙소", insta: "https://www.instagram.com/darangdeulrak_guesthouse/", kakao: "https://place.map.kakao.com/298136576" },
  { name: "구옥주택", layer: "potluck", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 위미중앙로300번길 24", lat: 33.272224, lng: 126.675828, desc: "위미리 시골집에서 카라반 저녁 식사, 불멍과 별멍, 아침 산책을 함께하는 숙소", insta: "https://www.instagram.com/guok_house/", kakao: "https://place.map.kakao.com/337021654" },
  { name: "제주지인게스트하우스", layer: "book", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 중산간동로 7126", lat: 33.283644, lng: 126.631077, desc: "마당 불멍과 포틀럭 뒤에 책방 '고요편지'와 함께 글을 쓰는 밤을 여는 숙소", kakao: "https://place.map.kakao.com/356696154" },
  { name: "테리구옥", layer: "active", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 조함해안로 38", lat: 33.54036, lng: 126.636971, desc: "조천 바닷가 구옥에서 러닝 · 물놀이 · 요가 · 별 보기를 함께하는 숙소", kakao: "https://place.map.kakao.com/358823569" },
  { name: "인기척", layer: "potluck", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 애월로9길 56", lat: 33.466468, lng: 126.318953, desc: "애월의 작은 게하로, 소규모 포틀럭과 작은 소주방, 강아지 '끼룩이'가 있는 숙소", insta: "https://www.instagram.com/ingichuck/", kakao: "https://place.map.kakao.com/805042576" },
  { name: "백번길 게스트하우스", layer: "potluck", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 동광로100번길 24 1층", lat: 33.303834, lng: 126.33898, desc: "동광리에서 물놀이 · 포틀럭 · 불멍을 하고 일주일~한 달 살기도 받는 쉐어하우스형 숙소", insta: "https://www.instagram.com/100beon_gil/", kakao: "https://place.map.kakao.com/897711357" },
  { name: "비지터 게스트하우스", layer: "potluck", area: "제주시 이도일동", address: "제주특별자치도 제주시 오현길 85 2-4층", lat: 33.512408, lng: 126.525169, desc: "동문시장 앞에서 무료 조식을 주고, 저녁 포틀럭은 원하는 사람만 참여하는 숙소", kakao: "https://place.map.kakao.com/982474850" },
  { name: "동양여관1938", layer: "rest", area: "제주시 삼도이동", address: "제주특별자치도 제주시 무근성7길 16-8", lat: 33.51404, lng: 126.520928, desc: "1938년 제주 첫 여관 자리를 살린, 혼자 여행하는 사람을 위한 원도심의 조용한 숙소", insta: "https://www.instagram.com/dongyang_inn_1938/", kakao: "https://place.map.kakao.com/8972766" },
  { name: "백패커스홈", layer: "potluck", area: "서귀포시 서귀동", address: "제주특별자치도 서귀포시 중정로 24-7 1층", lat: 33.247015, lng: 126.558981, desc: "서귀포 시내의 지중해풍 게하로, 수제맥주 펍과 야외 바비큐(예약), 조식이 있는 숙소", insta: "https://www.instagram.com/backpackers_home/", kakao: "https://place.map.kakao.com/24119779" },
  { name: "와락 게스트하우스", layer: "music", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 세평항로 45-4", lat: 33.527554, lng: 126.854779, desc: "세화해변 앞에서 120인치 스크린 영화와 책 1000권, 다락, 별빛투어를 즐기는 조용한 숙소", insta: "https://www.instagram.com/loft_john/", kakao: "https://place.map.kakao.com/24962244" },
  { name: "포비네오두막 게스트하우스", layer: "active", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 행원로4길 26", lat: 33.551513, lng: 126.805977, desc: "월정 코난비치 앞에서 스노클링 · 서핑 · 아침 오름투어를 하고 저녁엔 바비큐를 하는 숙소", insta: "https://www.instagram.com/2weeks_/", kakao: "https://place.map.kakao.com/25491474" },
  { name: "물고기자리 게스트하우스", layer: "rest", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 고내로9길 41", lat: 33.466735, lng: 126.337742, desc: "고내포구의 북유럽풍 공간에서 혼자서도 조용히 머물기 좋은 숙소", kakao: "https://place.map.kakao.com/26317143" },
  { name: "그리고세화", layer: "class", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 구좌로 149-9", lat: 33.521602, lng: 126.867095, desc: "세화에서 1인 여행자가 조식을 먹고 만들기 체험을 할 수 있는 숙소", kakao: "https://place.map.kakao.com/27579003" },
  { name: "초원게스트하우스", layer: "dinner", area: "제주시 우도면", address: "제주특별자치도 제주시 우도면 우도로 225", lat: 33.511797, lng: 126.951949, desc: "우도 초록 들판 한가운데에서 전복죽 조식과 옥상 풍경, 브런치 카페를 즐기는 숙소", kakao: "https://place.map.kakao.com/845062986" },
  { name: "봉자게스트하우스", layer: "rest", area: "제주시 우도면", address: "제주특별자치도 제주시 우도면 영일길 156-32", lat: 33.499984, lng: 126.967427, desc: "우도 산호해변 근처에서 마지막 배 시간에 맞춰 픽업해 주는 아담한 숙소", kakao: "https://place.map.kakao.com/31130941" },
  { name: "동문취향 게스트하우스", layer: "potluck", area: "제주시 일도일동", address: "제주특별자치도 제주시 관덕로15길 4", lat: 33.513616, lng: 126.526979, desc: "동문시장 앞 1인실에 머물며 저녁에 소규모 파티가 있는 숙소", kakao: "https://place.map.kakao.com/308459435" },
  { name: "어린왕자 게스트하우스", layer: "active", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 추사로36번길 45-6", lat: 33.253505, lng: 126.281562, desc: "대정의 넓은 마당에서 동물 먹이주기 체험을 하고 저녁에 여행자들과 식사를 나누는 숙소", kakao: "https://place.map.kakao.com/304605693" },
  { name: "도쉼 게스트하우스", layer: "potluck", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 종달로7길 8-1", lat: 33.491734, lng: 126.896978, desc: "종달리의 방 3개, 최대 6명이 소규모 포틀럭을 함께하는 숙소", kakao: "https://place.map.kakao.com/1185034726" },
  { name: "알멩이 게스트하우스", layer: "potluck", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 애월로7길 24-2", lat: 33.465619, lng: 126.318078, desc: "애월 시골집에서 소규모 포틀럭과 불멍을 하고, 사진도 찍어 주며 함께 러닝하는 숙소", kakao: "https://place.map.kakao.com/1425337784" },
  { name: "제주를그리다", layer: "active", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 와흘전1길 69-14", lat: 33.469521, lng: 126.638601, desc: "한라산과 바다가 보이는 중산간 통나무 별채에서 반딧불이 투어와 불멍 · 바비큐 '제주의 밤'을 즐기는 숙소", insta: "https://www.instagram.com/grida.jeju_/", kakao: "https://place.map.kakao.com/1437260115" },
  { name: "이호웨이브", layer: "potluck", area: "제주시 이호일동", address: "제주특별자치도 제주시 현사길 17-1 1,2층", lat: 33.496306, lng: 126.4494, desc: "이호테우해변 근처에서 저녁 포틀럭을 함께하는 숙소", insta: "https://www.instagram.com/jeju_ihowave_guesthouse/", kakao: "https://place.map.kakao.com/1465119339" },
  { name: "524 게스트하우스", layer: "potluck", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 월정중길 13", lat: 33.556628, lng: 126.791286, desc: "월정리 해변 근처 작은 객실 4개에서 조식과 저녁 포틀럭 · 불멍을 즐기는 숙소", insta: "https://www.instagram.com/524_guesthouse/", kakao: "https://place.map.kakao.com/1553682955" },
  { name: "조브라더스 게스트하우스", layer: "dinner", area: "제주시 한경면", address: "제주특별자치도 제주시 한경면 두모11길 46", lat: 33.357182, lng: 126.183503, desc: "두모리 바닷가에서 소규모 '오마카세' 저녁 자리와 윈드서핑 · 셀프사진관을 이어 주는 숙소", insta: "https://www.instagram.com/jo_brothers_/", kakao: "https://place.map.kakao.com/1575767002" },
  { name: "동행in협재", layer: "potluck", area: "제주시 한림읍", address: "제주특별자치도 제주시 한림읍 협재1길 27 1층", lat: 33.397688, lng: 126.243149, desc: "협재해수욕장 앞 조용한 골목에서 10명 안팎의 거실 파티와 불멍을 하는 숙소", insta: "https://www.instagram.com/donghaeng_in_hyeopjae/", kakao: "https://place.map.kakao.com/1692505974" },
  { name: "알롱스테이", layer: "rest", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 북촌14길 34 1층", lat: 33.547127, lng: 126.699428, desc: "북촌에서 여성 전용 1인실에 조용히 머무는 작은 숙소", insta: "https://www.instagram.com/alrongstay/", kakao: "https://place.map.kakao.com/1695264302" },
  { name: "제주동쪽", layer: "active", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 섭지코지로 54", lat: 33.437637, lng: 126.921716, desc: "섭지코지 근처에서 블루라군 계곡 투어, 일출 러닝, 와인 디너를 여는 숙소", insta: "https://www.instagram.com/jeju.east/", kakao: "https://place.map.kakao.com/1740862870" },
  { name: "삶다수", layer: "potluck", area: "제주시 용담이동", address: "제주특별자치도 제주시 용문로18길 11-2", lat: 33.507165, lng: 126.510569, desc: "혼자 온 6명만 머물며 저녁 포틀럭에 원하는 만큼 어울리는 1인실 숙소", insta: "https://www.instagram.com/sarmdasu/", kakao: "https://place.map.kakao.com/1746643848" },
  { name: "자유로운사색가", layer: "active", area: "서귀포시 대포동", address: "제주특별자치도 서귀포시 대포로 132", lat: 33.239153, lng: 126.434971, desc: "올레 8코스 근처에서 스노클링 장비를 무료로 빌려주고 노래방 · 게임기도 있는 숙소", kakao: "https://place.map.kakao.com/1862029553" },
  { name: "막내돼지", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 함덕28길 9-14", lat: 33.538269, lng: 126.676255, desc: "함덕의 벽돌집에서 조식과 포틀럭, 사우나를 즐기는 숙소", insta: "https://www.instagram.com/maknae_pig/", kakao: "https://place.map.kakao.com/1880577764" },
  { name: "무감각", layer: "potluck", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 면수2길 7", lat: 33.522033, lng: 126.86833, desc: "세화에서 소규모 포틀럭을 함께하는 작은 숙소", insta: "https://www.instagram.com/mugamgak_jeju/", kakao: "https://place.map.kakao.com/2130946741" },
  { name: "샘나도", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 조천4길 8 1층", lat: 33.534285, lng: 126.632449, desc: "조천의 소규모 도미토리에서 고양이 · 강아지와 함께 포틀럭을 하는 숙소", kakao: "https://place.map.kakao.com/769712412" },
  { name: "레트로빌리지 노스컨츄리", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 북촌12길 1 1층", lat: 33.548488, lng: 126.697098, desc: "북촌에서 추가 비용 없이 포틀럭과 불멍을 함께하는 작은 숙소", insta: "https://www.instagram.com/retrovillage_jejudo/", kakao: "https://place.map.kakao.com/676997163" },
  { name: "빵가네 게스트하우스", layer: "potluck", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 남조로 573-16", lat: 33.328695, lng: 126.710985, desc: "남원 중산간에서 저녁 불멍과 소박한 집밥 자리가 있는 숙소", kakao: "https://place.map.kakao.com/643443542" },
  { name: "필제주 게스트하우스", layer: "potluck", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 중산간동로 5756 1층", lat: 33.321198, lng: 126.749445, desc: "남원에서 저녁 바비큐와 불멍을 함께하는 숙소", kakao: "https://place.map.kakao.com/539127228" },
  { name: "피크엔드", layer: "potluck", area: "제주시 도두일동", address: "제주특별자치도 제주시 서해안로 135 2층", lat: 33.502947, lng: 126.463947, desc: "공항 근처에서 소규모 포틀럭을 하고 함께 러닝도 하는 숙소", insta: "https://www.instagram.com/peak.end/", kakao: "https://place.map.kakao.com/506277918" },
  { name: "스테이튠", layer: "potluck", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 성산중앙로 43 1-2층", lat: 33.463708, lng: 126.933512, desc: "성산일출봉 근처에서 저녁 포틀럭과 불멍을 함께하는 숙소", kakao: "https://place.map.kakao.com/460032865" },
  { name: "소수인 게스트하우스", layer: "active", area: "서귀포시 성산읍", address: "제주특별자치도 서귀포시 성산읍 한도로242번길 8 2층", lat: 33.466066, lng: 126.932852, desc: "비즈공예와 밤수영을 함께하고 우도투어까지 이어 주는 성산의 작은 숙소", insta: "https://www.instagram.com/jeju_few_people/", kakao: "https://place.map.kakao.com/1346461541" },
  { name: "금능630 게스트하우스", layer: "rest", area: "제주시 한림읍", address: "제주특별자치도 제주시 한림읍 한림로 221", lat: 33.386976, lng: 126.231222, desc: "금능해수욕장 앞 제주 옛집에서 파티 없이 조용히 머물고 아침 요가를 다니기 좋은 숙소", insta: "https://www.instagram.com/geumneung630_guest_house/", kakao: "https://place.map.kakao.com/557626904" },
  { name: "또랑 게스트하우스", layer: "active", area: "제주시 아라일동", address: "제주특별자치도 제주시 한북로 338", lat: 33.455143, lng: 126.549472, desc: "한라산 등반객을 위해 픽업 · 드랍과 등산 장비 대여, 조식을 챙겨 주는 숙소", kakao: "https://place.map.kakao.com/577536050" },
  { name: "오누이 게스트하우스", layer: "dinner", area: "서귀포시 남원읍", address: "제주특별자치도 서귀포시 남원읍 위미해안로90번길 20", lat: 33.270924, lng: 126.654989, desc: "위미리에서 하루 6명만 받아 매일 바뀌는 음식을 내는 숙소", insta: "https://www.instagram.com/onui_g.h_wimi/", kakao: "https://place.map.kakao.com/944786123" },
  { name: "세화비치스테이", layer: "potluck", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 상도북4길 3", lat: 33.520814, lng: 126.865077, desc: "세화해변 앞에서 저녁마다 '불턱토크' 대화 모임을 여는 숙소", kakao: "https://place.map.kakao.com/896587129" },
  { name: "안녕함덕", layer: "potluck", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 함덕로 10", lat: 33.540975, lng: 126.673726, desc: "함덕 바다 근처에서 저녁 6시 바비큐와 불멍을 하고, 3층 혼술바가 있는 숙소", insta: "https://www.instagram.com/hihamdeok/", kakao: "https://place.map.kakao.com/1128780110" },
  { name: "하늘아래 게스트하우스", layer: "rest", area: "서귀포시 표선면", address: "제주특별자치도 서귀포시 표선면 세성로 123-24", lat: 33.315124, lng: 126.800923, desc: "표선 세화리의 예쁜 정원과 조식이 있는 아주 조용한 숙소", kakao: "https://place.map.kakao.com/17944729" },
  { name: "꿈꾸는섬 게스트하우스", layer: "rest", area: "제주시 조천읍", address: "제주특별자치도 제주시 조천읍 조천3길 27-1", lat: 33.535922, lng: 126.634836, desc: "올레 18 · 19코스가 만나는 곳에서 조식과 함께 조용히 머무는 숙소", kakao: "https://place.map.kakao.com/16813846" },
  { name: "레몬트리 게스트하우스", layer: "dinner", area: "서귀포시 대정읍", address: "제주특별자치도 서귀포시 대정읍 하모항구로 70", lat: 33.219653, lng: 126.251362, desc: "모슬포항에서 10첩 반상이 넘는 조식을 무료로 차려 주는, 올레 10 · 11코스 가까운 숙소", kakao: "https://place.map.kakao.com/19333664" },
  { name: "청춘연가", layer: "dinner", area: "제주시 애월읍", address: "제주특별자치도 제주시 애월읍 애월해안로 670", lat: 33.481042, lng: 126.373951, desc: "애월 바다 바로 앞에서 매일 저녁 7시 고기 디너와 불멍을 함께하는 숙소", insta: "https://www.instagram.com/chungchun_yeonga/", kakao: "https://place.map.kakao.com/1035932143" },
  // 팀이 원래 넣으려던 특색 게스트하우스
  { name: "제주도 조용한 게스트하우스", layer: "rest", area: "서귀포시 안덕면", address: "제주특별자치도 서귀포시 안덕면 덕수회관로87번길 34", lat: 33.253359, lng: 126.304768, desc: "파티 없이 1인 여행객만 머물고, 밤 11시면 칼같이 불을 끄는 조용한 숙소", insta: "https://www.instagram.com/ho.stel", kakao: "https://place.map.kakao.com/1826359728" },
  { name: "마음스테이 게스트하우스", layer: "music", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 평대13길 44", lat: 33.526222, lng: 126.854071, desc: "평대리에서 LP 음악을 들으며 쉬어 가는 숙소", kakao: "https://place.map.kakao.com/583907592" },
  { name: "이상한밤 게스트하우스", layer: "active", area: "제주시", address: "제주특별자치도 제주시 흥운길 25-7", lat: 33.511163, lng: 126.511167, desc: "게스트하우스 안에서 방탈출 게임을 즐기는 이색 숙소", kakao: "https://place.map.kakao.com/940751858" },
  { name: "친구네다락방", layer: "potluck", area: "제주시", address: "제주특별자치도 제주시 월랑로6길 36", lat: 33.490248, lng: 126.479791, desc: "친구 집 다락방 같은 공간에서 포틀럭 파티를 함께하는 숙소", insta: "https://www.instagram.com/jeju_friendshouse", kakao: "https://place.map.kakao.com/899429558" },
  { name: "게으른소나기", layer: "rest", area: "제주시 구좌읍", address: "제주특별자치도 제주시 구좌읍 계룡길 45-6", lat: 33.538743, lng: 126.833852, desc: "비건 조식과 CD 음악, 해먹에서 느긋하게 쉬어 가는 숙소", kakao: "https://place.map.kakao.com/22664797" },
];
