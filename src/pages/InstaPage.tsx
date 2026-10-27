import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContent, useLang } from '../i18n';
import { href } from '../lib/router';
import { INSTA_POSTS, INSTA_PROFILE, type InstaPost } from '../data/insta';
import '../styles/insta.css';

/**
 * 인스타그램 — '인스타그램 보러가기'를 누르면 실제 인스타로 나가지 않고,
 * 스테이 제주로그 계정(@stay.jejulog) 화면을 웹진 안에서 같은 모습으로 보여 줍니다.
 * 게시물을 누르면 인스타처럼 크게 열리고 글 전체를 읽을 수 있습니다.
 */
export default function InstaPage() {
  const { ui, lang } = { ...useContent(), ...useLang() };
  const t = ui.insta;
  const p = INSTA_PROFILE;
  const [open, setOpen] = useState<number | null>(null);
  const [following, setFollowing] = useState(false);
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
              <button type="button" className={`insta-btn${following ? ' insta-btn--ghost' : ''}`} aria-pressed={following} onClick={() => setFollowing((f) => !f)} data-track="insta_follow">
                {following ? t.following : t.follow}
              </button>
            </div>
          </div>
          <ul className="insta-head__stats">
            <li><strong>{fmt.format(p.posts)}</strong> {t.posts}</li>
            <li><strong>{fmt.format(p.followers + (following ? 1 : 0))}</strong> {t.followers}</li>
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
        {INSTA_POSTS.map((post, i) => (
          <li key={post.img}>
            <button type="button" className="insta-grid__item" onClick={() => setOpen(i)} data-track={`insta_post_${i + 1}`}>
              <img src={post.img} alt={post.alt} loading={i < 6 ? 'eager' : 'lazy'} />
              {post.slides > 1 && <CarouselIcon />}
              <span className="insta-grid__hover" aria-hidden="true">
                <span><HeartIcon /> {post.likes}</span>
                <span><BubbleIcon /> {post.comments}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open != null && <PostModal key={open} n={open + 1} post={INSTA_POSTS[open]} onClose={() => setOpen(null)} />}
    </section>
  );
}

/** 게시물 속 사진 — public/insta/p{n}/01.webp … (n 은 게시물 번호, 1부터) */
const slideSrc = (n: number, k: number) => `insta/p${n}/${String(k + 1).padStart(2, '0')}.webp`;

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
          <img src={slideSrc(n, idx)} alt={idx === 0 ? post.alt : `${post.alt} — ${idx + 1} / ${post.slides}`} />
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
          <header className="insta-modal__head">
            <img src={INSTA_PROFILE.avatar} alt="" />
            <strong>{INSTA_PROFILE.handle}</strong>
          </header>
          <div className="insta-modal__body">
            <p className="insta-modal__caption">
              <strong>{INSTA_PROFILE.handle}</strong> {post.caption}
            </p>
          </div>
          <footer className="insta-modal__foot">
            <p className="insta-modal__likes">{t.likes(post.likes)} · {t.comments(post.comments)}</p>
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
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.9 3.8 4.3 7.3C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
function BubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.6c0 2.3 1.1 4.4 2.9 5.9L4 21l4.2-2.1c1.2.4 2.5.6 3.8.6 5.5 0 10-3.9 10-8.6S17.5 3 12 3z" />
    </svg>
  );
}
