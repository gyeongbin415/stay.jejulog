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
    no: '01',
    en: 'RUNNING',
    title: '제주의 바다를 달리는 방법',
    verb: '달리다',
    kicker: '체크인 다음 일정은, 러닝화 끈을 묶는 일.',
    intro:
      '게스트하우스 스태프 시절이 오래도록 기억에 남았다는 사장님. 그 경험을 여행자들과 나누고 싶어 숙소를 열었다. 자연스러운 만남을 위해 저녁 식사와 와인, 아침 해안가 러닝, 낮 티타임을 마련했다. 모든 프로그램은 자율 참여다.',
    forWhom: [
      '부담 없는 교류를 즐기고 싶은 사람',
      '와인과 함께 여유로운 저녁을 즐기고 싶은 사람',
      '제주 바다를 따라 아침 러닝을 즐기고 싶은 사람',
    ],
    hint: '화면을 누를 때마다 한 걸음씩, 제주의 아침이 밝아옵니다.',
    tryLabel: '새애월 들여다보기',
    hero: { src: 'photos/saewol-exterior.jpg', art: 'road', alt: "외벽에 'SAE AEWOL' 글자가 크게 적힌 2층 갈색 건물", caption: '새애월' },
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
        schedule: '와인 & 양식 디너 19:30 · 아침 러닝 08:30 · 티타임 12:00',
        duration: '',
        price: '와인 & 양식 디너 30,000원 · 아침 러닝 · 티타임 무료',
        capacity: '',
      }),
      sample: false,
      place: { name: '새애월', area: '제주시 애월읍', address: '제주 제주시 애월읍 애월로4길 18' },
      oneLine: '와인으로 물드는 저녁, 바닷바람으로 시작하는 아침을 만날 수 있는 숙소.',
      programs: [
        {
          name: '와인 & 양식 디너 + 불멍',
          info: [{ label: '시간', value: '오후 7시 30분' }, { label: '가격', value: '30,000원' }],
          photos: [
            { src: 'photos/saewol-dinner.jpg', art: 'table', alt: '전구 줄 조명 아래 마당 식탁에 둘러앉아 식사하는 게스트들 (얼굴 흐림 처리)', caption: '마당에서의 디너' },
            { src: 'photos/saewol-fire.jpg', art: 'campfire', alt: '모닥불 위로 꼬치에 꽂은 마시멜로를 굽는 손들', caption: '식사 후 불멍' },
          ],
          text: ['사장님이 직접 준비한 양식 디너와 와인을 즐기며 처음 만난 게스트들과 자연스럽게 가까워지는 시간이다. 날씨가 좋은 날에는 마당에서 저녁 식사를 즐기고, 식사 후에는 모닥불 앞에서 불멍을 하며 이야기를 나눈다. 제주의 밤을 여유롭게 마무리할 수 있다.'],
        },
        {
          name: '아침 러닝 & 바다수영',
          info: [{ label: '시간', value: '오전 8시 30분 (논의 후 조정 가능)' }, { label: '가격', value: '별도 참가비 없음' }],
          photos: [
            { src: 'photos/saewol-run.jpg', art: 'coast-dawn', alt: '맑은 날 애월 바닷가 산책로를 따라 달리는 게스트들 (얼굴 흐림 처리)', caption: '애월 해안가 러닝' },
            { src: 'photos/saewol-swim.jpg', art: 'coast-dawn', alt: '풍력발전기가 보이는 푸른 바다에서 손을 흔드는 게스트들 (얼굴 흐림 처리)', caption: '러닝 후 바다수영' },
          ],
          text: ['아침에는 게스트들과 애월 해안가를 달리며 하루를 시작한다. 바닷바람을 맞으며 제주의 풍경을 즐기고, 러닝을 마친 뒤에는 날씨에 따라 바다수영도 경험할 수 있다. 함께 달리며 자연스럽게 이야기를 나누고, 색다른 방식으로 제주에서의 아침을 맞이하는 시간이다.'],
          note: '바다수영은 날씨 및 해상 상황에 따라 진행 여부 변동 가능',
        },
        {
          name: '티타임',
          info: [{ label: '시간', value: '오후 12시' }, { label: '가격', value: '별도 참가비 없음' }],
          text: ['체크아웃 후 낮 12시, 게스트들이 함께 모여 사장님이 준비한 차를 마시며 이야기를 나누는 시간이다. 참여는 자유로우며, 제주에서의 경험과 앞으로의 여행 계획을 편하게 공유할 수 있다. 대화를 나누다 마음이 맞으면 이후의 여행을 함께하기도 한다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'cinema',
    pageId: 'A-02',
    no: '02',
    en: 'CINEMA',
    title: '스크린을 통해 몰입을 찾는 방법',
    verb: '바라보다',
    kicker: '불이 꺼지는 순간, 낯선 사람들과 같은 장면을 본다.',
    intro:
      "과거 육지에서 식당을 운영하며 취객들의 소음에 지쳤던 사장님이 '온전한 쉼'을 위해 조식 테이블마저 과감히 치워버린 자리가, 이제는 매일 밤 9명의 여행객이 모여 숨은 명작에 조용히 몰입하는 작은 영화관이 됐다.",
    forWhom: [
      '혼자서도 어색하지 않은 저녁을 원하는 사람',
      '말보다 같은 장면을 보는 편이 편한 사람',
      '비 오는 날의 실내 일정이 필요한 사람',
    ],
    hint: '상영 시작 버튼을 누르면 조명이 꺼집니다.',
    tryLabel: '쉼 게스트하우스 들여다보기',
    hero: {
      src: 'photos/shym-exterior.jpg',
      art: 'cinema',
      alt: "돌담에 'JEJUSHYM' 글자가 붙은 쉼 게스트하우스의 흰 건물과 잔디 마당",
      caption: '쉼 게스트하우스',
    },
    gallery: [
      { art: 'window', alt: '상영 전, 빛이 드는 라운지 (샘플 이미지)', caption: '상영 두 시간 전의 라운지' },
      { art: 'sea-night', alt: '상영이 끝난 뒤 바라본 밤바다 (샘플 이미지)', caption: '크레딧이 끝난 뒤' },
    ],
    layout: 'theater',
    tone: { paper: '#2C2A28', ink: '#F0EBE0', accent: '#C37962' },
    type: 'keeper',
    report: {
      ...emptyReport({ schedule: '매일 오후 8시', duration: '', price: '별도 비용 없음', capacity: '' }),
      sample: false,
      place: { name: '쉼 게스트하우스', area: '제주시 한림읍', address: '제주특별자치도 제주시 한림읍 옹포2길 30' },
      oneLine:
        '사장님이 직접 깎아 만든 수제 스피커로 숨은 명작을 감상하며, 낯선 이들과 소란스럽지 않은 여운을 나누는 조용한 숙소.',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '작은 영화관',
          info: [{ label: '시간', value: '오후 8시' }, { label: '가격', value: '별도 비용 없음' }],
          photo: { src: 'photos/shym-cinema.jpg', art: 'cinema', alt: '어두운 상영실에서 큰 스크린을 바라보며 나무 소파에 앉은 여행객들', caption: '매일 밤의 작은 영화관' },
          text: ['매일 저녁 8시 진행, 이용 요금 무료. 누구나 다 아는 천만 영화 대신, 사장님이 엄선한 관객 수 200만 이하의 숨은 명작이나 감성 짙은 음악 영화를 수제 스피커의 꽉 찬 사운드로 감상하는 프로그램이다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'flower',
    pageId: 'A-03',
    no: '03',
    en: 'FLOWER',
    title: '꽃으로 하루를 채우는 방법',
    verb: '만들다',
    kicker: '꽃병보다 먼저, 손끝이 계절을 알아차린다.',
    intro: '',
    forWhom: [
      '여행에서 손으로 남는 무언가를 원하는 사람',
      '조용히 몰입하는 시간이 필요한 사람',
      '계절의 색을 가까이에서 보고 싶은 사람',
    ],
    hint: '마음에 드는 꽃을 골라 나만의 작은 꽃다발을 완성해 보세요.',
    tryLabel: '코코코 들여다보기',
    hero: { src: 'photos/kokoko-sign.jpg', art: 'flower', alt: "흰 나무 외벽에 걸린 '코코코 Guest House' 간판", caption: '코코코 게스트하우스' },
    gallery: [
      { art: 'window', alt: '꽃꽂이 작업대에 드는 오후의 빛 (샘플 이미지)', caption: '작업대 위의 오후' },
      { art: 'oreum', alt: '꽃을 구해 오는 오름 아래 들판 (샘플 이미지)', caption: '들풀이 자라는 곳' },
      { art: 'stone-house', alt: '완성한 꽃을 둔 객실 창가 (샘플 이미지)', caption: '객실 창가에' },
    ],
    layout: 'prints',
    tone: { paper: '#E7E3DC', ink: '#403C39', accent: '#B6705A' },
    type: 'maker',
    report: {
      ...emptyReport({ schedule: '꽃꽂이 클래스 · 오름 일출 감상', duration: '각 1시간', price: '꽃꽂이 25,000원 · 일출 15,000원', capacity: '' }),
      sample: false,
      place: { name: '코코코', area: '제주시 구좌읍', address: '제주시 구좌읍 상하도길 44-1' },
      oneLine: '혼자 오는 여성 여행객들이 편안히 머물 수 있도록 1인실로 구성된 숙소.',
      programs: [
        {
          name: '꽃꽂이 클래스',
          info: [{ label: '가격', value: '25,000원 (숙박객 50% 할인)' }, { label: '시간', value: '1시간 소요' }],
          photo: { src: 'photos/kokoko-flower.jpg', art: 'flower', alt: '라운지 테이블 위 거베라와 카네이션 꽃다발 옆에서 잠든 고양이', caption: '라운지의 꽃과 고양이' },
          text: [
            '계절마다 피어나는 제주의 꽃으로 나만의 꽃바구니를 만들어 보는 시간이다. 특히 숙박객이라면 클래스 비용의 50%를 할인받을 수 있어 더욱 특별하다.',
            '게스트하우스 라운지에서 운영되는 샵인샵 꽃집에서 주관하고 있으며 혼자 온 여행객들이 힐링되는 시간을 보낼 수 있도록 만들어졌다.',
            '꽃 한 송이 한 송이를 정성스럽게 다듬고 어울리는 색을 조합하다 보면 어느새 일상의 복잡한 생각도 잠시 잊게 되며, 진행되는 동안 고양이 세 마리가 곁을 지켜준다.',
          ],
          note: '꽃집 사장님과 소통하여 시간을 유동적으로 잡을 수 있다.',
        },
        {
          name: '오름 일출 감상',
          info: [{ label: '가격', value: '15,000원' }, { label: '시간', value: '1시간 소요' }],
          photo: { src: 'photos/kokoko-sunrise.jpg', art: 'oreum', alt: '오름 전망대 난간에서 붉게 물든 하늘과 바다를 바라보는 여행자', caption: '오름 위에서 맞는 아침' },
          text: [
            '이른 아침에는 투어를 운영하고 있는 마을 주민과 함께 오름에 올라 일출을 감상하는 특별한 프로그램도 참여해보자.',
            '제주에서 함께 아침을 맞이하며, 여행지의 풍경을 넘어 제주만의 일상과 분위기를 가까이에서 느껴볼 수 있다.',
          ],
          note: '전날 미리 시간을 공지한다.',
        },
      ],
      editorProfile: {
        title: '혼자만의 여유를 즐기면서도, 새로운 사람과의 소통을 좋아하는 여행자',
        avatar: 'photos/editor-flower.jpg',
        tags: ['새로운경험', '숨은여행지찾기', '고요한힐링', '느린여행'],
      },
      experience: [
        '마치 시간이 천천히 흐르는 듯한 고요한 분위기가 매력적이었어요. 스텝분의 정성이 담긴 조식부터 꽃꽂이와 일출 감상까지, 혼자만의 시간을 더욱 특별하게 만들어 주는 곳이었답니다.',
      ],
      recommend: [
        '혼자서도 안심하고 머물 수 있는 여성 전용 숙소를 찾는 분, 북적이는 관광지보다 조용한 휴식과 소소한 경험을 원하는 분께 추천해요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'lp',
    pageId: 'A-04',
    no: '04',
    en: 'LP',
    title: 'LP로 제주의 밤을 즐기는 방법',
    verb: '듣다',
    kicker: '바늘이 내려앉는 소리로, 밤이 시작된다.',
    intro:
      '여행과 자유를 좋아하는 사장님은 게스트하우스에서 더 넓은 세상을 만났습니다. 평소 LP 음악을 즐겨 듣고 수집해 온 사장님의 취향을 담아 서론을 꾸렸습니다. 이곳에서는 여행자들이 음악을 함께 듣고 자연스럽게 가까워집니다.',
    forWhom: [
      'LP로 색다른 음악 감상을 즐기고 싶은 사람',
      '아날로그 감성과 아늑한 공간을 좋아하는 사람',
      '음악을 매개로 새로운 사람과 교류하고 싶은 사람',
    ],
    hint: '톤암을 끌어 레코드 위에 올려 보세요. 키보드 방향키로도 움직일 수 있습니다.',
    tryLabel: '서론게스트하우스 들여다보기',
    hero: { src: 'photos/seoron-exterior.jpg', art: 'lp', alt: "붉은 벽돌 벽에 걸린 원형 나무 간판. 흰 글씨로 '서론'과 '@seolon_zip'이 새겨져 있다", caption: '서론게스트하우스' },
    gallery: [
      { art: 'window', alt: '레코드 선반이 있는 라운지 (샘플 이미지)', caption: '선반 앞에서 한참' },
      { art: 'sea-night', alt: '라운지 창밖의 밤 (샘플 이미지)', caption: 'B면이 끝날 무렵' },
    ],
    layout: 'sleeve',
    tone: { paper: '#E6DECD', ink: '#2E2A24', accent: '#B46750' },
    type: 'collector',
    report: {
      ...emptyReport({ schedule: 'LP 청음 매일 18:00 ~ 19:00 · 리스닝 파티 두 달에 한 번', duration: '', price: 'LP 청음 무료', capacity: '' }),
      sample: false,
      place: { name: '서론게스트하우스', area: '서귀포시 안덕면', address: '제주 서귀포시 안덕면 사계신항로39번길 17-13 1층' },
      oneLine: 'LP를 감상하며 사람들과 취향을 나누고, 제주의 밤을 느긋하게 즐길 수 있는 숙소',
      programs: [
        {
          name: 'LP 청음 시간',
          info: [{ label: '시간', value: '매일 오후 6시 ~ 7시' }, { label: '가격', value: '별도 참가비 없음' }],
          photo: { src: 'photos/seoron-lp.jpg', art: 'lp', alt: '조명이 켜진 나무 선반에 LP 앨범이 진열되어 있고, 그 아래 턴테이블 오디오가 놓인 청음 공간', caption: 'LP 청음 공간' },
          text: ['매일 저녁 6시, 소음에서 벗어나 음악에 집중하는 LP 청음 시간입니다. 듣고 싶은 곡은 사장님께 신청해 LP로 감상할 수 있습니다. 이어폰으로 듣던 익숙한 노래도 LP 특유의 따뜻한 음색으로 새롭게 다가옵니다. 좋아하는 음악을 깊이 즐길 수 있는 시간입니다.'],
        },
        {
          name: '리스닝 파티',
          info: [{ label: '일정', value: '두 달에 한 번 진행' }, { label: '시간 · 가격', value: '회차별 확인 필요' }],
          text: ['두 달에 한 번 열리는 리스닝 파티는 한 명의 뮤지션을 주제로 음악을 감상하는 프로그램입니다. 해당 뮤지션의 곡을 함께 듣고 느낀 점을 나누며 서로의 음악 취향을 알아갑니다. 제주에서 처음 만난 여행자들도 음악이라는 공통점으로 자연스럽게 가까워지는 시간입니다.'],
        },
      ],
      editorProfile: {
        title: '아날로그 감성을 즐기는 에디터',
        avatar: 'photos/editor-lp.jpg',
        tags: ['낭만추구', '후회없는여행', '새로운경험'],
        about: ['아날로그 감성을 좋아하고, 쉬거나 이동할 때 음악을 즐겨 들어요. 여행에서는 감성적인 공간을 찾아가고, 쉽게 접하기 어려운 새로운 경험을 해보는 걸 좋아해요.'],
      },
      experience: [
        '이어폰으로 듣던 노래를 LP로 감상하니 익숙한 음악도 새롭게 느껴졌어요. 음악에 집중할 수 있는 분위기가 인상적이었고, 좋아하는 노래를 들으며 여유를 즐길 수 있어 좋았어요.',
        '실제 주택 형태의 숙소라 집처럼 아늑했고, 피규어와 만화책도 있어 구경하는 재미가 있었어요. 술은 밤 10시 30분까지만 마실 수 있어, 이후에는 술자리보다 이야기에 집중할 수 있다는 점도 좋았어요.',
      ],
      recommend: [
        'LP로 색다른 음악 감상을 즐기고 싶은 사람',
        '아날로그 감성과 아늑한 공간을 좋아하는 사람',
        '음악을 매개로 새로운 사람과 교류하고 싶은 사람',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'book',
    pageId: 'A-05',
    no: '05',
    en: 'BOOK',
    title: '낯선 사람과 책으로 이야기를 나누는 방법',
    verb: '읽다',
    kicker: '여행지에서 읽은 문장은, 다른 온도로 남는다.',
    intro:
      '10년 전 서른 살이던 사장님과 남동생이 연애 팁을 얻어보자며 소박하게 시작했던 자리가, 이제는 매일 밤 10명이 둘러앉아 인생과 관계의 결핍을 털어놓는 진솔한 시간이 됐다.',
    forWhom: [
      '여행 가방에 늘 책 한 권을 넣는 사람',
      '조용함을 불편함이 아닌 배려로 느끼는 사람',
      '여행지의 작은 책방을 찾아다니는 사람',
    ],
    hint: '책장을 넘기면 에디터의 공간 기록이 나타납니다.',
    tryLabel: '서점숙소 들여다보기',
    hero: { src: 'photos/bookhome-sign.jpg', art: 'book', alt: "흰 외벽에 그려진 '서점숙소 @bookhome' 로고와 파란 하늘", caption: '서점숙소' },
    gallery: [
      { art: 'window', alt: '책방 겸 라운지에 드는 오후의 빛 (샘플 이미지)', caption: '오후 세 시의 책장' },
      { art: 'stone-house', alt: '돌담 안쪽의 작은 책방 입구 (샘플 이미지)', caption: '책방 입구' },
    ],
    layout: 'prints',
    tone: { paper: '#F0EADE', ink: '#383532', accent: '#B6705A' },
    type: 'collector',
    report: {
      ...emptyReport({ schedule: "대화 모임 '오름에게' 입실날 20:00 · 북바인딩 입실날 17:00 / 퇴실날 11:00", duration: '', price: '대화 모임 무료 · 북바인딩 28,000원', capacity: '' }),
      sample: false,
      place: { name: '서점숙소', area: '제주시 조천읍', address: '제주특별자치도 제주시 조천읍 북촌14길 13-12' },
      oneLine: '책을 매개로 낯선 사람들과 사랑에 대해 이야기를 나눌 수 있는 숙소.',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: "대화 모임 '오름에게'",
          info: [{ label: '시간', value: '입실날 오후 8시' }, { label: '가격', value: '별도 참가비 없음' }],
          photo: { src: 'photos/bookhome-library.jpg', art: 'book', alt: '책이 가득 꽂힌 서재와 창가 옆 긴 나무 테이블', caption: '대화 모임이 열리는 서재' },
          text: ['매일 저녁 8시 공용공간 서재 앞에서 진행하는 대화 모임으로, 40분간 책을 읽고 필사한 뒤 돌아가며 낭독하고 이야기를 나누는 프로그램. 낯선 이들과 사랑을 주제로 대화를 나눌 수 있다.'],
          note: '신청 인원이 3명 이상일 경우 진행되며, 3명 미만이면 취소될 수 있다.',
        },
        {
          name: '북바인딩 클래스',
          info: [{ label: '시간', value: '입실날 오후 5시 또는 퇴실날 오전 11시' }, { label: '가격', value: '28,000원 (재료비 포함)' }],
          photo: { src: 'photos/bookhome-binding.jpg', art: 'book', alt: '서재 앞에서 손에 든 사진 표지의 수제 필사 노트', caption: '직접 만든 필사 노트' },
          text: ['나의 취향이 담긴 필사 노트를 만들 수 있는 프로그램. 수제 제책의 기본 구조와 원리를 배울 수 있다.'],
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'craft',
    pageId: 'A-06',
    no: '06',
    en: 'CRAFT',
    title: '내 손끝에서 깎여 나가는 여행의 잡념',
    verb: '만들다',
    kicker: '손이 바빠지면, 마음은 느려진다.',
    intro:
      '과거 다른 게스트하우스에서 일하며 사람들과 부딪히는 것에 피로감을 느꼈던 내향형 사장님. 제주로 내려와 진짜 좋아하는 일에만 집중하고자 버려진 창고를 개조해 목공방을 열었고, 그 오롯한 몰입의 즐거움을 나누기 위해 지금의 스르르 게스트하우스가 탄생했다.',
    forWhom: [
      '기념품 대신 직접 만든 물건을 갖고 싶은 사람',
      '한 가지 일에 조용히 몰두하는 시간을 좋아하는 사람',
      '함께 손을 움직이며 천천히 친해지고 싶은 사람',
    ],
    hint: '나무 위를 문지르듯 드래그해 반지를 다듬어 보세요.',
    tryLabel: '스르르 게스트하우스 들여다보기',
    hero: {
      src: 'photos/srr-sign.jpg',
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
      ...emptyReport({ schedule: '10:00 · 12:30 · 14:30', duration: '1시간 ~ 1시간 30분', price: '32,000원 (숙박객 29,000원)', capacity: '' }),
      sample: false,
      place: { name: '스르르 게스트하우스', area: '서귀포시 호근동', address: '제주특별자치도 서귀포시 일주동로 8867 (호근동)' },
      oneLine: '제주에서 나만의 나무반지를 깎아내며 복잡한 일상의 걱정까지 스르르 흘려보낼 수 있는 몰입의 숙소.',
      introLabel: '프로그램 기획 의도',
      introQuote: '“사실 게스트하우스보다 나무반지 공방이 먼저였습니다.”',
      programs: [
        {
          name: '나무반지 원데이 클래스',
          info: [
            { label: '공방', value: '우주공간 나무반지 공방' },
            { label: '시간', value: '10:00 ~ 11:30 · 12:30 ~ 14:00 · 14:30 ~ 16:00' },
            { label: '소요', value: '1시간 ~ 1시간 30분' },
            { label: '가격', value: '32,000원 (숙박객 할인가 29,000원)' },
            { label: '추가 옵션', value: '특수 목재 선택 +0~6,000원 · 레이저 각인 +0~5,000원' },
          ],
          photo: { src: 'photos/srr-workshop.jpg', art: 'workbench', alt: '창가를 따라 스탠드 조명과 작업 매트가 놓인 공방 작업대', caption: '창가의 공방 작업대' },
          text: [
            '제주에서 나만의 특별한 기념품을 만들어 갈 수 있다. 내 취향에 맞는 원목을 고르고 직접 사포질해 나무반지를 만드는 프로그램.',
            '북적이는 제주의 관광지를 잠시 벗어나 고즈넉한 창밖 풍경을 곁에 두고 사포질 소리에만 집중하다 보면, 어느새 나만의 고요한 제주 여행이 손끝에 단단한 조각으로 남게 된다.',
          ],
        },
      ],
      editorProfile: {
        title: '차분한 몰입의 시간이 필요한 에디터',
        avatar: 'photos/editor-craft.jpg',
        label: 'EDITOR 01 · 자연스러운 온기를 좋아하는 여행자',
        tags: ['내향형여행자', '몰입과집중', '소규모모임선호', '느슨한연대', '경험수집가'],
        about: [
          '혼자만의 조용한 시간을 사랑하지만, 여행지에서의 소박한 교류도 기대해요. 시끌벅적하고 억지스러운 텐션보다는, 무언가에 집중하며 자연스럽게 대화가 트이는 편안한 분위기를 선호합니다.',
        ],
      },
      experience: [
        '낯선 사람들과 억지로 친해져야 한다는 압박감 없이, 나무반지를 다듬는 사포질에만 온전히 몰입할 수 있어서 좋았어요. 작업에 집중하며 사장님과 나눈 소소한 대화가 무척 편안했답니다.',
      ],
      recommend: [
        "억지로 텐션을 끌어올려야 하는 대형 파티 게스트하우스에 지친 분들께 추천해요. 대화의 '매개체'가 필요한 내향인이라면, 무념무상으로 나무를 깎으며 복잡한 마음을 비워내고 제주의 고요한 밤을 온전히 즐길 수 있을 거예요.",
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'camping',
    pageId: 'A-07',
    no: '07',
    en: 'CAMPING',
    title: '모닥불 앞에 모이는 방법',
    verb: '머물다',
    kicker: '불을 피우면, 낯선 사람도 같은 쪽을 바라본다.',
    intro: '',
    forWhom: [
      '실내보다 바깥에서 하룻밤을 보내고 싶은 사람',
      '말보다 함께 하는 일로 친해지는 사람',
      '캠핑은 하고 싶지만 장비가 없는 사람',
    ],
    hint: '장작을 올리고 불을 붙여 보세요. 불이 붙으면 사람들이 모여듭니다.',
    tryLabel: '무릉쉼표 들여다보기',
    hero: { src: 'photos/mureung-sign.jpg', art: 'campfire', alt: "나무 기둥에 걸린 '무릉쉼표, 천천히 60m →' 손글씨 간판", caption: '무릉쉼표' },
    gallery: [
      { art: 'oreum', alt: '캠핑 사이트 뒤편의 오름 (샘플 이미지)', caption: '해 질 무렵' },
      { art: 'sea-night', alt: '모닥불이 잦아든 뒤의 밤 (샘플 이미지)', caption: '불이 잦아든 뒤' },
    ],
    layout: 'horizon',
    tone: { paper: '#E7E4DF', ink: '#34312F', accent: '#B6705A' },
    type: 'adventurer',
    report: {
      ...emptyReport({ schedule: '스냅사진 · 포틀럭 파티 & 불멍', duration: '스냅 2시간 · 포틀럭 3시간', price: '스냅 50,000원 · 포틀럭 25,000원', capacity: '' }),
      sample: false,
      place: { name: '무릉쉼표', area: '서귀포시 대정읍', address: '제주 서귀포시 대정읍 무릉중앙로 43-11' },
      oneLine: '서귀포의 한적한 무릉리 마을에 위치해 있어 온전한 쉼이 필요한 여행객을 위한 숙소.',
      programs: [
        {
          name: '스냅사진',
          info: [{ label: '가격', value: '50,000원' }, { label: '시간', value: '2시간 소요' }],
          photo: { src: 'photos/mureung-snap.jpg', art: 'oreum', alt: '하얀 메밀꽃이 핀 들판에 서 있는 여행자의 뒷모습', caption: '메밀꽃밭 스냅' },
          text: [
            '게스트하우스 사장님의 본업은 전문 사진작가이다. 촬영해 주시는 스냅사진 프로그램은 직접 발로 뛰어 찾으신 제주의 계절 스팟이 담긴다. 제주의 아름다운 풍경을 배경으로 여행의 순간을 사진으로 남겨보자.',
            '그저 머물다 가는 숙소를 넘어, 사진과 함께 추억이 함께 쌓이는 무릉쉼표를 경험할 수 있다.',
          ],
          note: '촬영 스팟과 시간은 전날 카톡으로 소통한다.',
        },
        {
          name: '포틀럭 파티 & 불멍',
          info: [{ label: '가격', value: '25,000원' }, { label: '시간', value: '3시간 소요' }],
          photo: { src: 'photos/mureung-potluck.jpg', art: 'table', alt: '긴 나무 테이블에 차려진 회, 수육, 떡볶이, 치킨과 밥, 국', caption: '포틀럭 파티 한 상' },
          text: [
            '제주에 노을이 내려앉기 시작하면 오로라 텐트에서 여행자들과 함께하는 포틀럭 파티가 열린다. 스텝들이 정성껏 직접 만든 음식까지 더해져 각자의 이야기를 나누며 따뜻한 저녁 한 끼를 즐길 수 있으며 포틀럭이 끝난 뒤에는 옆 텐트로 옮겨 불멍을 즐길 수 있다.',
            '타닥타닥 타오르는 불꽃과 선선한 밤공기 속에서 낯선 여행자와도 자연스럽게 가까워지는 시간이다.',
          ],
          note: '1만 원대에서 자유롭게 음식을 골라 오면 되고, 중간에 참여해도 된다.',
        },
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'homemeal',
    pageId: 'A-08',
    no: '08',
    en: 'HOME MEAL',
    title: '집밥 한 끼로 낯선 사람과 가까워지는 방법',
    verb: '나누다',
    kicker: '혼자 떠난 제주에서 함께 먹는 저녁의 즐거움',
    intro:
      '수많은 제주 게스트하우스 사이에서 수수민박만의 특별함을 고민하던 사장님이 떠올린 것은 가장 자신 있는 집밥이었다. 엄마가 차려주는 듯한 따뜻한 한 끼에서 시작된 식사 프로그램은 이제 혼자 온 여행자들이 한 식탁에 둘러앉아 음식과 이야기를 나누는 시간이 되었다.',
    forWhom: [
      '혼자 여행해도 저녁은 함께 먹고 싶은 분',
      '맛있는 음식과 소소한 대화를 즐기는 분',
      '시끌벅적한 파티보다 편안한 교류를 선호하는 분',
    ],
    hint: '',
    tryLabel: '수수민박 들여다보기',
    hero: {
      src: 'photos/susu-entrance.jpg',
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
        schedule: '수수한 저녁 19:30 ~ 23:30 · 아침 산책 07:00',
        duration: '수수한 저녁 약 4시간',
        price: '수수한 저녁 30,000원 · 아침 산책 무료',
        capacity: '',
      }),
      sample: false,
      place: { name: '수수민박', area: '서귀포시 안덕면', address: '제주특별자치도 서귀포시 안덕면 소기왓로 22' },
      oneLine: '사장님이 직접 차려주신 집밥을 함께 나눠 먹으며 마음까지 따뜻해지는 게스트하우스',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '수수한 저녁',
          info: [{ label: '시간', value: '오후 7시 30분 ~ 11시 30분' }, { label: '가격', value: '30,000원' }],
          photo: { src: 'photos/susu-dinner-table.jpg', art: 'table', alt: '조명이 켜진 주방 앞 나무 식탁에 접시와 반찬이 차려진 수수민박의 저녁 자리', caption: '수수한 저녁 한 상' },
          text: ['사장님이 정성껏 준비한 집밥을 함께 먹는 저녁 프로그램이다. 제주에서 하루를 보내고 돌아온 여행자들이 한 식탁에 모여 돔베고기 수육과 푸짐한 반찬을 나눈다. 음식과 함께 여행 이야기를 주고받으면 혼자 온 제주에서도 함께하는 저녁의 즐거움을 느낄 수 있다.'],
        },
        {
          name: '아침 산책',
          info: [{ label: '시간', value: '오전 7시' }, { label: '가격', value: '무료' }],
          photo: { src: 'photos/susu-morning-walk.jpg', art: 'coast-dawn', alt: '바다 옆으로 솟은 절벽과 잔잔한 바다', caption: '아침 산책길의 바다' },
          text: ['사장님이 즐겨 달린다는 대평포구에서 출발해 박수기정을 지나 예래포구까지 걷는 아침 산책 프로그램이다. 매일 봐도 질리지 않는 풍경에 반해 숙소를 짓기로 결심했다는 사장님의 이야기도 들을 수 있었다. 고요한 바닷길을 걸으며 제주의 아침을 여유롭게 시작할 수 있다.'],
        },
      ],
      editorProfile: {
        title: '혼자도 함께도 좋은 에디터',
        avatar: 'photos/editor-homemeal-2.jpg',
        tags: ['혼자여행', '소소한대화선호', '느긋한여행'],
      },
      experience: [
        '가장 기억에 남는 건 사장님이 차려주신 저녁 식사예요. 돔베고기 수육과 푸짐한 반찬을 나눠 먹으며 처음 만난 게스트들과 여행 이야기를 나누는 시간이 즐거웠어요.',
        '제가 머문 4인실에는 침대마다 커튼이 있어 편하게 쉴 수 있었어요. 저녁에는 게스트들과 어울리고, 방에서는 혼자만의 시간을 즐겼어요. 함께하는 즐거움과 혼자만의 여유를 모두 누릴 수 있어 만족스러웠답니다.',
      ],
      recommend: [
        '혼자 여행해도 저녁은 함께 먹고 싶은 분',
        '맛있는 음식과 소소한 대화를 즐기는 분',
        '시끌벅적한 파티보다 편안한 교류를 선호하는 분',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
  {
    id: 'wine',
    pageId: 'A-09',
    no: '09',
    en: 'WINE',
    title: '와인 한 잔으로 제주의 저녁을 즐기는 방법',
    verb: '기울이다',
    kicker: '한 잔이 비워지는 속도만큼, 밤이 천천히 흐른다.',
    intro:
      '10년 전 퇴사 후 게스트하우스 스태프로 일하며 자신만의 공간을 꿈꿨던 사장님. 당시 한식 위주였던 게스트하우스의 저녁 식사에서 벗어나, 해외 생활에서 즐겨 접했던 양식과 와인을 함께 나누는 시간을 만들고 싶다는 마음에서 와이너리 디너가 시작됐다.',
    forWhom: [
      '여행의 밤을 조용히 마무리하고 싶은 사람',
      '좋은 한 잔과 대화를 즐기는 사람',
      '시끄러운 술자리보다 차분한 자리가 편한 사람',
    ],
    hint: '와인을 고르고 따르기 버튼을 누르고 있어 보세요. 알맞은 선에서 멈추면 됩니다.',
    tryLabel: '루프탑정원 들여다보기',
    hero: { src: 'photos/rooftop-sign.jpg', art: 'wine', alt: "돌담 위 녹슨 철판 '루프탑정원' 간판과 정원 사이로 난 돌길", caption: '루프탑정원' },
    gallery: [
      { art: 'sea-night', alt: '와인 바 창밖의 밤바다 (샘플 이미지)', caption: '창밖의 밤' },
      { art: 'window', alt: '해 질 녘 와인 바 (샘플 이미지)', caption: '문 열기 전' },
    ],
    layout: 'sleeve',
    tone: { paper: '#ECE7DE', ink: '#3A2A2C', accent: '#8E4A4F' },
    type: 'keeper',
    report: {
      ...emptyReport({ schedule: '와이너리 디너 입실날 20:00 (예약제)', duration: '', price: '30,000원', capacity: '' }),
      sample: false,
      place: { name: '루프탑정원', area: '서귀포시 남원읍', address: '제주 서귀포시 남원읍 태위로912번길 37' },
      oneLine: '와이너리 디너로 특별한 시간을 만들 수 있는 숙소.',
      introLabel: '프로그램 기획 의도',
      programs: [
        {
          name: '와이너리 디너',
          info: [{ label: '시간', value: '입실날 오후 8시' }, { label: '가격', value: '30,000원' }],
          photo: { src: 'photos/rooftop-dinner.jpg', art: 'wine', alt: '촛불이 켜진 식탁 위 라타투이, 리조또, 파스타, 수육, 샐러드와 스파클링 와인', caption: '와이너리 디너' },
          text: ['제주도에서 나는 식재료로 만든 감바스, 리조또, 파스타, 스테이크 그리고 와인이 제공되는 와이너리 디너. 다른 투숙객과 대화를 나누며 식사할 수 있다.'],
          note: '와이너리 디너는 예약제로 운영되며, 체크인 문자에 답장으로 신청하면 된다.',
        },
      ],
      editorProfile: {
        title: '혼자 여행도 새로운 경험이라 도전해 본 에디터',
        avatar: 'photos/editor-wine.jpg',
        tags: ['혼행도전', '계획여행파', '새로운경험좋아', '할수있는거다하자'],
        about: [
          '평소에는 즉흥적이지만 여행만큼은 계획적으로 움직이는 편이에요. 혼자 여행하는 걸 즐기는 편은 아니지만, 새로운 경험에 도전하고 싶어 혼자 제주로 떠났어요. 여행지에서 할 수 있는 특별한 경험이라면 놓치고 싶지 않아요.',
        ],
      },
      experience: [
        '와이너리 디너에서 맛본 음식이 가장 기억에 남아요. 제주 흑돼지 등 지역 식재료를 활용한 요리라는 사장님의 설명을 들으니 더욱 특별하게 느껴졌어요. 음식도 푸짐하고 맛있어서 만족스러웠답니다.',
        '특히 처음 만난 게스트들과 한 테이블에 앉아 음식을 나눠 먹고, 서로 와인을 따라주다 보니 자연스럽게 친해질 수 있었어요. 함께하는 저녁 식사 덕분에 혼자 온 여행도 즐겁게 보낼 수 있었어요.',
      ],
      recommend: [
        '와인과 양식을 좋아하는 사람이라면 추천해요. 특히 혼자 제주에 왔지만 와인 한 잔만큼은 누군가와 함께 즐기고 싶은 사람에게 잘 어울려요. 연말이나 기념일에 특별한 저녁을 보내고 싶은 사람에게도 추천해요.',
      ],
    },
    guide: SAMPLE_GUIDE,
  },
];

export const PROGRAM_BY_ID = Object.fromEntries(PROGRAMS.map((p) => [p.id, p])) as Record<
  Program['id'],
  Program
>;
