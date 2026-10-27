import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SITE } from '../data/site';
import { PROGRAMS } from '../data/programs';
import { COMPACT_FLOORS, EXPERIENCES, ROOMS, type Experience } from '../data/experiences';
import { QUESTIONS, TYPES, type QuizQuestion, type TravelType } from '../data/quiz';
import type { PhotoData, Program, ProgramId, TypeId } from '../data/types';
import type { ContentPack, Lang, ProgramText, SiteText } from './types';
import { UI, type UiText } from './ui';
import { EN } from './en';
import { ZH } from './zh';

export type { Lang } from './types';

/* ------------------------------------------------------------------
   언어 상태 — 상단 바의 KO / EN / 中 버튼으로 바꾸고, 이 브라우저에 기억합니다.
   한국어는 원본 데이터를 그대로, 영어 · 중국어는 콘텐츠 팩의 글로 바꿔 끼웁니다.
------------------------------------------------------------------- */

export const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'ko', label: 'KO', name: '한국어' },
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'zh', label: '中', name: '中文' },
];

const PACKS: Partial<Record<Lang, ContentPack>> = { en: EN, zh: ZH };
const KEY = 'jejulog:lang';
const HTML_LANG: Record<Lang, string> = { ko: 'ko', en: 'en', zh: 'zh-CN' };

function readLang(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'en' || v === 'zh' ? v : 'ko';
  } catch {
    return 'ko';
  }
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ko', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* 저장할 수 없어도 화면 전환은 그대로 */
    }
  };

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    // 탭 제목은 페이지마다 App(applyPageMeta)에서 바꿉니다
    const skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = UI[lang].skip;
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/* ── 콘텐츠 바꿔 끼우기 ─────────────────────────────── */

export interface Content {
  lang: Lang;
  ui: UiText;
  site: SiteText;
  programs: Program[];
  programById: Record<ProgramId, Program>;
  experiences: Experience[];
  experienceById: Record<ProgramId, Experience>;
  rooms: typeof ROOMS;
  compactFloors: typeof COMPACT_FLOORS;
  questions: QuizQuestion[];
  types: Record<TypeId, TravelType>;
}

function withText(photo: PhotoData, t?: { alt: string; caption?: string }): PhotoData {
  return t ? { ...photo, alt: t.alt, caption: t.caption ?? photo.caption } : photo;
}

function localizeProgram(p: Program, t?: ProgramText): Program {
  if (!t) return p;
  const r = p.report;
  return {
    ...p,
    title: t.title,
    kicker: t.kicker,
    intro: t.intro,
    forWhom: t.forWhom,
    hero: withText(p.hero, t.hero),
    report: {
      ...r,
      place: { ...r.place, name: t.placeName, area: t.area },
      oneLine: t.oneLine ?? r.oneLine,
      introQuote: t.introQuote ?? r.introQuote,
      programs: r.programs?.map((g, i) => {
        const tg = t.programs?.[i];
        if (!tg) return g;
        return {
          ...g,
          name: tg.name,
          info: g.info.map((row, j) => tg.info[j] ?? row),
          photo: g.photo && withText(g.photo, tg.photos?.[0]),
          photos: g.photos && [withText(g.photos[0], tg.photos?.[0]), withText(g.photos[1], tg.photos?.[1])],
          text: tg.text.length ? tg.text : g.text,
          note: tg.note ?? g.note,
        };
      }),
      editorProfile: r.editorProfile && t.editorProfile ? { ...r.editorProfile, ...t.editorProfile } : r.editorProfile,
      experience: t.experience.length ? t.experience : r.experience,
      recommend: t.recommend ?? r.recommend,
      join: r.join && {
        ...r.join,
        who: t.join?.who ?? r.join.who,
        how: t.join?.how ?? r.join.how,
        links: r.join.links?.map((l, i) => ({ ...l, label: t.join?.linkLabels?.[i] ?? l.label })),
      },
    },
  };
}

function build(lang: Lang): Content {
  const pack = PACKS[lang];
  const byId = <T extends { id: ProgramId }>(list: T[]) => Object.fromEntries(list.map((x) => [x.id, x])) as Record<ProgramId, T>;
  if (!pack) {
    return {
      lang, ui: UI[lang], site: SITE as unknown as SiteText,
      programs: PROGRAMS, programById: byId(PROGRAMS),
      experiences: EXPERIENCES, experienceById: byId(EXPERIENCES),
      rooms: ROOMS, compactFloors: COMPACT_FLOORS, questions: QUESTIONS, types: TYPES,
    };
  }
  const programs = PROGRAMS.map((p) => localizeProgram(p, pack.programs[p.id]));
  const experiences = EXPERIENCES.map((e) => {
    const t = pack.experiences[e.id];
    return t ? { ...e, label: t.label, short: t.short, headline: e.headline ? (t.headline ?? e.headline) : undefined } : e;
  });
  const floors = <F extends { id: keyof ContentPack['floors']; name: string }>(list: F[]) => list.map((f) => ({ ...f, name: pack.floors[f.id] ?? f.name }));
  const questions = QUESTIONS.map((q) => {
    const t = pack.quiz.questions[q.id];
    return t ? { ...q, context: t.context, q: t.q, options: q.options.map((o) => ({ ...o, text: t.options[o.key] ?? o.text, tag: t.tags?.[o.key as 'A' | 'B'] ?? o.tag })) } : q;
  });
  const types = Object.fromEntries(
    (Object.keys(TYPES) as TypeId[]).map((id) => [id, { ...TYPES[id], ...pack.quiz.types[id] }]),
  ) as Record<TypeId, TravelType>;
  return {
    lang, ui: UI[lang], site: pack.site,
    programs, programById: byId(programs),
    experiences, experienceById: byId(experiences),
    rooms: floors(ROOMS), compactFloors: floors(COMPACT_FLOORS), questions, types,
  };
}

const CACHE: Partial<Record<Lang, Content>> = {};

/** 지금 언어의 화면 문구와 콘텐츠 */
export function useContent(): Content {
  const { lang } = useLang();
  return useMemo(() => (CACHE[lang] ??= build(lang)), [lang]);
}
