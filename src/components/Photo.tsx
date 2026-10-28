import type { CSSProperties } from 'react';
import type { PhotoData, ProgramId } from '../data/types';
import { RoomArt } from './RoomArt';
import { useContent } from '../i18n';

interface Props {
  photo?: PhotoData;
  /** 사진이 없을 때 대신 보여 줄 집 내부 공간 일러스트 */
  fallback: ProgramId;
  /** CSS aspect-ratio (예: '4 / 5'). 비우면 부모 크기를 채웁니다. */
  ratio?: string;
  caption?: string | false;
  className?: string;
  style?: CSSProperties;
  /** 첫 화면 이미지처럼 바로 불러와야 하면 true */
  eager?: boolean;
}

/**
 * 사진 프레임 — src 가 있으면 실제 취재 사진, 없으면 해당 경험의 공간 일러스트 (미완성 문구는 화면에 띄우지 않음).
 */
export function Photo({ photo, fallback, ratio, caption, className = '', style, eager }: Props) {
  const cap = caption === false ? null : (caption ?? photo?.caption);
  const has = Boolean(photo?.src);
  const { ui } = useContent();
  return (
    <figure className={`photo${has ? '' : ' photo--art'} ${className}`} style={{ ...style, ...(ratio ? { aspectRatio: ratio } : null) }}>
      <div className="photo__frame">
        {has ? (
          <img src={photo!.src} alt={photo!.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={photo!.focus ? { objectPosition: photo!.focus } : undefined} />
        ) : (
          <>
            <RoomArt id={fallback} />
            <span className="visually-hidden">{photo?.alt ?? ui.photo.pending}</span>
          </>
        )}
      </div>
      {cap && <figcaption className="photo__cap">{cap}</figcaption>}
    </figure>
  );
}
