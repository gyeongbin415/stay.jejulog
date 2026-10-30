import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LangProvider } from './i18n';
import { installClickTracking } from './lib/track';
import { fixTestUrl } from './lib/router';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/door.css';
import './styles/house.css';
import './styles/stay.css';
import './styles/test.css';

installClickTracking();

// 예전 테스트 주소(#/test)면 test/ 로 옮기는 중이라 그리지 않음
if (!fixTestUrl()) createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
