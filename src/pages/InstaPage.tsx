import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContent, useLang } from '../i18n';
import { href } from '../lib/router';
import { INSTA_POSTS, INSTA_PROFILE, type InstaPost } from '../data/insta';
import { INSTA_TR } from '../data/insta.i18n';
import '../styles/insta.css';

/**
 * 인스타그램 — '인스타그램 보러가기'를 누르면 실제 인스타로 나가지 않고,
 * 스테이 제주로그 계정(@stay.jejulog) 화면을 웹진 안에서 같은 모습으로 보여 줍니다.
 * 게시물을 누르면 인스타처럼 크게 열리고 글 전체를 읽을 수 있습니다.
 */
export default function InstaPage({ post = null }: { post?: number | null }) {
  const { ui, lang } = { ...useContent(), ...useLang() };
  const t = ui.insta;
  // 영어 · 중국어 — 프로필 소개 · 게시물 글 · 표지 설명만 번역본으로 (사진 속 글씨는 그대로)
  const tr = lang === 'ko' ? null : INSTA_TR[lang];
  const p = tr ? { ...INSTA_PROFILE, name: tr.name, bio: tr.bio } : INSTA_PROFILE;
  const posts = tr ? INSTA_POSTS.map((q) => ({ ...q, ...tr.posts[q.img] })) : INSTA_POSTS;
  // 메인 MORE STORIES 썸네일로 들어오면(#/instagram?post=N) 그 게시물을 바로 크게
  const pick = (n: number | null) => (n && n >= 1 && n <= INSTA_POSTS.length ? n - 1 : null);
  const [open, setOpenState] = useState<number | null>(() => pick(post));
  useEffect(() => setOpenState(pick(post)), [post]);
  const setOpen = (i: number | null) => {
    setOpenState(i);
    // 닫으면 주소의 게시물 번호도 지움 (새로고침 때 다시 열리지 않게)
    if (i == null && post) history.replaceState(history.state, '', href.insta());
  };
  const { following, extra, toggle } = useFollow();
  const fmt = new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang);

  return (
    <section className="insta" aria-labelledby="insta-title">
      <h1 id="insta-title" className="visually-hidden">{t.title}</h1>
      <header className="insta-head">
        <div className="insta-head__avatar">
          <img src={p.avatar} alt="" width={150} height={150} />
        </div>
        <div className="insta-head__main">
          <div className="insta-head__row">
            <p className="insta-head__handle">{p.handle}</p>
            <div className="insta-head__btns">
              <button type="button" className={`insta-btn${following ? ' insta-btn--ghost' : ''}`} aria-pressed={following} onClick={toggle} data-track="insta_follow">
                {following ? t.following : t.follow}
              </button>
            </div>
          </div>
          <ul className="insta-head__stats">
            <li><strong>{fmt.format(p.posts)}</strong> {t.posts}</li>
            <li><strong>{fmt.format(p.followers + extra)}</strong> {t.followers}</li>
            <li><strong>{fmt.format(p.following)}</strong> {t.following}</li>
          </ul>
          <div className="insta-head__bio">
            <p className="insta-head__name">{p.name}</p>
            {p.bio.map((l) => <p key={l}>{l}</p>)}
          </div>
        </div>
      </header>

      <div className="insta-tabs" role="presentation">
        <span className="insta-tabs__tab is-on">
          <GridIcon /> {t.postsTab}
        </span>
      </div>

      <ul className="insta-grid" aria-label={t.gridAria}>
        {posts.map((post, i) => (
          <li key={post.img}>
            <button type="button" className="insta-grid__item" onClick={() => setOpen(i)} data-track={`insta_post_${i + 1}`}>
              <img src={post.img} alt={post.alt} loading={i < 6 ? 'eager' : 'lazy'} />
              {post.slides > 1 && <CarouselIcon />}
            </button>
          </li>
        ))}
      </ul>

      {open != null && <PostModal key={open} n={open + 1} post={posts[open]} onClose={() => setOpen(null)} />}
    </section>
  );
}

/**
 * 팔로우 — 웹진에서 누른 팔로우가 방문자 모두에게 쌓여 보이도록 공용 카운터(abacus.jasoncameron.dev)에 기록합니다.
 * 카운터는 올리기만 되므로 '팔로우'와 '팔로우 취소'를 따로 세고, 화면 숫자 = 기준값(1,113) + 팔로우 − 취소.
 * 10/28 까지 쌓인 팔로우는 기준값에 넣었으므로 카운터 이름을 새로(-2) 시작합니다.
 * 날짜가 바뀌어도 줄지 않게 — 내 팔로우 상태와 마지막으로 본 카운터 값을 이 브라우저에 계속 기억하고,
 * 카운터가 늦거나 닿지 않아도 기억한 값으로 보여 줍니다 (카운터는 늘기만 하므로 더 큰 값을 씀).
 */
const COUNTER = 'https://abacus.jasoncameron.dev';
const NS = 'stay-jejulog';
const KEYS = { up: 'insta-follow-2', down: 'insta-unfollow-2' } as const;
const FOLLOW_KEY = 'jejulog:insta-following';
const COUNTS_KEY = 'jejulog:insta-follow-counts';
type Counts = { up: number; down: number };

function readCounts(): Counts {
  try {
    const c = JSON.parse(localStorage.getItem(COUNTS_KEY) ?? '');
    if (typeof c?.up === 'number' && typeof c?.down === 'number') return c;
  } catch {
    /* 처음이거나 기억하지 못함 */
  }
  return { up: 0, down: 0 };
}

/** 카운터 주소 — 4초 안에 답이 없으면 포기(기억한 값 그대로) */
const ask = (path: string) => fetch(`${COUNTER}/${path}`, { signal: AbortSignal.timeout(4000) }).then((r) => r.json());

function useFollow() {
  const [following, setFollowing] = useState(() => {
    try {
      return localStorage.getItem(FOLLOW_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [counts, setCountsState] = useState<Counts>(readCounts);
  // 늘기만 하는 값이라 더 큰 쪽을 남기고, 이 브라우저에 저장
  const merge = (next: Partial<Counts>) =>
    setCountsState((c) => {
      const m = { up: Math.max(c.up, next.up ?? 0), down: Math.max(c.down, next.down ?? 0) };
      try {
        localStorage.setItem(COUNTS_KEY, JSON.stringify(m));
      } catch {
        /* 기억하지 못해도 화면은 그대로 */
      }
      return m;
    });
  useEffect(() => {
    let alive = true;
    Promise.all([ask(`get/${NS}/${KEYS.up}`), ask(`get/${NS}/${KEYS.down}`)])
      .then(([u, d]) => alive && merge({ up: u.value ?? 0, down: d.value ?? 0 }))
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = () => {
    const next = !following;
    setFollowing(next);
    try {
      localStorage.setItem(FOLLOW_KEY, next ? '1' : '0');
    } catch {
      /* 기억하지 못해도 숫자는 그대로 */
    }
    const key = next ? 'up' : 'down';
    merge({ [key]: counts[key] + 1 }); // 먼저 화면에 반영
    ask(`hit/${NS}/${KEYS[key]}`)
      .then((j) => typeof j.value === 'number' && merge({ [key]: j.value }))
      .catch(() => {});
  };
  // 기준값 아래로는 내려가지 않음 (예전에 팔로우한 사람이 취소해도 1,113 아래로는 X)
  const extra = Math.max(0, counts.up - counts.down);
  return { following, extra, toggle };
}

/** 게시물 속 사진 — public/insta/p{n}/01.webp … (n 은 게시물 번호, 1부터) */
const slideSrc = (n: number, k: number, ext = 'webp') => `insta/p${n}/${String(k + 1).padStart(2, '0')}.${ext}`;

function PostModal({ n, post, onClose }: { n: number; post: InstaPost; onClose: () => void }) {
  const { ui, lang } = { ...useContent(), ...useLang() };
  const t = ui.insta;
  const closeRef = useRef<HTMLButtonElement>(null);
  // 인스타처럼 한 장씩 넘겨 보기 — 화살표 · 점 · 키보드 ← → · 손가락으로 밀기
  const [idx, setIdx] = useState(0);
  const last = post.slides - 1;
  const go = (d: number) => setIdx((i) => Math.min(last, Math.max(0, i + d)));
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);
  // 다음 장은 미리 받아 두어 넘길 때 바로 보이게
  useEffect(() => {
    if (idx < last) new Image().src = slideSrc(n, idx + 1);
  }, [n, idx, last]);
  const date = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.date));
  // body 바로 아래에 — 페이지 전환 애니메이션(transform) 안에 있으면 화면 전체를 덮지 못함
  return createPortal(
    <div className="insta-modal" role="dialog" aria-modal="true" aria-label={post.alt} onClick={onClose}>
      <button ref={closeRef} type="button" className="insta-modal__close" onClick={onClose} aria-label={t.close}>×</button>
      <article className="insta-modal__card" onClick={(e) => e.stopPropagation()}>
        <div
          className="insta-modal__media"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {/* 인스타에서 영상인 장은 영상 그대로 — 소리 없이 저절로 반복 재생 (videoHold 에 적힌 장은 한 번 돌고 그 초에 멈춤) */}
          {post.videos?.includes(idx + 1) ? (
            <video
              key={idx}
              src={slideSrc(n, idx, 'mp4')}
              poster={slideSrc(n, idx)}
              autoPlay
              muted
              loop={post.videoHold?.[idx + 1] == null}
              onTimeUpdate={(e) => {
                const hold = post.videoHold?.[idx + 1];
                const v = e.currentTarget;
                if (hold != null && v.currentTime >= hold) {
                  v.pause();
                  v.currentTime = hold;
                }
              }}
              playsInline
              aria-label={`${post.alt} — ${idx + 1} / ${post.slides}`}
            />
          ) : (
            <img src={slideSrc(n, idx)} alt={idx === 0 ? post.alt : `${post.alt} — ${idx + 1} / ${post.slides}`} />
          )}
          {idx > 0 && (
            <button type="button" className="insta-modal__nav insta-modal__nav--prev" onClick={() => go(-1)} aria-label={t.prev}>
              <span aria-hidden="true">‹</span>
            </button>
          )}
          {idx < last && (
            <button type="button" className="insta-modal__nav insta-modal__nav--next" onClick={() => go(1)} aria-label={t.next}>
              <span aria-hidden="true">›</span>
            </button>
          )}
          {post.slides > 1 && (
            <span className="insta-modal__dots" aria-label={`${idx + 1} / ${post.slides}`} role="status">
              {Array.from({ length: post.slides }, (_, k) => <i key={k} className={k === idx ? 'is-on' : ''} />)}
            </span>
          )}
        </div>
        <div className="insta-modal__side">
          {/* 프로필 사진 · 아이디 — 누르면 게시물을 닫고 계정 첫 화면(프로필 · 격자)으로 */}
          <header className="insta-modal__head">
            <a
              className="insta-modal__profile"
              href={href.insta()}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                window.scrollTo({ top: 0 });
              }}
              data-track="insta_modal_profile"
            >
              <img src={INSTA_PROFILE.avatar} alt="" />
              <strong>{INSTA_PROFILE.handle}</strong>
            </a>
          </header>
          <div className="insta-modal__body">
            <p className="insta-modal__caption">
              <strong>{INSTA_PROFILE.handle}</strong> {post.caption}
            </p>
          </div>
          <footer className="insta-modal__foot">
            <time dateTime={post.date}>{date}</time>
            {post.stay && (
              <a className="insta-modal__stay" href={href.stay(post.stay)} data-track={`insta_to_stay_${post.stay}`}>
                {t.seeStay} <span aria-hidden="true">→</span>
              </a>
            )}
          </footer>
        </div>
      </article>
    </div>,
    document.body,
  );
}

/** 여러 장 게시물 표시 — 격자 오른쪽 위 겹친 네모 */
function CarouselIcon() {
  return (
    <svg className="insta-grid__multi" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M8 3h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-5 5v11a2 2 0 0 0 2 2h11v-2H5V8z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}
