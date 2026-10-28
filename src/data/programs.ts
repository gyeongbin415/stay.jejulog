import type { Program, ProgramReport } from './types';

/* ------------------------------------------------------------------
   아홉 가지 게하 사용법 — 콘텐츠 데이터

   ▣ 취재를 마친 뒤 바꿀 곳
     1. report.sample      → false
     2. report.place / visit / experience / atmosphere / moment
     3. report.info[].value (운영 정보)  · detailUrl · bookingUrl
     4. hero.src / gallery[].src  → public/photos/ 에 사진을 넣고 'photos/파일명.jpg'

   ▣ 비어 있는 칸은 화면에 '취재 후 입력' 빈 페이지로 표시됩니다.
     임의의 후기를 지어 넣지 말고, 실제 취재 내용만 채워 주세요.
------------------------------------------------------------------- */

const SAMPLE_GUIDE = {
  experience:
    '도착한 시각과 첫인상 → 프로그램이 시작되기까지 → 진행 순서와 에디터가 직접 한 일 → 함께한 사람들 → 끝나고 남은 감정. 3~4문단, 문단당 2~4문장.',
  atmosphere: '빛, 소리, 냄새, 가구와 재질 중 두세 가지를 골라 구체적으로. 2~3문장.',
  moment: '가장 오래 기억에 남은 장면 하나를 한두 문장으로. 큰따옴표 인용 가능.',
};

function emptyReport(examples: { schedule: string; duration: string; price: string; capacity: string }): ProgramReport {
  return {
    sample: true,
    place: { name: '', area: '', address: '' },
    visit: { date: '', editor: '', photographer: '' },
    experience: [],
    atmosphere: '',
    moment: '',
    info: [
      { label: '위치', value: '', example: '제주시 ○○읍 ○○리 (해안도로에서 도보 5분)' },
      { label: '프로그램 운영', value: '', example: examples.schedule },
      { label: '소요 시간', value: '', example: examples.duration },
      { label: '참가비', value: '', example: examples.price },
      { label: '정원', value: '', example: examples.capacity },
      { label: '예약 방법', value: '', example: '숙박 예약 시 프로그램 함께 신청 / 인스타그램 DM' },
      { label: '문의', value: '', example: '@guesthouse_id · 064-000-0000' },
    ],
    detailUrl: '',
    bookingUrl: '',
  };
}

export const PROGRAMS: Program[] = [
  {
    id: 'running',
    pageId: 'A-01',
    no: '04',
    en: 'RUNNING',
    title: '제주의 바다를 달리는 방법',
    verb: '달리다',
    kicker: '체크인 다음 일정은, 러닝화 끈을 묶는 일.',
    intro:
      '게스트하우스 스태프 시절이 오래도록 기억에 남았다는 사장님. 그 경험을 여행자들과 나누고 싶어 숙소를 열었다. 자연스러운 만남을 위해 저녁 식사와 와인, 아침 해안가 러닝, 낮 티 타임을 마련했다. 모든 프로그램은 자율 참여다.',
    forWhom: [
      '부담 없는 교류를 즐기고 싶은 분',
      '와인과 함께 여유로운 저녁을 즐기고 싶은 분',
      '제주 바다를 따라 아침 러닝을 즐기고 싶은 분',
    ],
    hint: '화면을 누를 때마다 한 걸음씩, 제주의 아침이 밝아옵니다.',
    tryLabel: '새애월 들여다보기',
    hero: { src: 'photos/saewol-exterior-v2.jpg', art: 'road', alt: "외벽에 'SAE AEWOL' 글자가 크게 적힌 2층 갈색 건물", caption: '새애월' },
    gallery: [
      { art: 'shoe', alt: '현관에 나란히 놓인 러닝화 (샘플 이미지)', caption: '06:10 — 출발 전 현관' },
      { art: 'coast-dawn', alt: '돌담 너머로 해가 떠오르는 바다 (샘플 이미지)', caption: '반환점에서 본 바다' },
      { art: 'stone-house', alt: '러닝을 마치고 돌아온 돌담 숙소 (샘플 이미지)', caption: '다시 숙소로' },
    ],
    layout: 'horizon',
    tone: { paper: '#F0EBE2', ink: '#36322F', accent: '#B6705A' },
    type: 'adventurer',
    report: {
      ...emptyReport({
        schedule: '아침 러닝 & 바다 수영 08:30 · 와인 디너 & 불멍 19:30 · 티 타임 12:00',
        duration: '',
        price: '아침 러닝 & 바다 수영 · 티 타임 별도 참가비 없음 · 와인 디너 & 불멍 30,000원',
        capacity: '',
      }),
      sample: false,
      place: { name: '새애월', area: '제주시 애월읍', address: '제주특별자치도 제주시 애월읍 애월로4길 18' },
      join: {
        who: '와인 디너 파티는 숙박하지 않아도 참여할 수 있어요. 아침 러닝은 신청한 사람만 함께 달려요.',
        how: '파티만 참여하려면 인스타그램 DM이나 전화로 미리 문의해요. 숙소 예약은 네이버에서 ‘새애월’을 검색하면 돼요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/sae_aewol/' }],
      },
      oneLine: '와인으로 물드는 저녁, 바닷바람으로 시작하는 아침을 만날 수 있는 숙소',
      programs: [
        {
          name: '아침 러닝 & 바다 수영',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오전 8시 30분 (논의 후 조정 가능)' }],
          photo: { src: 'photos/saewol-run-v3.jpg', art: 'coast-dawn', alt: '풍력발전기가 줄지어 선 바다를 옆에 두고 해안 산책로 난간을 따라 나란히 달리는 게스트 세 명 (얼굴 흐림 처리)', caption: '애월 해안가 러닝' },
          text: ['아침에는 게스트들과 애월 해안가를 달리며 하루를 시작한다. 바닷바람을 맞으며 제주의 풍경을 즐기고, 러닝을 마친 뒤에는 날씨에 따라 바다 수영도 경험할 수 있다. 함께 달리며 자연스럽게 이야기를 나누고, 색다른 방식으로 제주에서의 아침을 맞이하는 시간이다.'],
          note: '바다 수영은 날씨 및 해상 상황에 따라 진행 여부 변동 가능',
        },
        {
          name: '와인 디너 & 불멍',
          info: [{ label: '가격', value: '30,000원' }, { label: '시간', value: '오후 7시 30분' }],
          photos: [
            { src: 'photos/saewol-dinner-v2.jpg', art: 'table', alt: '밤 잔디 마당의 식탁 위 와인 디캔터와 와인잔, 빵 바구니, 물병, 그 옆 접이식 의자에서 잠든 고양이', caption: '마당에서의 디너' },
            { src: 'photos/saewol-fire.jpg', art: 'campfire', alt: '모닥불 위로 꼬치에 꽂은 마시멜로를 굽는 손들', caption: '식사 후 불멍' },
          ],
          text: ['사장님이 직접 준비한 양식 디너와 와인을 즐기며 처음 만난 게스트들과 자연스럽게 가까워지는 시간이다. 날씨가 좋은 날에는 마당에서 저녁 식사를 즐기고, 식사 후에는 모닥불 앞에서 불멍을 하며 이야기를 나눈다. 제주의 밤을 여유롭게 마무리할 수 있다.'],
        },
        {
          name: '티 타임',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오후 12시' }],
          photo: { src: 'photos/saewol-tea-v3.jpg', art: 'table', alt: '돌담이 보이는 창가 나무 테이블에 둘러앉아 차를 마시며 이야기를 나누는 게스트들 (얼굴 흐림 처리)', caption: '체크아웃 후 티 타임' },
          text: ['체크아웃 후 게스트들이 함께 모여 사장님이 준비한 차를 마시며 이야기를 나누는 시간이다. 참여는 자유로우며, 제주에서의 경험과 앞으로의 여행 계획을 편하게 공유할 수 있다. 대화를 나누다 마음이 맞으면 이후의 여행을 함께하기도 한다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'cinema',
    pageId: 'A-02',
    no: '09',
    en: 'CINEMA',
    title: '스크린을 통해 몰입을 찾는 방법',
    verb: '바라보다',
    kicker: '불이 꺼지는 순간, 낯선 사람들과 같은 장면을 본다.',
    intro:
      '시끌벅적한 분위기보다 조용한 휴식을 선물하고 싶었던 사장님. 게스트들이 매일 저녁 영화 한 편을 함께 감상하며 하루를 마무리하고, 잠시 여행의 피로를 내려놓으며 편안하게 쉬어갈 수 있는 공간을 만들었다.',
    forWhom: [
      '제주에서 무료 영화관을 즐기고 싶은 분',
      '함께 영화를 보고 감상을 나누고 싶은 분',
      '시끌벅적한 밤보다 잔잔한 휴식이 좋은 분',
    ],
    hint: '상영 시작 버튼을 누르면 조명이 꺼집니다.',
    tryLabel: '쉼게스트하우스 들여다보기',
    hero: {
      src: 'photos/shym-exterior-v2.jpg',
      art: 'cinema',
      alt: "돌담에 'JEJUSHYM' 글자가 붙은 쉼게스트하우스의 흰 건물과 잔디 마당",
      caption: '쉼게스트하우스',
    },
    gallery: [
      { art: 'window', alt: '상영 전, 빛이 드는 라운지 (샘플 이미지)', caption: '상영 두 시간 전의 라운지' },
      { art: 'sea-night', alt: '상영이 끝난 뒤 바라본 밤바다 (샘플 이미지)', caption: '크레딧이 끝난 뒤' },
    ],
    layout: 'theater',
    tone: { paper: '#2C2A28', ink: '#F0EBE0', accent: '#C37962' },
    type: 'keeper',
    report: {
      ...emptyReport({ schedule: '매일 오후 8시', duration: '', price: '별도 참가비 없음', capacity: '' }),
      sample: false,
      place: { name: '쉼게스트하우스', area: '제주시 한림읍', address: '제주특별자치도 제주시 한림읍 옹포2길 30' },
      join: {
        who: '영화 상영은 투숙객을 위한 프로그램이에요.',
        how: '보고 싶은 영화를 보드에 적어 신청하면 저녁 8시에 상영이 시작돼요. 숙소 예약은 네이버 예약으로 받아요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/jejushym/' }],
      },
      oneLine: '매일 저녁, 작은 영화관에서 게스트들과 영화 한 편을 함께 감상할 수 있는 숙소',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '작은 영화관',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오후 8시' }],
          photo: { src: 'photos/shym-cinema-v2.jpg', art: 'cinema', alt: '촛불 켜진 어두운 상영실에서 큰 스크린으로 영화를 보는 모습, 창밖으로 불빛 비치는 나무', caption: '매일 밤의 작은 영화관' },
          text: ['매일 저녁 8시 최대 9명이 함께하는 작은 영화관에서 무료 상영이 시작된다. 보고 싶은 영화를 신청하면 사장님이 한 편을 골라 대형 스크린에 올린다. 상영 후에는 인상 깊었던 장면을 이야기하거나 각자의 감상을 간직하며 조용히 밤을 마무리할 수 있다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'flower',
    pageId: 'A-03',
    no: '02',
    en: 'FLOWER',
    title: '꽃으로 하루를 채우는 방법',
    verb: '만들다',
    kicker: '꽃병보다 먼저, 손끝이 계절을 알아차린다.',
    intro:
      '게스트하우스 라운지 한쪽을 작은 꽃집으로 꾸민 사장님. 혼자 온 여행자들에게 제주의 꽃을 만지며 온전히 쉬어가는 시간을 선물하고 싶었다. 여기에 마을 주민과 손잡고 대중교통으로 가기 힘든 오름 일출 투어까지 더했다.',
    forWhom: [
      '혼자서 조용한 휴식을 즐기고 싶은 분',
      '관광지보다 소소한 힐링을 좋아하는 분',
      '고양이를 좋아하는 분',
    ],
    hint: '마음에 드는 꽃을 골라 나만의 작은 꽃다발을 완성해 보세요.',
    tryLabel: '코코코 들여다보기',
    hero: { src: 'photos/kokoko-sign-v2.jpg', art: 'flower', alt: "흰 나무 외벽에 걸린 '코코코 Guest House' 간판", caption: '코코코 게스트하우스' },
    gallery: [
      { art: 'window', alt: '꽃꽂이 작업대에 드는 오후의 빛 (샘플 이미지)', caption: '작업대 위의 오후' },
      { art: 'oreum', alt: '꽃을 구해 오는 오름 아래 들판 (샘플 이미지)', caption: '들풀이 자라는 곳' },
      { art: 'stone-house', alt: '완성한 꽃을 둔 객실 창가 (샘플 이미지)', caption: '객실 창가에' },
    ],
    layout: 'prints',
    tone: { paper: '#E7E3DC', ink: '#403C39', accent: '#B6705A' },
    type: 'maker',
    report: {
      ...emptyReport({ schedule: '꽃꽂이 클래스 · 오름 일출 투어', duration: '꽃꽂이 1시간', price: '꽃꽂이 25,000원 · 오름 일출 투어 28,000원', capacity: '' }),
      sample: false,
      place: { name: '코코코', area: '제주시 구좌읍', address: '제주특별자치도 구좌읍 상하도길 44-1' },
      join: {
        who: '꽃 수업은 월~토 오후 2시, 예약하면 체험할 수 있어요. 오름 일출 투어는 투숙객이 미리 예약해 참여해요.',
        how: '클래스 신청과 문의는 인스타그램 DM으로 받아요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/cococolife/' }],
      },
      oneLine: '아침으로 간단한 조식이 제공되며 여성이 안심하고 편안하게 머물 수 있는 1인실 숙소',
      programs: [
        {
          name: '꽃꽂이 클래스',
          info: [{ label: '가격', value: '25,000원' }, { label: '시간', value: '1시간 소요' }],
          photo: { src: 'photos/kokoko-flower.jpg', art: 'flower', alt: '라운지 테이블 위 거베라와 카네이션 꽃다발 옆에서 잠든 고양이', caption: '라운지의 꽃과 고양이' },
          text: ['계절마다 피어나는 제주의 꽃으로 나만의 꽃바구니를 만들어 보는 시간. 숙박을 하면 클래스 비용의 50%를 할인받을 수 있다. 꽃 한 송이 한 송이를 다듬고 조합하다 보면 일상의 복잡한 생각도 잠시 잊게 된다. 진행되는 동안에는 고양이 세 마리가 곁을 지켜준다.'],
        },
        {
          name: '오름 일출 투어',
          info: [{ label: '가격', value: '28,000원' }, { label: '시간', value: '시간 조율' }],
          photo: { src: 'photos/kokoko-sunrise-v3.jpg', art: 'oreum', alt: '오름 위에서 해가 떠오르는 하늘과 바다를 바라보는 여행자', caption: '오름 위에서 맞는 아침' },
          text: ['이른 아침, 제주에서 가이드 일을 전문적으로 하고 있는 마을 주민분과 함께 일출이 아름다운 오름에 오르는 프로그램이 준비되어 있다. 제주에서 새벽을 맞이하는 특별함을 느낄 수 있으며 아름다운 풍경은 물론 제주만의 일상과 분위기를 가까이에서 느껴볼 수 있다.'],
        },
      ],
      editorProfile: {
        title: '혼자만의 시간도 중요한 에디터',
        avatar: 'photos/editor-flower-v5.jpg',
        tags: ['조용한여행', '소소한대화', '여유로운일정'],
        about: ['사람이 붐비는 곳보다는 조용하고 한적한 분위기를 선호해요. 적당한 계획 속에서 혼자만의 시간을 여유롭게 보내고, 가끔은 소소한 대화도 좋아해요.'],
      },
      experience: [
        '마치 시간이 천천히 흐르는 듯한 고요한 분위기가 매력적인 곳이었어요. 북적이는 관광지에서 벗어나 혼자만의 여유를 즐기며 온전히 나에게 집중할 수 있었답니다.',
        '스태프분의 정성이 담긴 조식부터 꽃꽂이 클래스, 마을 주민과 함께하는 오름 일출 감상까지 다양한 프로그램 속에서도 혼자만의 휴식과 특별한 경험을 모두 누릴 수 있어 더욱 기억에 남는 숙소였어요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'lp',
    pageId: 'A-04',
    no: '01',
    en: 'LP',
    title: 'LP로 제주의 밤을 즐기는 방법',
    verb: '듣다',
    kicker: '바늘이 내려앉는 소리로, 밤이 시작된다.',
    intro:
      '여행과 자유를 좋아하는 사장님은 게스트하우스에서 더 넓은 세상을 만났습니다. 평소 LP 음악을 즐겨 듣고 수집해 온 사장님의 취향을 담아 서론을 꾸렸습니다. 이곳에서는 여행자들이 음악을 함께 듣고 자연스럽게 가까워집니다.',
    forWhom: [
      'LP로 색다른 음악 감상을 즐기고 싶은 분',
      '아날로그 감성과 아늑한 공간을 좋아하는 분',
      '음악을 통해 새로운 사람과 교류하고 싶은 분',
    ],
    hint: '톤암을 끌어 레코드 위에 올려 보세요. 키보드 방향키로도 움직일 수 있습니다.',
    tryLabel: '서론 게스트하우스 들여다보기',
    hero: { src: 'photos/seoron-exterior-v2.jpg', art: 'lp', alt: "붉은 벽돌 벽에 걸린 원형 나무 간판. 흰 글씨로 '서론'과 '@seolon_zip'이 새겨져 있다", caption: '서론 게스트하우스' },
    gallery: [
      { art: 'window', alt: '레코드 선반이 있는 라운지 (샘플 이미지)', caption: '선반 앞에서 한참' },
      { art: 'sea-night', alt: '라운지 창밖의 밤 (샘플 이미지)', caption: 'B면이 끝날 무렵' },
    ],
    layout: 'sleeve',
    tone: { paper: '#E6DECD', ink: '#2E2A24', accent: '#B46750' },
    type: 'collector',
    report: {
      ...emptyReport({ schedule: 'LP 청음 매일 18:00 · 리스닝 모임 격월', duration: '', price: 'LP 청음 별도 참가비 없음 · 리스닝 모임 회차별 별도 공지', capacity: '' }),
      sample: false,
      place: { name: '서론 게스트하우스', area: '서귀포시 안덕면', address: '제주 서귀포시 안덕면 사계신항로39번길 17-13 1층' },
      join: {
        who: '리스닝 모임은 숙박과 저녁 식사가 포함된 패키지로 운영되고, 만 20세부터 만 38세까지 이용할 수 있어요 (2026년 10월 회차 안내 기준).',
        how: '회차마다 열리는 신청 폼을 작성하고 참가비를 입금한 뒤, 확정 문자를 받으면 예약이 끝나요. 문의는 인스타그램 DM으로 받아요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/seolon_zip/' }],
      },
      oneLine: 'LP를 감상하며 사람들과 취향을 나누고, 제주의 밤을 느긋하게 즐길 수 있는 숙소',
      programs: [
        {
          name: 'LP 청음',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오후 6시' }],
          photo: { src: 'photos/seoron-lp.jpg', art: 'lp', alt: '조명이 켜진 나무 선반에 LP 앨범이 진열되어 있고, 그 아래 턴테이블 오디오가 놓인 청음 공간', caption: 'LP 청음 공간' },
          text: ['매일 저녁 6시, 소음에서 벗어나 음악에 집중하는 LP 청음 시간입니다. 듣고 싶은 곡은 사장님께 신청해 LP로 감상할 수 있습니다. 이어폰으로 듣던 익숙한 노래도 LP 특유의 따뜻한 음색으로 새롭게 다가옵니다. 좋아하는 음악을 깊이 즐길 수 있는 시간입니다.'],
        },
        {
          name: '리스닝 모임',
          info: [{ label: '일정', value: '격월 진행 (두 달에 한 번)' }, { label: '가격', value: '회차별 별도 공지' }],
          photo: { src: 'photos/seoron-listening-v2.jpg', art: 'lp', alt: '갈색 벽에 나무 받침으로 두 줄 진열된 LP 앨범 재킷 여섯 장', caption: '벽에 진열된 LP 앨범', ratio: '7 / 5' },
          text: ['두 달에 한 번 열리는 리스닝 모임은 한 명의 뮤지션을 주제로 음악을 감상하는 프로그램입니다. 해당 뮤지션의 곡을 함께 듣고 느낀 점을 나누며 서로의 음악 취향을 알아갑니다. 제주에서 처음 만난 여행자들도 음악이라는 공통점으로 자연스럽게 가까워지는 시간입니다.'],
        },
      ],
      editorProfile: {
        title: '아날로그 감성을 즐기는 에디터',
        avatar: 'photos/editor-lp-v5.jpg',
        tags: ['낭만여행', '음악감상', '아날로그감성'],
        about: ['여행에서는 감성적인 공간을 찾아가 낭만 있는 시간을 보내는 걸 좋아해요. 쉬거나 이동할 때 음악을 즐겨 듣고, 아날로그 감성을 좋아해요.'],
      },
      experience: [
        '이어폰으로 듣던 노래를 LP로 감상하니 익숙한 음악도 새롭게 느껴졌어요. 음악에 집중할 수 있는 분위기가 인상적이었고, 좋아하는 노래를 들으며 여유를 즐길 수 있어 좋았어요.',
        '실제 주택 형태의 숙소라 집처럼 아늑했고, 피규어와 만화책도 있어 구경하는 재미가 있었어요. 술은 밤 10시 30분까지만 마실 수 있어, 이후에는 술자리보다 이야기에 집중할 수 있다는 점도 좋았어요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'book',
    pageId: 'A-05',
    no: '08',
    en: 'BOOK',
    title: '낯선 사람과 책으로 이야기를 나누는 방법',
    verb: '읽다',
    kicker: '여행지에서 읽은 문장은, 다른 온도로 남는다.',
    intro:
      '10년 전 서른 살이던 사장님과 스물일곱 살 남동생이 연애 팁을 얻어보자며 소박하게 시작했던 자리가, 이제는 매일 저녁 10명 안팎의 낯선 여행자가 둘러앉아 사랑과 속마음을 서로 솔직하게 털어놓는 시간이 되었다.',
    forWhom: [
      '혼자라서 오히려 말문이 트이는 분',
      '나이·직업 없이 나로서 이야기해 보고 싶은 분',
      '사랑이 왜 이렇게 어려운지 고민인 분',
    ],
    hint: '책장을 넘기면 에디터의 공간 기록이 나타납니다.',
    tryLabel: '서점숙소 들여다보기',
    // 간판(서점숙소 @bookhome)이 사진 오른쪽 아래에 있어 — 휴대폰(좌우가 잘림)은 오른쪽, 웹(위아래가 잘림)은 아래쪽 기준으로 글씨가 다 보이게
    hero: { src: 'photos/bookhome-sign-v2.jpg', focus: '80% 78%', art: 'book', alt: "흰 외벽에 그려진 '서점숙소 @bookhome' 로고와 파란 하늘", caption: '서점숙소' },
    gallery: [
      { art: 'window', alt: '책방 겸 라운지에 드는 오후의 빛 (샘플 이미지)', caption: '오후 세 시의 책장' },
      { art: 'stone-house', alt: '돌담 안쪽의 작은 책방 입구 (샘플 이미지)', caption: '책방 입구' },
    ],
    layout: 'prints',
    tone: { paper: '#F0EADE', ink: '#383532', accent: '#B6705A' },
    type: 'collector',
    report: {
      ...emptyReport({ schedule: "대화 모임 ‘오름에게’ 20:00 · 북바인딩 클래스 17:00 / 11:00 (택 1)", duration: '', price: '대화 모임 별도 참가비 없음 · 북바인딩 클래스 28,000원', capacity: '' }),
      sample: false,
      place: { name: '서점숙소', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 북촌14길 13-12' },
      join: {
        who: '대화 모임 ‘오름에게’는 매일 저녁 8시에 열려요.',
        how: '모임은 당일 문자로 신청하고, 보통 2명 이상 모이면 진행돼요 (방문 후기 기준). 숙소 예약은 네이버 예약으로 받아요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/jejubookhome/' }, { label: '공식 블로그', url: 'https://blog.naver.com/jejubookhome' }],
      },
      oneLine: '책을 매개로 낯선 사람들과 다양한 사랑에 대해 이야기 나눌 수 있는 숙소',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '대화 모임 ‘오름에게’',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오후 8시' }],
          photo: { src: 'photos/bookhome-library.jpg', art: 'book', alt: '책이 가득 꽂힌 서재와 창가 옆 긴 나무 테이블', caption: '대화 모임이 열리는 서재' },
          text: ['매일 저녁 8시 공용공간 서재 앞에서 진행하는 대화 모임으로, 40분간 책을 읽고 필사한 뒤 돌아가며 낭독하고 이야기를 나누는 프로그램. 낭독으로 시작된 이야기를 이어 혼자 온 낯선 이들과 사랑을 큰 주제로 삶과 나에 대한 대화를 나눌 수 있다.'],
          note: '신청 인원 3명 이상일 경우 진행되며, 신청 인원 미만이면 취소될 수 있음',
        },
        {
          name: '북바인딩 클래스',
          info: [{ label: '가격', value: '28,000원' }, { label: '시간', value: '오후 5시, 오전 11시 (택 1)' }],
          photo: { src: 'photos/bookhome-binding.jpg', art: 'book', alt: '서재 앞에서 손에 든 사진 표지의 수제 필사 노트', caption: '직접 만든 필사 노트' },
          text: ['약 1시간 동안 진행하는 북바인딩 클래스로, 여러 엽서와 사진 중 마음에 드는 것을 골라 잘라 표지로 쓰고, 원하는 색 실로 직접 엮어 나만의 필사노트를 만드는 프로그램. 완성한 노트의 표지는 나중에 내가 찍은 사진으로 바꿀 수도 있다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'craft',
    pageId: 'A-06',
    no: '03',
    en: 'CRAFT',
    title: '내 손끝에서 깎여 나가는 여행의 잡념',
    verb: '만들다',
    kicker: '손이 바빠지면, 마음은 느려진다.',
    intro:
      '좋아하는 일에 집중하고 싶어 제주에서 목공을 시작한 사장님. 나무를 깎고 반지를 만드는 즐거움을 여행객들과도 나누고 싶어 스르르의 나무반지 공방을 열었다.',
    forWhom: [
      '숙박을 넘어 특별한 체험까지 즐기고 싶은 분',
      '하루쯤은 새로운 취미에 푹 빠져보고 싶은 분',
      '여행의 순간을 나만의 반지로 남기고 싶은 분',
    ],
    hint: '나무 위를 문지르듯 드래그해 반지를 다듬어 보세요.',
    tryLabel: '스르르 게스트하우스 들여다보기',
    hero: {
      src: 'photos/srr-sign-v2.jpg',
      art: 'ring',
      alt: "'스르르 Guest House · 우주공간 나무반지 공방'이라고 적힌 나무 간판",
      caption: '스르르 게스트하우스 · 우주공간 나무반지 공방',
    },
    gallery: [
      { art: 'workbench', alt: '나무 부스러기가 남은 작업대 (샘플 이미지)', caption: '깎기' },
      { art: 'window', alt: '공방 창으로 드는 오후 빛 (샘플 이미지)', caption: '다듬기' },
      { art: 'ring', alt: '오일을 바른 나무반지 (샘플 이미지)', caption: '마무리' },
    ],
    layout: 'process',
    tone: { paper: '#EAE2D3', ink: '#33302A', accent: '#B6705A' },
    type: 'maker',
    report: {
      ...emptyReport({ schedule: '11:00 · 13:00 · 15:00 (택 1)', duration: '1시간 ~ 1시간 30분', price: '29,000원', capacity: '' }),
      sample: false,
      place: { name: '스르르 게스트하우스', area: '서귀포시 호근동', address: '제주특별자치도 서귀포시 일주동로 8867' },
      join: {
        who: '나무반지 클래스는 숙박하지 않아도 참여할 수 있어요. 일반 참가비는 32,000원이고, 스르르 게스트하우스 투숙객은 29,000원으로 할인돼요.',
        how: '공방 ‘우주공간’에 네이버 예약이나 전화로 예약해요.',
        links: [{ label: '공방 인스타그램', url: 'https://www.instagram.com/sspace_jeju/' }, { label: '공식 블로그', url: 'https://blog.naver.com/woodworking_sspace' }],
      },
      oneLine: '제주에서 세상에 하나뿐인 나무반지를 만들며 특별한 하루를 보낼 수 있는 숙소',
      introLabel: '프로그램 기획 의도',
      introQuote: '“사실 게스트하우스보다 나무반지 공방이 먼저였습니다.”',
      programs: [
        {
          name: '나무반지 원데이 클래스',
          info: [
            { label: '가격', value: '29,000원' },
            { label: '시간', value: '오전 11시, 오후 1시, 오후 3시 (택 1)' },
          ],
          photo: { src: 'photos/srr-ring-class.jpg', art: 'workbench', alt: '햇살 드는 작업대 위 나무반지 샘플 판과 각인 도안, 주문서를 쓰는 손과 사포 · 다듬는 도구들', caption: '나무반지를 고르고 주문서를 쓰는 시간' },
          text: ['제주에서 나만의 특별한 기념품을 만들 수 있다. 11가지 특수목과 7가지 디자인 중 원하는 조합을 고르고, 사이즈부터 각인 문구까지 취향에 맞게 정한다. 약 1시간~1시간 30분 동안 나무를 깎고 다듬으면 세상에 하나뿐인 나무반지가 완성된다.'],
          note: '추가 옵션 가격 별도. 특수 목재 선택(0~6,000원), 레이저 각인(0~5,000원)',
        },
      ],
      editorProfile: {
        title: '내 손으로 특별한 추억을 만들고 싶은 에디터',
        avatar: 'photos/editor-craft-v5.jpg',
        tags: ['체험형여행', '나만의기념품', '취향기록'],
        about: [
          '관광지를 둘러보는 것보다 직접 무언가를 경험하는 여행을 좋아해요. 기성품보다 나만의 취향과 추억이 담긴 기념품을 오래 간직하고 싶어요.',
        ],
      },
      experience: [
        '11가지 특수목과 7가지 디자인 중 마음에 드는 조합을 골라 나만의 나무반지를 만들 수 있다는 점이 특별했어요. 사이즈와 각인 문구까지 직접 정해 세상에 하나뿐인 반지를 완성할 수 있답니다.',
        '나무를 깎고 다듬는 데 집중하다 보니 복잡한 생각도 잠시 잊을 수 있었어요. 여행에서 돌아온 뒤에도 직접 만든 반지를 볼 때마다 제주에서 보낸 시간과 그때의 기분이 떠오를 것 같아요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'camping',
    pageId: 'A-07',
    no: '05',
    en: 'CAMPING',
    title: '모닥불 앞에 모이는 방법',
    verb: '머물다',
    kicker: '불을 피우면, 낯선 사람도 같은 쪽을 바라본다.',
    intro:
      '전문 사진작가로 활동하는 사장님이 자신의 재능을 살려 스냅사진 프로그램을 기획했다. 또한 캠핑과 불멍을 좋아하는 마음을 담아, 손님들도 함께 캠핑 감성을 즐길 수 있도록 포틀럭과 불멍 프로그램을 마련했다.',
    forWhom: [],
    hint: '장작을 올리고 불을 붙여 보세요. 불이 붙으면 사람들이 모여듭니다.',
    tryLabel: '무릉쉼표 들여다보기',
    hero: { src: 'photos/mureung-sign-v2.jpg', art: 'campfire', alt: "나무 기둥에 걸린 '무릉쉼표, 천천히 60m →' 손글씨 간판", caption: '무릉쉼표' },
    gallery: [
      { art: 'oreum', alt: '캠핑 사이트 뒤편의 오름 (샘플 이미지)', caption: '해 질 무렵' },
      { art: 'sea-night', alt: '모닥불이 잦아든 뒤의 밤 (샘플 이미지)', caption: '불이 잦아든 뒤' },
    ],
    layout: 'horizon',
    tone: { paper: '#E7E4DF', ink: '#34312F', accent: '#B6705A' },
    type: 'adventurer',
    report: {
      ...emptyReport({ schedule: '스냅 사진 촬영 시간 조율 · 텐트 내 포틀럭 & 불멍 19:00', duration: '', price: '스냅 사진 촬영 50,000원 · 텐트 내 포틀럭 & 불멍 25,000원', capacity: '' }),
      sample: false,
      place: { name: '무릉쉼표', area: '서귀포시 대정읍', address: '제주특별자치도 서귀포시 대정읍 무릉중앙로 43-11' },
      join: {
        who: '스냅 사진 촬영은 사진 스튜디오(@studiopastel_)가 진행해요.',
        how: '촬영 문의는 스튜디오에 인스타그램 DM·카카오톡·전화로 해요. 숙소 예약은 네이버 예약으로 받아요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/mr_shuimpyo__/' }, { label: '스튜디오 인스타그램', url: 'https://www.instagram.com/studiopastel_/' }],
      },
      oneLine: '일상에서 벗어나 온전한 쉼을 누리기 좋은 곳이며 한적한 무릉리 마을에 자리한 숙소',
      programs: [
        {
          name: '스냅 사진 촬영',
          info: [{ label: '가격', value: '50,000원' }, { label: '시간', value: '시간 조율' }],
          photo: { src: 'photos/mureung-snap-v2.jpg', art: 'oreum', alt: '하얀 메밀꽃이 핀 들판에 서 있는 여행자의 뒷모습', caption: '메밀꽃밭 스냅' },
          text: ['사장님이 직접 발로 뛰며 찾은 제주의 계절별 명소에서 스냅사진을 촬영해 주신다. 편안한 분위기 속에서 어느새 어색함은 사라지고, 아름다운 제주 풍경을 바라보며 여행의 특별한 순간을 추억으로 남길 수 있는 1석 2조 프로그램이다.'],
          note: '시간, 장소 조율 가능',
        },
        {
          name: '텐트 내 포틀럭 & 불멍',
          info: [{ label: '가격', value: '25,000원' }, { label: '시간', value: '오후 7시' }],
          photo: { src: 'photos/mureung-potluck-v2.jpg', art: 'table', alt: '돌담 옆 야외 테이블에 차려진 회, 오므라이스, 주먹밥, 치킨과 반찬', caption: '포틀럭 파티 한 상' },
          text: ['제주에 노을이 내려앉으면 오로라 텐트에서 포틀럭 파티가 열린다. 스태프분들이 직접 만든 음식과 함께 이야기를 나누고, 파티가 끝나면 옆 텐트에서 불멍을 즐길 수 있다. 타오르는 불꽃과 선선한 밤공기 속에서 낯선 여행자와도 자연스럽게 가까워지는 시간이다.'],
          note: '1만원대 자유로운 음식 선택, 중간 참여 가능',
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'homemeal',
    pageId: 'A-08',
    no: '07',
    en: 'HOME MEAL',
    title: '집밥 한 끼로 낯선 사람과 가까워지는 방법',
    verb: '나누다',
    kicker: '혼자 떠난 제주에서 함께 먹는 저녁의 즐거움',
    intro:
      '수많은 제주 게스트하우스 사이에서 수수민박만의 특별함을 고민하던 사장님이 떠올린 것은 가장 자신 있는 집밥이었다. 엄마가 차려주는 듯한 따뜻한 한 끼에서 시작된 식사 프로그램은 이제 혼자 온 여행자들이 한 식탁에 둘러앉아 음식과 이야기를 나누는 시간이 되었다.',
    forWhom: [
      '혼자 여행해도 저녁은 함께 먹고 싶은 분',
      '맛있는 음식과 소소한 대화를 즐기는 분',
      '시끄러운 파티보다 편안한 교류를 선호하는 분',
    ],
    hint: '',
    tryLabel: '수수민박 들여다보기',
    hero: {
      src: 'photos/susu-entrance-v2.jpg',
      art: 'stone-house',
      alt: '나무 벽에 걸린 수수민박 간판과 입구 앞 올리브 나무',
      caption: '수수민박 입구',
    },
    gallery: [
      { src: 'photos/susu-morning-walk.jpg', art: 'coast-dawn', alt: '바다 옆으로 솟은 절벽과 잔잔한 바다', caption: '프로그램 2 — 아침 산책' },
    ],
    layout: 'process',
    tone: { paper: '#F1EBE0', ink: '#38312A', accent: '#B6705A' },
    type: 'maker',
    report: {
      ...emptyReport({
        schedule: '수수한 저녁 19:30 · 아침 산책 07:00',
        duration: '',
        price: '수수한 저녁 30,000원 · 아침 산책 별도 참가비 없음',
        capacity: '',
      }),
      sample: false,
      place: { name: '수수민박', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 소기왓로 22' },
      join: {
        who: '수수한 저녁은 신청 인원이 충분할 때 진행돼요.',
        how: '저녁 식사는 문자로 미리 신청해요. 숙소 예약은 인스타그램 프로필의 예약 링크에서 할 수 있어요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/soosoohouse/' }],
      },
      oneLine: '사장님이 직접 차려주신 집밥을 함께 나눠 먹으며 마음까지 따뜻해지는 숙소',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '수수한 저녁',
          info: [{ label: '가격', value: '30,000원' }, { label: '시간', value: '오후 7시 30분' }],
          photo: { src: 'photos/susu-dinner-table.jpg', art: 'table', alt: '조명이 켜진 주방 앞 나무 식탁에 접시와 반찬이 차려진 수수민박의 저녁 자리', caption: '수수한 저녁 한 상' },
          text: ['사장님이 정성껏 준비한 집밥을 함께 먹는 저녁 프로그램이다. 제주에서 하루를 보내고 돌아온 여행자들이 한 식탁에 모여 돔베고기 수육과 푸짐한 반찬을 나눈다. 음식과 함께 여행 이야기를 주고받으면 혼자 온 제주에서도 함께하는 저녁의 즐거움을 느낄 수 있다.'],
        },
        {
          name: '아침 산책',
          info: [{ label: '가격', value: '별도 참가비 없음' }, { label: '시간', value: '오전 7시' }],
          photo: { src: 'photos/susu-morning-walk.jpg', art: 'coast-dawn', alt: '바다 옆으로 솟은 절벽과 잔잔한 바다', caption: '아침 산책길의 바다' },
          text: ['사장님이 즐겨 달린다는 대평포구에서 출발해 박수기정을 지나 예래포구까지 걷는 아침 산책 프로그램이다. 매일 봐도 질리지 않는 풍경에 반해 숙소를 짓기로 결심했다는 사장님의 이야기도 들을 수 있었다. 고요한 바닷길을 걸으며 제주의 아침을 여유롭게 시작할 수 있다.'],
        },
      ],
      editorProfile: {
        title: '혼자도 함께도 좋은 에디터',
        avatar: 'photos/editor-homemeal-v5.jpg',
        tags: ['느긋한여행', '함께먹는저녁', '혼자도함께도'],
        about: ['서두르지 않고 느긋하게 머무는 여행을 좋아해요. 저녁 한 끼는 누군가와 함께 먹고 싶고, 혼자만의 시간도 함께하는 시간도 모두 소중해요.'],
      },
      experience: [
        '가장 기억에 남는 건 사장님이 차려주신 저녁 식사예요. 돔베고기 수육과 푸짐한 반찬을 나눠 먹으며 처음 만난 게스트들과 여행 이야기를 나누는 시간이 즐거웠어요.',
        '제가 머문 4인실에는 침대마다 커튼이 있어 편하게 쉴 수 있었어요. 저녁에는 게스트들과 어울리고, 방에서는 혼자만의 시간을 즐겼어요. 함께하는 즐거움과 혼자만의 여유를 모두 누릴 수 있어 만족스러웠답니다.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'wine',
    pageId: 'A-09',
    no: '06',
    en: 'WINE',
    title: '와인 한 잔으로 제주의 저녁을 즐기는 방법',
    verb: '기울이다',
    kicker: '한 잔이 비워지는 속도만큼, 밤이 천천히 흐른다.',
    intro:
      '10년 전 퇴사 후 게스트하우스 스태프로 일하던 사장님. 당시 한식 위주였던 게스트하우스의 저녁 식사에서 벗어나, 해외 생활에서 즐겨 접했던 양식과 와인을 함께 나누는 시간을 만들고 싶다는 마음에서 와이너리 디너가 시작되었다.',
    forWhom: [
      '혼자 와도 저녁은 함께 즐기고 싶은 분',
      '연말같이 특별한 시간을 보내고 싶은 분',
      '지역 식재료로 차린 한 끼를 찾는 분',
    ],
    hint: '와인을 고르고 따르기 버튼을 누르고 있어 보세요. 알맞은 선에서 멈추면 됩니다.',
    tryLabel: '루프탑정원 들여다보기',
    hero: { src: 'photos/rooftop-sign-v2.jpg', art: 'wine', alt: "돌담 위 녹슨 철판 '루프탑정원' 간판과 정원 사이로 난 돌길", caption: '루프탑정원' },
    gallery: [
      { art: 'sea-night', alt: '와인 바 창밖의 밤바다 (샘플 이미지)', caption: '창밖의 밤' },
      { art: 'window', alt: '해 질 녘 와인 바 (샘플 이미지)', caption: '문 열기 전' },
    ],
    layout: 'sleeve',
    tone: { paper: '#ECE7DE', ink: '#3A2A2C', accent: '#8E4A4F' },
    type: 'keeper',
    report: {
      ...emptyReport({ schedule: '와이너리 디너 20:00 (예약제)', duration: '', price: '30,000원', capacity: '' }),
      sample: false,
      place: { name: '루프탑정원', area: '서귀포시 남원읍', address: '제주특별자치도 서귀포시 남원읍 태위로912번길 37' },
      join: {
        who: '와이너리 디너는 투숙객에게 예약 우선권이 있어요.',
        how: '숙박 당일 아침에 오는 안내 문자를 받고, 정해진 시간 안에 예약해요 (방문 후기 기준). 외부 주류는 가져갈 수 없어요.',
        links: [{ label: '인스타그램', url: 'https://www.instagram.com/rooftop_guesthouse/' }],
      },
      oneLine: '게스트들이 한 테이블에 모여 와이너리 디너로 특별한 시간을 보낼 수 있는 숙소',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '와이너리 디너',
          info: [{ label: '가격', value: '30,000원' }, { label: '시간', value: '오후 8시' }],
          photo: { src: 'photos/rooftop-dinner-v2.jpg', art: 'wine', alt: '촛불이 켜진 식탁 위 라타투이, 리조또, 파스타, 수육, 샐러드와 스파클링 와인', caption: '와이너리 디너' },
          text: ['제주도에서 나는 식재료로 만든 감바스, 리조또, 파스타, 스테이크 그리고 와인이 제공되는 와이너리 디너로, 메뉴는 매번 달라진다. 사장님의 요리 설명과 함께 다른 게스트들과 한 테이블에 둘러앉아 와인을 곁들이며 이야기를 나누고 식사할 수 있다.'],
          note: '와이너리 디너는 예약제로 운영되며, 예약은 체크인 문자에 대한 답변으로 신청',
        },
      ],
      editorProfile: {
        title: '혼자 여행에 도전해 본 에디터',
        avatar: 'photos/editor-wine-v5.jpg',
        tags: ['다해보는여행', '새로운경험', '혼행도전'],
        about: [
          '여행지에서 할 수 있는 특별한 경험이라면 놓치고 싶지 않아요. 혼자 여행하는 걸 즐기는 편은 아니지만, 새로운 경험에 도전하고 싶어 혼자 제주로 떠났어요.',
        ],
      },
      experience: [
        '와이너리 디너에 나온 음식이 가장 기억에 남아요. 제주 흑돼지 등 지역 식재료를 활용한 요리라는 사장님의 설명을 들으니 특별하게 느껴졌어요. 음식도 푸짐하고 맛있어서 만족스러웠답니다.',
        '특히 처음 만난 게스트들과 한 테이블에 앉아 음식을 나눠 먹고 서로 와인을 따라주다 보니 자연스럽게 친해질 수 있었어요. 함께하는 저녁 식사 덕분에 혼자 온 여행도 즐겁게 보낼 수 있었어요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
];

export const PROGRAM_BY_ID = Object.fromEntries(PROGRAMS.map((p) => [p.id, p])) as Record<
  Program['id'],
  Program
>;
