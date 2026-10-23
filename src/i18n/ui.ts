import type { Lang } from './types';

/* ------------------------------------------------------------------
   화면 고정 문구 (메뉴 · 버튼 · 라벨) — 언어별
   콘텐츠(숙소 · 프로그램 · 테스트 문항)는 ko 원본 데이터 + en.ts / zh.ts 팩을 씁니다.
------------------------------------------------------------------- */

export interface UiText {
  docTitle: string;
  langLabel: string;
  skip: string;
  nav: { main: string; house: string; test: string; menuOpen: string; menuClose: string; menu: string; mainNav: string; toHome: (brand: string) => string };
  footer: { tagline: string; copyright: string };
  app: { loadingStay: string; loadingTest: string; notFound: string; toHome: string };
  home: { srTitle: string; wordsAria: string; opening: string; findSub: (n: number) => string; typesAria: string };
  house: { viewGroup: string; viewHouse: string; viewList: string; houseAria: string; listAria: string; roomAria: (no: string, label: string, place: string) => string };
  photo: { pending: string };
  stay: {
    basicInfo: string; placeName: string; address: string; mainPrograms: string; usage: string;
    programStory: string; programDetails: string; content: string; note: string;
    editorTitle: string; editorOneLine: string; travelStyle: string; likedIt: string; forWhom: string;
    recommendTitle: string; backToHouse: string; nextStay: string; toTest: string; booking: string; navAria: string;
  };
  test: {
    title: string; sub: (n: number) => string;
    /** 테스트 시작 전 — 소라게 게하게 이야기 */
    storyTitle: string; storyBody: string; storyWhy: string; start: string;
    progress: string; prev: string; next: string; seeResult: string;
    sharedLabel: string; resultLabel: string; lead: string;
    bestCaption: string; nextCaption: string; thirdCaption: string; expType: string; reason: string; myPicks: string; detail: string;
    retry: string; share: string; shared: string; copied: string; canceled: string;
    save: string; saved: string; saveFailed: string;
    bestReason: (type: string) => string; nextRunnerUp: (type: string) => string; nextSameType: (type: string) => string;
    shareTitle: (brand: string, type: string) => string;
  };
}

export const UI: Record<Lang, UiText> = {
  ko: {
    docTitle: '제주로그 JEJULOG — 문 너머, 우리가 몰랐던 게스트하우스',
    langLabel: '언어',
    skip: '본문 바로가기',
    nav: { main: '메인', house: '게하 탐색', test: '취향 테스트', menuOpen: '메뉴 열기', menuClose: '메뉴 닫기', menu: '메뉴', mainNav: '주요 메뉴', toHome: (b) => `${b} 메인으로` },
    footer: { tagline: '제주 게스트하우스 공간 탐험 웹진', copyright: '게재된 사진과 글의 저작권은 각 촬영자와 편집팀에 있습니다.' },
    app: { loadingStay: '게스트하우스를 불러오는 중…', loadingTest: '테스트를 준비하는 중…', notFound: '찾으시는 페이지가 없습니다.', toHome: '메인으로' },
    home: {
      srTitle: '제주 게스트하우스 공간 탐험 웹진',
      wordsAria: '게스트하우스 하면 흔히 떠올리는 것들',
      opening: '들어가는 중 — 바로 입장',
      findSub: (n) => `${n}가지 질문으로 알아보는\n나에게 맞는 제주 게스트하우스.`,
      typesAria: '네 가지 여행 취향',
    },
    house: {
      viewGroup: '보기 방식', viewHouse: '집으로 보기', viewList: '전체보기',
      houseAria: '집 안의 아홉 가지 경험', listAria: '아홉 가지 경험 전체',
      roomAria: (no, label, place) => `${no} ${label} — ${place} 상세 보기`,
    },
    photo: { pending: '사진 준비 중' },
    stay: {
      basicInfo: '기본 정보', placeName: '숙소명', address: '주소', mainPrograms: '주요 프로그램', usage: '이용 정보',
      programStory: '프로그램 이야기', programDetails: '프로그램 소개', content: '체험 내용', note: '참고사항',
      editorTitle: '에디터가 직접 머물러 봤어요', editorOneLine: '에디터의 한 줄 소개', travelStyle: '나의 여행 성향',
      likedIt: '그래서 이 게하가 좋았어요', forWhom: '이런 사람에게 추천해요',
      recommendTitle: '이런 분께 추천합니다', backToHouse: '다시 집 둘러보기', nextStay: '다음 게하 살펴보기', toTest: '나에게 맞는 게하 찾기', booking: '예약 정보 보기', navAria: '다른 게스트하우스',
    },
    test: {
      title: '당신의 제주 취향을\n찾아보세요.',
      sub: (n) => `${n}가지 질문으로 알아보는\n나에게 맞는 게스트하우스.`,
      storyTitle: '소라게 ‘게하게’',
      storyBody: '바다에서 올라온 소라게, 게하게.\n마음에 드는 집을 찾으면 껍데기를 바꿔 들어가요.\n오늘은 어떤 집에서 묵어볼까?',
      storyWhy: '소라게가 집을 빌려 살며 옮겨 다니는 습성을, 게스트하우스를 옮겨 다니는 혼행자에 겹쳤어요.',
      start: '테스트 시작하기',
      progress: '진행 상태', prev: '이전 질문', next: '다음으로', seeResult: '결과 보기',
      sharedLabel: 'SHARED RESULT — 공유받은 결과', resultLabel: 'YOUR JEJU TASTE', lead: '나의 여행 취향은',
      bestCaption: '가장 잘 맞는 게스트하우스', nextCaption: '두 번째로 잘 맞는 게스트하우스', thirdCaption: '세 번째로 잘 맞는 게스트하우스',
      expType: '경험 유형', reason: '추천 이유', myPicks: '나의 선택', detail: '게스트하우스 자세히 보기',
      retry: '다시하기', share: '친구에게 공유하기',
      save: '저장하기', saved: '결과 이미지를 저장했습니다.', saveFailed: '이미지를 저장하지 못했습니다. 화면을 캡처해 주세요.',
      shared: '공유 창을 열었습니다.', copied: '결과 링크를 복사했습니다.', canceled: '공유를 취소했습니다.',
      bestReason: (t) => `‘${t}’ 취향에서 가장 높은 점수를 받은 곳.`,
      nextRunnerUp: (t) => `두 번째로 높게 나온 ‘${t}’ 성향에 어울리는 곳.`,
      nextSameType: (t) => `같은 ‘${t}’ 취향에서 함께 고른 곳.`,
      shareTitle: (b, t) => `${b} — ${t}`,
    },
  },

  en: {
    docTitle: 'JEJULOG — Beyond the door, the guesthouses we never knew',
    langLabel: 'Language',
    skip: 'Skip to content',
    nav: { main: 'Home', house: 'Explore', test: 'Taste Test', menuOpen: 'Open menu', menuClose: 'Close menu', menu: 'Menu', mainNav: 'Main menu', toHome: (b) => `${b} home` },
    footer: { tagline: 'A webzine for exploring Jeju guesthouses', copyright: 'All photos and text are copyrighted by their photographers and the editorial team.' },
    app: { loadingStay: 'Loading the guesthouse…', loadingTest: 'Preparing the test…', notFound: 'We couldn’t find that page.', toHome: 'Back to home' },
    home: {
      srTitle: 'A webzine for exploring Jeju guesthouses',
      wordsAria: 'What people usually picture when they hear “guesthouse”',
      opening: 'Opening — go straight in',
      findSub: (n) => `${n} questions to find\nthe Jeju guesthouse that fits you.`,
      typesAria: 'Four travel tastes',
    },
    house: {
      viewGroup: 'View mode', viewHouse: 'House view', viewList: 'See all',
      houseAria: 'Nine experiences inside the house', listAria: 'All nine experiences',
      roomAria: (no, label, place) => `${no} ${label} — see ${place}`,
    },
    photo: { pending: 'Photo coming soon' },
    stay: {
      basicInfo: 'Basic information', placeName: 'Guesthouse', address: 'Address', mainPrograms: 'Programs', usage: 'Hours & fees',
      programStory: 'The story behind it', programDetails: 'Programs', content: 'What you’ll do', note: 'Good to know',
      editorTitle: 'Our editor stayed here', editorOneLine: 'About the editor', travelStyle: 'Travel style',
      likedIt: 'Why I loved this place', forWhom: 'Who it’s for',
      recommendTitle: 'Recommended for', backToHouse: 'Back to the house', nextStay: 'See the next guesthouse', toTest: 'Find the stay that fits you', booking: 'Booking info', navAria: 'Other guesthouses',
    },
    test: {
      title: 'Find your\nJeju taste.',
      sub: (n) => `${n} questions to find\nthe guesthouse that fits you.`,
      storyTitle: 'Gehage the hermit crab',
      storyBody: 'Up from the sea came a hermit crab named Gehage.\nWhen it finds a home it likes, it swaps shells and moves in.\nWhich home shall we stay in today?',
      storyWhy: 'We paired the hermit crab’s habit of borrowing homes and moving on with solo travelers who hop from guesthouse to guesthouse.',
      start: 'Start the test',
      progress: 'Progress', prev: 'Previous', next: 'Next', seeResult: 'See my result',
      sharedLabel: 'SHARED RESULT', resultLabel: 'YOUR JEJU TASTE', lead: 'Your travel taste is',
      bestCaption: 'Your best-matched guesthouse', nextCaption: 'Your second match', thirdCaption: 'Your third match',
      expType: 'Experience', reason: 'Why it fits', myPicks: 'Your answers', detail: 'See the guesthouse',
      retry: 'Try again', share: 'Share with friends',
      save: 'Save', saved: 'Result image saved.', saveFailed: 'Couldn’t save the image. Please take a screenshot instead.',
      shared: 'Opened the share sheet.', copied: 'Result link copied.', canceled: 'Sharing canceled.',
      bestReason: (t) => `The top match for “${t}”.`,
      nextRunnerUp: (t) => `A fit for your second-strongest side, “${t}”.`,
      nextSameType: (t) => `Another pick for “${t}”.`,
      shareTitle: (b, t) => `${b} — ${t}`,
    },
  },

  zh: {
    docTitle: '济州日志 JEJULOG — 门的那边，我们不曾了解的民宿',
    langLabel: '语言',
    skip: '跳到正文',
    nav: { main: '首页', house: '探索民宿', test: '喜好测试', menuOpen: '打开菜单', menuClose: '关闭菜单', menu: '菜单', mainNav: '主菜单', toHome: (b) => `返回${b}首页` },
    footer: { tagline: '济州民宿空间探索杂志', copyright: '本站照片与文字的版权归各摄影师及编辑团队所有。' },
    app: { loadingStay: '正在加载民宿…', loadingTest: '正在准备测试…', notFound: '找不到您要的页面。', toHome: '返回首页' },
    home: {
      srTitle: '济州民宿空间探索杂志',
      wordsAria: '提起民宿，人们常会想到的事',
      opening: '正在开门 — 直接进入',
      findSub: (n) => `用${n}个问题\n找到适合你的济州民宿。`,
      typesAria: '四种旅行喜好',
    },
    house: {
      viewGroup: '浏览方式', viewHouse: '房子视图', viewList: '查看全部',
      houseAria: '房子里的九种体验', listAria: '全部九种体验',
      roomAria: (no, label, place) => `${no} ${label} — 查看${place}`,
    },
    photo: { pending: '照片准备中' },
    stay: {
      basicInfo: '基本信息', placeName: '民宿名称', address: '地址', mainPrograms: '主要活动', usage: '时间与费用',
      programStory: '活动的故事', programDetails: '活动介绍', content: '体验内容', note: '注意事项',
      editorTitle: '编辑亲自入住体验', editorOneLine: '编辑简介', travelStyle: '我的旅行风格',
      likedIt: '所以我喜欢这家民宿', forWhom: '推荐给这样的人',
      recommendTitle: '推荐给这样的你', backToHouse: '再逛逛这栋房子', nextStay: '看看下一家民宿', toTest: '找到适合我的民宿', booking: '预订信息', navAria: '其他民宿',
    },
    test: {
      title: '找到你的\n济州旅行喜好。',
      sub: (n) => `用${n}个问题\n找到适合你的民宿。`,
      storyTitle: '寄居蟹「게하게」',
      storyBody: '从海里爬上来的寄居蟹，게하게。\n找到喜欢的家，就换个壳住进去。\n今天要在哪个家住一晚呢？',
      storyWhy: '我们把寄居蟹借屋而居、四处搬家的习性，与在一家家民宿之间辗转的独自旅行者重叠在一起。',
      start: '开始测试',
      progress: '进度', prev: '上一题', next: '下一题', seeResult: '查看结果',
      sharedLabel: 'SHARED RESULT — 分享的结果', resultLabel: 'YOUR JEJU TASTE', lead: '你的旅行喜好是',
      bestCaption: '最适合你的民宿', nextCaption: '第二适合你的民宿', thirdCaption: '第三适合你的民宿',
      expType: '体验类型', reason: '推荐理由', myPicks: '你的选择', detail: '查看民宿详情',
      retry: '再测一次', share: '分享给朋友',
      save: '保存', saved: '已保存结果图片。', saveFailed: '无法保存图片，请截屏保存。',
      shared: '已打开分享窗口。', copied: '已复制结果链接。', canceled: '已取消分享。',
      bestReason: (t) => `在“${t}”喜好中得分最高的地方。`,
      nextRunnerUp: (t) => `适合你第二强的“${t}”倾向。`,
      nextSameType: (t) => `同为“${t}”喜好的另一个选择。`,
      shareTitle: (b, t) => `${b} — ${t}`,
    },
  },
};
