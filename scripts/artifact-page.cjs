// dist/index.html 을 공유 링크(claude.ai 아티팩트)용 페이지로 바꿉니다.
// 실행: npm run build && node scripts/artifact-page.cjs  → dist/geha-webzine.html
// - 아티팩트는 <html>/<head>/<body> 뼈대를 직접 씌우므로 안쪽 내용만 남깁니다.
// - 외부 스타일시트는 Google Fonts 만 허용되므로 Pretendard(jsdelivr) 링크는 뺍니다.
const fs = require('fs');

let s = fs.readFileSync('dist/index.html', 'utf8');
s = s
  .replace(/<!doctype html>\s*/i, '')
  .replace(/<\/?html[^>]*>\s*/gi, '')
  .replace(/<\/?head>\s*/gi, '')
  .replace(/<\/?body>\s*/gi, '')
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net[^>]*>\s*/i, '')
  .replace(/<title>[^<]*<\/title>/, '<title>게하 사용설명서</title>');
// 제목을 맨 위로
s = s.replace(/\s*<title>게하 사용설명서<\/title>/, '');
s = '<title>게하 사용설명서</title>\n' + s.trim() + '\n';

fs.writeFileSync('dist/geha-webzine.html', s);
console.log('dist/geha-webzine.html', s.length, 'chars');
