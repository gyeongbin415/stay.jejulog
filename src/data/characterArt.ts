/**
 * 취향 테스트 결과 소라게 캐릭터 — 결과 유형(프로그램 id)별 그림
 * 받은 캐릭터 시안 이미지를 원래 해상도에서 줄여 같은 크기(800×800, 투명 배경) 캔버스에
 * 가로 가운데 · 바닥 맞춤으로 넣었습니다.
 */
import type { ProgramId } from './types';
import shim from '../assets/characters/hermit-shim.webp';
import seolon from '../assets/characters/hermit-seolon.webp';
import bookstay from '../assets/characters/hermit-bookstay.webp';
import seureureu from '../assets/characters/hermit-seureureu.webp';
import kokoko from '../assets/characters/hermit-kokoko.webp';
import susu from '../assets/characters/hermit-susu.webp';
import rooftop from '../assets/characters/hermit-rooftop.webp';
import saeaewol from '../assets/characters/hermit-saeaewol.webp';
import mureung from '../assets/characters/hermit-mureung.webp';

export const characterArt: Record<ProgramId, string> = {
  cinema: shim,
  lp: seolon,
  book: bookstay,
  craft: seureureu,
  flower: kokoko,
  homemeal: susu,
  wine: rooftop,
  running: saeaewol,
  camping: mureung,
};
