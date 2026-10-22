# 제주로그 JEJULOG — 제주 게스트하우스 공간 탐험형 웹진

CHECK IN → EXPLORE → DISCOVER → CHECK OUT
게스트하우스의 문을 열고 들어가 아홉 가지 경험을 탐색하고, 실제 숙소와 에디터의 체험기를 만나고, 취향 테스트로 나에게 맞는 숙소를 찾는 웹진입니다.
React 19, TypeScript, Vite로 만들었습니다.

> 이전 버전(게하 사용설명서 콘셉트)의 소스는 `_백업_v1_게하사용설명서/` 폴더에 그대로 보관되어 있습니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:5181
npm run build      # dist/ 폴더 생성 → Netlify Drop 등에 그대로 올리면 됩니다
npm run test:quiz  # 취향 테스트 점수 검증 (모든 답변 조합 전수 계산)
```

## 페이지와 주소

| 페이지 | 주소 | 파일 |
| --- | --- | --- |
| PAGE 01 메인 (INTRO · PROBLEM · CHECK IN · FIND YOUR STAY · CHECK OUT) | `#/` (섹션 이동 `#/?to=checkin`) | `src/pages/HomePage.tsx` |
| PAGE 02 집 내부 탐색 | `#/house` | `src/pages/HousePage.tsx` |
| PAGE 03 게스트하우스 상세 (9곳 공통 템플릿, 에디터 후기 포함) | `#/stay/<id>` (예전 주소 `#/use/<id>`도 열림) | `src/pages/StayPage.tsx` |
| PAGE 04 취향 테스트 | `#/test`, 공유 결과 `#/test?r=ABCDABC` | `src/pages/TestPage.tsx` |

## 콘텐츠 바꾸기

| 바꿀 것 | 파일 |
| --- | --- |
| 9개 숙소 정보 · 프로그램 · 사진 · 에디터 후기 · 예약 링크 | `src/data/programs.ts` → 각 항목의 `report` |
| 경험 이름(책 읽기 등) · 집 안 위치 · 상세페이지 메인 카피 | `src/data/experiences.ts` |
| 메인 · 탐색 페이지 문안 | `src/data/site.ts` |
| 취향 테스트 질문 · 점수 · 유형 설명 | `src/data/quiz.ts` |

- 데이터가 비어 있는 칸(에디터 후기, 프로그램 기획 의도 등)은 상세페이지에서 자동으로 숨겨집니다. 임의의 내용은 넣지 마세요.
- `report.bookingUrl`을 채우면 상세페이지 하단에 '예약 정보 보기' 버튼이 생깁니다.
- 사진이 없으면(현재 서론게스트하우스) 집 내부의 해당 공간 일러스트와 '사진 준비 중' 표시가 대신 나옵니다. 사진은 `public/photos/`에 넣고 `src`에 `'photos/파일명.jpg'`를 적습니다.

## 폴더 구조

```
src/
  data/        programs(숙소) · experiences(경험↔숙소 연결) · quiz(테스트) · site(문안)
  pages/       HomePage · HousePage · StayPage · TestPage
  components/  Header(로고·게하 탐색·취향 테스트·메뉴) · Footer · Door(체크인/체크아웃 대문) · RoomArt(9개 공간 일러스트) · Photo
  lib/         router(해시 주소) · scoring(테스트 점수) · motion(동작 줄이기) · track(클릭 데이터)
  styles/      tokens(색·서체·간격) · base · layout · home · door · house · stay · test
```

## 접근성

- 운영체제의 '동작 줄이기'를 켜면 문 열림 애니메이션 없이 바로 집 내부로 이동하고, 인트로 문구도 한 번에 보입니다.
- 문이 열리는 중에 버튼을 한 번 더 누르면 기다리지 않고 바로 들어갑니다.
- 모든 공간과 선택지는 키보드(Tab, Enter, Space)로 조작할 수 있습니다.
