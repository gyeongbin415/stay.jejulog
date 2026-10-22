/**
 * 취향 테스트 결과 소라게 캐릭터 — 결과 유형(프로그램 id)별 SVG
 * 원본 캐릭터 시안을 따라 그린 벡터(투명 배경). 아홉 파일 모두 같은 viewBox로,
 * 두 눈 가운데가 같은 자리에 오도록 맞춰 두어 어느 크기로 보여도 정렬이 같습니다.
 */
import type { ProgramId } from './types';
import shim from '../assets/characters/hermit-shim.svg';
import seolon from '../assets/characters/hermit-seolon.svg';
import bookstay from '../assets/characters/hermit-bookstay.svg';
import seureureu from '../assets/characters/hermit-seureureu.svg';
import kokoko from '../assets/characters/hermit-kokoko.svg';
import susu from '../assets/characters/hermit-susu.svg';
import rooftop from '../assets/characters/hermit-rooftop.svg';
import saeaewol from '../assets/characters/hermit-saeaewol.svg';
import mureung from '../assets/characters/hermit-mureung.svg';

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
