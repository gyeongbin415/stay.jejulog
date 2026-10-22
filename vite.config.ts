import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — 빌드 결과물(dist)을 어느 경로에 올려도 동작하도록 상대 경로로 출력합니다.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5181, strictPort: true },
});
