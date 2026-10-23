import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { Photo } from '../components/Photo';

/** 프로그램 정보 라벨을 상세페이지 공통 용어로 (한국어) */
const INFO_LABEL: Record<string, string> = { 시간: '운영 시간', 가격: '참가 비용', '시간 · 가격': '운영 시간 · 참가 비용' };

/**
 * PAGE 03 — 게스트하우스 상세 (9곳 공통 템플릿)
 * HERO → BASIC INFORMATION → PROGRAM STORY → PROGRAM DETAILS → EDITOR'S PICK → RECOMMENDATION → NAVIGATION
 * 데이터가 없는 칸은 지어 내지 않고 숨깁니다.
 */
export default function StayPage({ id }: { id: ProgramId }) {
  const { ui, lang, programById, experienceById, experiences } = useContent();
  const t = ui.stay;
  const p = programById[id];
  const e = experienceById[id];
  const EXPERIENCES = experiences;
  const r = p.report;
  const programs = r.programs ?? [];
  const editor = r.editorProfile;
  const hasEditor = Boolean(editor || r.experience.length);
  const hasStory = Boolean(p.intro || r.introQuote);
  // 다음 게하 — 9곳 순서대로, 마지막 다음은 처음으로
  const at = EXPERIENCES.findIndex((x) => x.id === id);
  const next = EXPERIENCES[(at + 1) % EXPERIENCES.length];
  const prev = EXPERIENCES[(at - 1 + EXPERIENCES.length) % EXPERIENCES.length];

  return (
    <article className="stay" aria-labelledby="stay-title">
      {/* 01. HERO */}
      <header className="stay-hero" data-tone="dark">
        <Photo photo={p.hero} fallback={id} className="stay-hero__photo" caption={false} eager />
        <div className="stay-hero__copy wrap">
          <p className="stay-hero__meta">
            <span>STAY {e.no} / {String(EXPERIENCES.length).padStart(2, '0')}</span>
            <span>{e.label}</span>
          </p>
          <h1 id="stay-title" className="stay-hero__name">{r.place.name}</h1>
        </div>
      </header>

      {/* 02. BASIC INFORMATION */}
      <section className="stay-sec stay-info wrap" data-tone="light" aria-labelledby="sec-info">
        <div className="stay-sec__label">
          <p className="label">BASIC INFORMATION</p>
          <h2 id="sec-info" className="visually-hidden">{t.basicInfo}</h2>
        </div>
        <div className="stay-info__grid">
          {r.oneLine && <p className="stay-info__oneline">{r.oneLine}</p>}
          <dl className="stay-info__list">
            {(r.place.address || r.place.area) && (
              <div>
                <dt><Icon name="pin" />{t.address}</dt>
                <dd>{r.place.address || r.place.area}</dd>
              </div>
            )}
            {programs.length > 0 && (
              <div>
                <dt><Icon name="spark" />{t.mainPrograms}</dt>
                <dd>{programs.map((g) => g.name).join(' · ')}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* 03. PROGRAM STORY */}
      {hasStory && (
        <section className="stay-sec stay-story" data-tone="light" aria-labelledby="sec-story">
          <div className="wrap stay-story__inner">
            <div className="stay-sec__label">
              <p className="label">PROGRAM STORY</p>
              <h2 id="sec-story" className="stay-sec__title">{t.programStory}</h2>
            </div>
            <div className="stay-story__text">
              {r.introQuote && <blockquote className="stay-story__quote">{r.introQuote}</blockquote>}
              {p.intro && <p>{p.intro}</p>}
            </div>
          </div>
        </section>
      )}

      {/* 04. PROGRAM DETAILS */}
      {programs.length > 0 && (
        <section className="stay-sec stay-programs wrap" data-tone="light" aria-labelledby="sec-programs">
          <div className="stay-sec__label">
            <p className="label">PROGRAM DETAILS</p>
            <h2 id="sec-programs" className="stay-sec__title">{t.programDetails}</h2>
          </div>
          <ol className="stay-programs__list">
            {programs.map((g, i) => (
              <li key={g.name} className="program">
                <div className="program__media">
                  <div className="program__head">
                    <p className="program__no">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="program__name">{g.name}</h3>
                  </div>
                  {g.photos ? (
                    <div className="program__pair">
                      {g.photos.map((ph) => (
                        <Photo key={ph.src ?? ph.alt} photo={ph} fallback={id} ratio="3 / 4" />
                      ))}
                    </div>
                  ) : (
                    <Photo photo={g.photo} fallback={id} ratio="4 / 3" />
                  )}
                </div>
                <div className="program__body">
                  <dl className="program__info">
                    {g.info.map((row) => (
                      <div key={row.label}>
                        <dt>{lang === 'ko' ? (INFO_LABEL[row.label] ?? row.label) : row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="program__text">
                    <p className="program__sub">{t.content}</p>
                    {g.text.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                  {g.note && (
                    <p className="program__note">
                      <strong>{t.note}</strong>
                      {g.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 05. EDITOR'S PICK — 숙소 소개 바로 아래에 이어지는 에디터 체험기 */}
      {hasEditor && (
        <section className="stay-sec stay-editor" data-tone="dark" aria-labelledby="sec-editor">
          <div className="wrap stay-editor__inner">
            <div className="stay-editor__head">
              <p className="label label--light">EDITOR&apos;S PICK</p>
              <h2 id="sec-editor" className="stay-sec__title">{t.editorTitle}</h2>
            </div>
            <div className="stay-editor__body">
              {editor && (
                <div className="stay-editor__profile">
                  {editor.avatar ? (
                    <img src={editor.avatar} alt="" className="stay-editor__avatar" />
                  ) : (
                    <span className="stay-editor__avatar stay-editor__avatar--line" aria-hidden="true">
                      <svg viewBox="0 0 76 76" focusable="false">
                        <circle cx="38" cy="30" r="12" />
                        <path d="M17 62 C19 49 27 43 38 43 C49 43 57 49 59 62" />
                      </svg>
                    </span>
                  )}
                  <div>
                    <p className="stay-editor__k">{t.editorOneLine}</p>
                    {editor?.title && <p className="stay-editor__title">{editor.title}</p>}
                    {editor?.label && <p className="stay-editor__labeltext">{editor.label}</p>}
                  </div>
                </div>
              )}
              {editor && (editor.tags.length > 0 || editor.about) && (
                <div className="stay-editor__block">
                  <h3 className="stay-editor__k">{t.travelStyle}</h3>
                  {editor.tags.length > 0 && (
                    <ul className="stay-editor__tags">
                      {editor.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {editor.about?.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              )}
              {r.experience.length > 0 && (
                <div className="stay-editor__block">
                  <h3 className="stay-editor__k">{t.likedIt}</h3>
                  {r.experience.map((t) => (
                    <p key={t} className="stay-editor__story">{t}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 06. RECOMMENDATION */}
      {p.forWhom.length > 0 && (
        <section className="stay-sec stay-reco wrap" data-tone="light" aria-labelledby="sec-reco">
          <div className="stay-sec__label">
            <p className="label">RECOMMENDATION</p>
            <h2 id="sec-reco" className="stay-sec__title">{t.recommendTitle}</h2>
          </div>
          <ul className="stay-reco__list">
            {p.forWhom.slice(0, 4).map((t) => (
              <li key={t}>
                <Icon name="check" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 07. NAVIGATION — 예약 링크는 데이터에 있을 때만 */}
      <nav className="stay-nav wrap" data-tone="light" aria-label={t.navAria}>
        {/* 위: 이전 게하 · 집 둘러보기 · 다음 게하 (한 줄) / 아래: 나에게 맞는 게하 찾기 */}
        <div className="stay-nav__row">
          <a className="btn btn--ghost btn--back" href={href.stay(prev.id)} data-track={`stay_${id}_prev_${prev.id}`}>
            {t.prevStay} <span className="arrow" aria-hidden="true">←</span>
          </a>
          <a className="btn btn--ghost" href={href.house()} data-track={`stay_${id}_back_house`}>
            {t.backToHouse}
          </a>
          <a className="btn btn--ghost" href={href.stay(next.id)} data-track={`stay_${id}_next_${next.id}`}>
            {t.nextStay} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <a className="btn" href={href.test()} data-track={`stay_${id}_to_test`}>
          {t.toTest} <span className="arrow" aria-hidden="true">→</span>
        </a>
        {r.bookingUrl && (
          <a className="btn" href={r.bookingUrl} target="_blank" rel="noopener noreferrer" data-track={`stay_${id}_booking`}>
            {t.booking} <span className="arrow" aria-hidden="true">↗</span>
          </a>
        )}
      </nav>
    </article>
  );
}

type IconName = 'home' | 'pin' | 'spark' | 'clock' | 'check';

function Icon({ name }: { name: IconName }) {
  const props = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className={`icon icon--${name}`} aria-hidden="true" focusable="false">
      {name === 'home' && <path {...props} d="M4 11 L12 4 L20 11 M6 9.5 V20 H18 V9.5 M10 20 V14 H14 V20" />}
      {name === 'pin' && (
        <g {...props}>
          <path d="M12 21 C8 16 6 13 6 10 a6 6 0 0 1 12 0 c0 3 -2 6 -6 11 z" />
          <circle cx="12" cy="10" r="2.2" />
        </g>
      )}
      {name === 'spark' && <path {...props} d="M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z" />}
      {name === 'clock' && (
        <g {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5 V12 L15 14" />
        </g>
      )}
      {name === 'check' && (
        <g {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.3 L10.8 15 L16 9.5" />
        </g>
      )}
    </svg>
  );
}
