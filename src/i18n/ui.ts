import type { Lang } from './types';

/* ------------------------------------------------------------------
   화면 고정 문구 (메뉴 · 버튼 · 라벨) — 언어별
   콘텐츠(숙소 · 프로그램 · 테스트 문항)는 ko 원본 데이터 + en.ts / zh.ts 팩을 씁니다.
------------------------------------------------------------------- */

export interface UiText {
  docTitle: string;
  langLabel: string;
  skip: string;
  nav: { main: string; house: string; test: string; more: string; menuOpen: string; menuClose: string; menu: string; mainNav: string; toHome: (brand: string) => string };
  footer: { tagline: string; madeBy: string };
  app: { loadingStay: string; loadingTest: string; notFound: string; toHome: string };
  /** 웹진 안 인스타그램 페이지 */
  insta: { title: string; loading: string; posts: string; followers: string; following: string; follow: string; message: string; postsTab: string; gridAria: string; close: string; prev: string; next: string; likes: (n: number) => string; comments: (n: number) => string; seeStay: string };
  home: { srTitle: string; wordsAria: string; opening: string; findSub: (n: number) => string; typesAria: string;
    /** 메인 사진 띠 — 상세페이지에서 빠진 사진 둘의 대체 텍스트 */
    stripRunAlt: string; stripLoungeAlt: string; stripCampAlt: string; stripMallowAlt: string; stripDomeAlt: string; stripCandleAlt: string; stripLpWallAlt: string; stripLivingAlt: string; stripRingAlt: string; stripNightAlt: string;
    /** 인스타그램 칸 — 웹진에 못 담은 이야기 */
    moreTitle: string; moreSub: string; moreCta: string };
  house: { viewGroup: string; viewHouse: string; viewList: string; houseAria: string; listAria: string; roomAria: (no: string, label: string, place: string) => string };
  photo: { pending: string };
  stay: {
    basicInfo: string; placeName: string; address: string; mainPrograms: string; usage: string;
    programStory: string; programDetails: string; content: string; note: string;
    editorTitle: string; editorOneLine: string; travelStyle: string; likedIt: string; forWhom: string;
    joinLabel: string; joinTitle: string; joinWho: string; joinHow: string; joinLinks: string;
    editorAvatarAlt: string;
    recommendTitle: string; backToHouse: string; prevStay: string; nextStay: string; toTest: string; booking: string; navAria: string;
  };
  test: {
    title: string; sub: (n: number) => string;
    /** 테스트 시작 전 — 소라게 게하게 이야기 */
    storyTitle: string; storyBody: string; storyBubble: string; start: string;
    progress: string; prev: string; next: string; seeResult: string;
    sharedLabel: string; resultLabel: string; lead: string;
    /** 추천 이유 — 1위 숙소에 점수를 준 실제 답변(최대 둘)으로 */
    reasonLine: (picks: string[]) => string;
    bestCaption: string; nextCaption: string; thirdCaption: string; othersLabel: string; othersTitle: string; expType: string; reason: string; myPicks: string; detail: string;
    retry: string; share: string; shared: string; copied: string; canceled: string;
    /** 결과 공유 — 제목 · 카카오톡 · X · 링크 복사, 카톡은 공유 창이 없으면 링크 복사로 */
    shareTitle: string; shareKakao: string; shareX: string; shareInsta: string; kakaoCopied: string; instaSaved: string; shareFailed: string;
    save: string; saved: string; saveFailed: string;
    bestReason: (type: string) => string; nextRunnerUp: (type: string) => string; nextSameType: (type: string) => string;
  };
}

export const UI: Record<Lang, UiText> = {
  ko: {
    docTitle: 'STAY JEJULOG — 문 너머, 우리가 몰랐던 게스트하우스',
    langLabel: '언어',
    skip: '본문 바로가기',
    nav: { main: '메인', house: '게하 탐색', test: '취향 테스트', more: '더 많은 이야기', menuOpen: '메뉴 열기', menuClose: '메뉴 닫기', menu: '메뉴', mainNav: '주요 메뉴', toHome: (b) => `${b} 메인으로` },
    footer: { tagline: '우리가 몰랐던 제주 게스트하우스를 만나는 웹진', madeBy: 'MADE BY' },
    app: { loadingStay: '게스트하우스를 불러오는 중…', loadingTest: '테스트를 준비하는 중…', notFound: '찾으시는 페이지가 없습니다.', toHome: '메인으로' },
    insta: { title: '스테이 제주로그 인스타그램', loading: '인스타그램을 불러오는 중…', posts: '게시물', followers: '팔로워', following: '팔로잉', follow: '팔로우', message: '메시지 보내기', postsTab: '게시물', gridAria: '게시물 목록', close: '닫기', prev: '이전 사진', next: '다음 사진', likes: (n) => `좋아요 ${n}개`, comments: (n) => `댓글 ${n}개`, seeStay: '웹진에서 이 숙소 보기' },
    home: {
      srTitle: '제주 게스트하우스 공간 탐험 웹진',
      stripRunAlt: '맑은 날 애월 바닷가 산책로를 따라 달리는 게스트들 (얼굴 흐림 처리)',
      stripLoungeAlt: '나무 서까래 아래 기타와 빈백이 놓인 다락 라운지, 긴 창 너머 초록 풍경',
      stripCampAlt: '노을 지는 하늘 아래 텐트 앞 테이블에 차려진 술과 안주',
      stripMallowAlt: '화로 불 위에서 꼬치에 꽂아 굽는 마시멜로',
      stripDomeAlt: '해 진 뒤 불빛이 새어 나오는 돔 텐트 안에 둘러앉은 게스트들',
      stripCandleAlt: '촛불 켜진 긴 테이블에 차려진 스파클링 와인과 파스타, 리소토, 라타투이, 샐러드',
      stripLpWallAlt: '나무 칸 벽면에 가득 꽂힌 LP 앨범과 그 아래 놓인 턴테이블 오디오',
      stripLivingAlt: '나무 서까래 지붕 아래 큰 창과 LP, 책장, 좌식 테이블이 놓인 다락 거실',
      stripRingAlt: '풍력발전기가 보이는 노을 진 바다를 배경으로 손끝에 든 반지',
      stripNightAlt: '구름 낀 밤하늘 아래 전구 불빛이 켜진 텐트에 모여 앉은 게스트들',
      wordsAria: '게스트하우스 하면 흔히 떠올리는 것들',
      opening: '들어가는 중 — 바로 입장',
      findSub: (n) => `${n}가지 질문으로 찾는 나의 제주 게스트하우스`,
      moreTitle: '제주 게하의 더 많은 이야기', moreSub: '웹진에 담지 못한 제주 게하의 다양한 경험을 만나보세요.', moreCta: '인스타그램에서 더 보기',
      typesAria: '네 가지 여행 취향',
    },
    house: {
      viewGroup: '보기 방식', viewHouse: '집', viewList: '목록',
      houseAria: '집 안의 아홉 가지 경험', listAria: '아홉 가지 경험 전체',
      roomAria: (no, label, place) => `${no} ${label} — ${place} 상세 보기`,
    },
    photo: { pending: '사진 준비 중' },
    stay: {
      basicInfo: '기본 정보', placeName: '숙소명', address: '주소', mainPrograms: '주요 프로그램', usage: '이용 정보',
      programStory: '프로그램 이야기', programDetails: '프로그램 소개', content: '체험 내용', note: '참고사항',
      editorTitle: '에디터가 직접 머물러 봤어요', editorAvatarAlt: '스테이로그 로고 티셔츠를 입은 에디터 일러스트', editorOneLine: '에디터의 한 줄 소개', travelStyle: '에디터 여행 성향',
      likedIt: '이런 점이 좋았어요', forWhom: '이런 사람에게 추천해요',
      joinLabel: 'BEFORE YOU GO', joinTitle: '참여 전 확인', joinWho: '참여 대상', joinHow: '참여 방법', joinLinks: '최신 안내',
      recommendTitle: '이런 분께 추천합니다', backToHouse: '집 둘러보기', prevStay: '이전 게하', nextStay: '다음 게하', toTest: '나에게 맞는 게하 찾기', booking: '예약 정보 보기', navAria: '다른 게스트하우스',
    },
    test: {
      title: '당신의 제주 취향을\n찾아보세요.',
      sub: (n) => `${n}가지 질문으로 찾는 나의 제주 게스트하우스`,
      storyTitle: '‘게하게’',
      storyBody: '바다에서 올라온 소라게, 게하게\n마음에 드는 집을 찾으면 껍데기를 바꿔 들어가요.',
      storyBubble: '오늘은 어떤 집에서\n묵어볼까?',
      start: '테스트 시작하기',
      progress: '진행 상태', prev: '이전 질문', next: '다음으로', seeResult: '결과 보기',
      sharedLabel: 'RESULT', resultLabel: 'YOUR JEJU TASTE', lead: '나의 게스트하우스 취향은',
      reasonLine: (p) => `${p.map((x) => `‘${x}’`).join(', ')}라고 답한 당신에게 추천해요.`,
      bestCaption: '가장 잘 맞는 게스트하우스', nextCaption: '두 번째로 잘 맞는 게스트하우스', thirdCaption: '세 번째로 잘 맞는 게스트하우스',
      othersLabel: 'OTHER STAYS', othersTitle: '다른 게하게들도 만나보세요',
      expType: '경험 유형', reason: '추천 이유', myPicks: '나의 선택', detail: '자세히 알아보기',
      retry: '다시하기', share: '친구에게 공유하기',
      save: '저장하기', saved: '결과 이미지를 저장했습니다.', saveFailed: '이미지를 저장하지 못했습니다. 화면을 캡처해 주세요.',
      shared: '공유 창을 열었습니다.', copied: '결과 링크를 복사했습니다.', canceled: '공유를 취소했습니다.',
      shareTitle: '내 결과 공유하기', shareKakao: '카카오톡으로 공유', shareX: 'X로 공유', shareInsta: '인스타그램으로 공유',
      kakaoCopied: '결과 링크를 복사했습니다. 카카오톡 대화창에 붙여 넣어 주세요.',
      instaSaved: '결과 이미지를 저장했습니다. 인스타그램에 올려 주세요.', shareFailed: '공유하지 못했습니다. 다시 눌러 주세요.',
      bestReason: (t) => `‘${t}’ 취향에서 가장 높은 점수를 받은 곳.`,
      nextRunnerUp: (t) => `두 번째로 높게 나온 ‘${t}’ 성향에 어울리는 곳.`,
      nextSameType: (t) => `같은 ‘${t}’ 취향에서 함께 고른 곳.`,
    },
  },

  en: {
    docTitle: 'STAY JEJULOG — Beyond the door, the guesthouses we never knew',
    langLabel: 'Language',
    skip: 'Skip to content',
    nav: { main: 'Home', house: 'Explore', test: 'Taste Test', more: 'More Stories', menuOpen: 'Open menu', menuClose: 'Close menu', menu: 'Menu', mainNav: 'Main menu', toHome: (b) => `${b} home` },
    footer: { tagline: 'A webzine for meeting the Jeju guesthouses we never knew', madeBy: 'MADE BY' },
    app: { loadingStay: 'Loading the guesthouse…', loadingTest: 'Preparing the test…', notFound: 'We couldn’t find that page.', toHome: 'Back to home' },
    insta: { title: 'STAY JEJULOG on Instagram', loading: 'Loading Instagram…', posts: 'posts', followers: 'followers', following: 'following', follow: 'Follow', message: 'Message', postsTab: 'Posts', gridAria: 'Posts', close: 'Close', prev: 'Previous photo', next: 'Next photo', likes: (n) => `${n} likes`, comments: (n) => `${n} comments`, seeStay: 'See this stay in the webzine' },
    home: {
      srTitle: 'A webzine for exploring Jeju guesthouses',
      stripRunAlt: 'Guests running along the Aewol seaside path on a clear day (faces blurred)',
      stripLoungeAlt: 'An attic lounge under wooden beams with a guitar and bean bags, greenery beyond a long window',
      stripCampAlt: 'Drinks and dishes laid out on a table by a tent under a sunset sky',
      stripMallowAlt: 'Marshmallows on skewers toasting over a fire pit',
      stripDomeAlt: 'Guests gathered inside a glowing dome tent after dusk',
      stripCandleAlt: 'Sparkling wine, pasta, risotto, ratatouille and salad on a long candlelit table',
      stripLpWallAlt: 'A wall of wooden cubbies filled with LP records above a turntable stereo',
      stripLivingAlt: 'An attic living room under slatted wooden rafters with a big window, LPs, bookshelves and a low table',
      stripRingAlt: 'A ring held up against a sunset sea with wind turbines on the horizon',
      stripNightAlt: 'Guests gathered in a tent strung with string lights under a cloudy night sky',
      wordsAria: 'What people usually picture when they hear “guesthouse”',
      opening: 'Opening — go straight in',
      findSub: (n) => `Find your Jeju guesthouse in ${n} questions`,
      moreTitle: 'More stories from Jeju guesthouses', moreSub: 'Discover more Jeju guesthouse experiences we couldn’t fit in the webzine.', moreCta: 'See more on Instagram',
      typesAria: 'Four travel tastes',
    },
    house: {
      viewGroup: 'View mode', viewHouse: 'House', viewList: 'List',
      houseAria: 'Nine experiences inside the house', listAria: 'All nine experiences',
      roomAria: (no, label, place) => `${no} ${label} — see ${place}`,
    },
    photo: { pending: 'Photo coming soon' },
    stay: {
      basicInfo: 'Basic information', placeName: 'Guesthouse', address: 'Address', mainPrograms: 'Programs', usage: 'Hours & fees',
      programStory: 'The story behind it', programDetails: 'Programs', content: 'What you’ll do', note: 'Good to know',
      editorTitle: 'Our editor stayed here', editorAvatarAlt: 'Illustration of the editor wearing a Stay Log T-shirt', editorOneLine: 'About the editor', travelStyle: "Editor's travel style",
      likedIt: 'What I loved', forWhom: 'Who it’s for',
      joinLabel: 'BEFORE YOU GO', joinTitle: 'Before you join', joinWho: 'Who can join', joinHow: 'How to join', joinLinks: 'Latest info',
      recommendTitle: 'Recommended for', backToHouse: 'Explore the house', prevStay: 'Previous', nextStay: 'Next', toTest: 'Find the stay that fits you', booking: 'Booking info', navAria: 'Other guesthouses',
    },
    test: {
      title: 'Find your\nJeju taste.',
      sub: (n) => `Find your Jeju guesthouse in ${n} questions`,
      storyTitle: '‘Gehage’',
      storyBody: 'Up from the sea came a hermit crab named Gehage.\nWhen it finds a home it likes, it swaps shells and moves in.',
      storyBubble: 'Which home shall\nI stay in today?',
      start: 'Start the test',
      progress: 'Progress', prev: 'Previous', next: 'Next', seeResult: 'See my result',
      sharedLabel: 'RESULT', resultLabel: 'YOUR JEJU TASTE', lead: 'Your guesthouse taste is',
      reasonLine: (p) => `You answered ${p.map((x) => `“${x}”`).join(' and ')} — that’s why this stay suits you.`,
      bestCaption: 'Your best-matched guesthouse', nextCaption: 'Your second match', thirdCaption: 'Your third match',
      othersLabel: 'OTHER STAYS', othersTitle: 'Meet the other Gehages',
      expType: 'Experience', reason: 'Why it fits', myPicks: 'Your answers', detail: 'Learn more',
      retry: 'Try again', share: 'Share with friends',
      save: 'Save', saved: 'Result image saved.', saveFailed: 'Couldn’t save the image. Please take a screenshot instead.',
      shared: 'Opened the share sheet.', copied: 'Result link copied.', canceled: 'Sharing canceled.',
      shareTitle: 'Share my result', shareKakao: 'Share on KakaoTalk', shareX: 'Share on X', shareInsta: 'Share on Instagram',
      kakaoCopied: 'Result link copied. Paste it into a KakaoTalk chat.',
      instaSaved: 'Result image saved. Post it on Instagram.', shareFailed: 'Couldn’t share. Please try again.',
      bestReason: (t) => `The top match for “${t}”.`,
      nextRunnerUp: (t) => `A fit for your second-strongest side, “${t}”.`,
      nextSameType: (t) => `Another pick for “${t}”.`,
    },
  },

  zh: {
    docTitle: 'STAY JEJULOG — 门的那边，我们不曾了解的民宿',
    langLabel: '语言',
    skip: '跳到正文',
    nav: { main: '首页', house: '探索民宿', test: '喜好测试', more: '更多故事', menuOpen: '打开菜单', menuClose: '关闭菜单', menu: '菜单', mainNav: '主菜单', toHome: (b) => `返回${b}首页` },
    footer: { tagline: '遇见我们不曾了解的济州民宿的杂志', madeBy: 'MADE BY' },
    app: { loadingStay: '正在加载民宿…', loadingTest: '正在准备测试…', notFound: '找不到您要的页面。', toHome: '返回首页' },
    insta: { title: 'STAY JEJULOG 的 Instagram', loading: '正在加载 Instagram…', posts: '帖子', followers: '粉丝', following: '关注', follow: '关注', message: '发消息', postsTab: '帖子', gridAria: '帖子列表', close: '关闭', prev: '上一张', next: '下一张', likes: (n) => `${n} 次赞`, comments: (n) => `${n} 条评论`, seeStay: '在杂志中查看这家民宿' },
    home: {
      srTitle: '济州民宿空间探索杂志',
      stripRunAlt: '晴天里沿着涯月海边步道奔跑的客人（面部已模糊处理）',
      stripLoungeAlt: '木梁下摆着吉他和懒人沙发的阁楼休息区，长窗外一片绿意',
      stripCampAlt: '晚霞下帐篷前的餐桌上摆满了酒和下酒菜',
      stripMallowAlt: '在火炉上串着烤的棉花糖',
      stripDomeAlt: '天黑后透出灯光的圆顶帐篷里围坐的客人',
      stripCandleAlt: '点着蜡烛的长桌上摆着起泡酒、意面、烩饭、普罗旺斯炖菜和沙拉',
      stripLpWallAlt: '木格墙上摆满黑胶唱片，下方放着唱机音响',
      stripLivingAlt: '木条屋顶下的阁楼客厅，有大窗、黑胶唱片、书架和矮桌',
      stripRingAlt: '以晚霞中望得见风力发电机的大海为背景，指尖捏着的戒指',
      stripNightAlt: '多云的夜空下，挂着串灯的帐篷里围坐的客人',
      wordsAria: '提起民宿，人们常会想到的事',
      opening: '正在开门 — 直接进入',
      findSub: (n) => `用${n}个问题找到我的济州民宿`,
      moreTitle: '济州民宿的更多故事', moreSub: '来看看网络杂志里没能收录的济州民宿多样体验。', moreCta: '在 Instagram 查看更多',
      typesAria: '四种旅行喜好',
    },
    house: {
      viewGroup: '浏览方式', viewHouse: '房子', viewList: '列表',
      houseAria: '房子里的九种体验', listAria: '全部九种体验',
      roomAria: (no, label, place) => `${no} ${label} — 查看${place}`,
    },
    photo: { pending: '照片准备中' },
    stay: {
      basicInfo: '基本信息', placeName: '民宿名称', address: '地址', mainPrograms: '主要活动', usage: '时间与费用',
      programStory: '活动的故事', programDetails: '活动介绍', content: '体验内容', note: '注意事项',
      editorTitle: '编辑亲自入住体验', editorAvatarAlt: '穿着 Stay Log 标志T恤的编辑插画', editorOneLine: '编辑简介', travelStyle: '编辑的旅行风格',
      likedIt: '我喜欢的地方', forWhom: '推荐给这样的人',
      joinLabel: 'BEFORE YOU GO', joinTitle: '参加前确认', joinWho: '参加对象', joinHow: '参加方式', joinLinks: '最新信息',
      recommendTitle: '推荐给这样的你', backToHouse: '逛逛这栋房子', prevStay: '上一家民宿', nextStay: '下一家民宿', toTest: '找到适合我的民宿', booking: '预订信息', navAria: '其他民宿',
    },
    test: {
      title: '找到你的\n济州旅行喜好。',
      sub: (n) => `用${n}个问题找到我的济州民宿`,
      storyTitle: '「게하게」',
      storyBody: '从海里爬上来的寄居蟹，게하게。\n找到喜欢的家，就换个壳住进去。',
      storyBubble: '今天要住进\n哪个家呢？',
      start: '开始测试',
      progress: '进度', prev: '上一题', next: '下一题', seeResult: '查看结果',
      sharedLabel: 'RESULT', resultLabel: 'YOUR JEJU TASTE', lead: '你的民宿喜好是',
      reasonLine: (p) => `你选择了${p.map((x) => `“${x}”`).join('、')}，所以这里很适合你。`,
      bestCaption: '最适合你的民宿', nextCaption: '第二适合你的民宿', thirdCaption: '第三适合你的民宿',
      othersLabel: 'OTHER STAYS', othersTitle: '也来认识其他的게하게吧',
      expType: '体验类型', reason: '推荐理由', myPicks: '你的选择', detail: '了解详情',
      retry: '再测一次', share: '分享给朋友',
      save: '保存', saved: '已保存结果图片。', saveFailed: '无法保存图片，请截屏保存。',
      shared: '已打开分享窗口。', copied: '已复制结果链接。', canceled: '已取消分享。',
      shareTitle: '分享我的结果', shareKakao: '分享到 KakaoTalk', shareX: '分享到 X', shareInsta: '分享到 Instagram',
      kakaoCopied: '已复制结果链接，请粘贴到 KakaoTalk 聊天中。',
      instaSaved: '已保存结果图片，请发布到 Instagram。', shareFailed: '分享失败，请再试一次。',
      bestReason: (t) => `在“${t}”喜好中得分最高的地方。`,
      nextRunnerUp: (t) => `适合你第二强的“${t}”倾向。`,
      nextSameType: (t) => `同为“${t}”喜好的另一个选择。`,
    },
  },
};
