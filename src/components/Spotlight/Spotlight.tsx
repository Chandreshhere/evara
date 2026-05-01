import { useEffect, useRef, useState } from 'react';
import './Spotlight.css';

const SPOTLIGHT_ITEMS = [
  {
    name: 'Heritage Vows',
    img: '/images/evara-01.jpg',
    body: 'A palace courtyard at dusk — vows under heirloom lanterns, a small string ensemble, and a procession that closes with rose petals on stone.',
  },
  {
    name: 'Mehndi Light',
    img: '/images/evara-02.jpg',
    body: 'Sunlit afternoon, hand-painted henna, jasmine garlands and a private chai service that turns the verandah into the warmest room in the house.',
  },
  {
    name: 'Mandap Stillness',
    img: '/images/evara-03.jpg',
    body: 'Quiet, considered ritual. A mandap of carved teak, marigold drapes, and an officiant who keeps the family inside the moment, not the schedule.',
  },
  {
    name: 'Saffron Hour',
    img: '/images/evara-04.jpg',
    body: 'Late-day reception with brass-rim glassware, a saffron palette, and an orchestra brief that moves from tabla to standards as the floor fills.',
  },
  {
    name: 'Ivory Procession',
    img: '/images/evara-05.jpg',
    body: 'A luminous ivory baraat through arched courtyards. Fitted-couture sherwanis, white roses, and a quartet that scores the entire walk.',
  },
  {
    name: 'Brass Quiet',
    img: '/images/evara-06.jpg',
    body: 'A small ceremony — twenty seats, a single candle line, a brass altar. The smallest weddings we plan are sometimes the most editorial.',
  },
  {
    name: 'Garden Reception',
    img: '/images/evara-07.jpg',
    body: 'Long communal tables under fig trees. Linen runners, hand-thrown ceramics, and a menu built around what was harvested that week.',
  },
  {
    name: 'Heirloom Edge',
    img: '/images/8.jpeg',
    body: 'A second-day brunch with the family heirlooms set out — embroidery, jewellery, a grandmother’s veil. We design the morning so they can be worn.',
  },
];

// Floating preview card that follows the cursor anywhere over the
// list. The card is `position: fixed`, so it tracks the viewport
// (not the list), which means scrolling doesn't desync it. We also
// re-run the row-under-cursor detection on scroll so the card content
// updates as the user scrolls past rows without moving the mouse.
export default function Spotlight() {
  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0, has: false });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const card = cardRef.current;
    if (!list || !card) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      card.style.setProperty('--card-x', `${lastPos.current.x}px`);
      card.style.setProperty('--card-y', `${lastPos.current.y}px`);
    };

    const detectRow = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const row = (el as Element).closest<HTMLElement>('[data-spotlight-row]');
      if (!row || !list.contains(row)) return null;
      const idx = Number(row.dataset.spotlightRow);
      return Number.isNaN(idx) ? null : idx;
    };

    const onMove = (e: MouseEvent) => {
      lastPos.current.x = e.clientX;
      lastPos.current.y = e.clientY;
      lastPos.current.has = true;
      if (!raf) raf = requestAnimationFrame(apply);
      const idx = detectRow(e.clientX, e.clientY);
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const onLeave = () => {
      lastPos.current.has = false;
      setActiveIndex(null);
    };

    // On scroll, the cursor stays at the same screen coords but a
    // different row is now beneath it. Re-detect using the last
    // known cursor position; card position itself is fixed so it
    // doesn't need repositioning.
    const onScroll = () => {
      if (!lastPos.current.has) return;
      const idx = detectRow(lastPos.current.x, lastPos.current.y);
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    list.addEventListener('mousemove', onMove);
    list.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      list.removeEventListener('mousemove', onMove);
      list.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const item = activeIndex !== null ? SPOTLIGHT_ITEMS[activeIndex] : null;

  return (
    <section className="spotlight">
      <div className="spotlight-inner">
        <p className="spotlight-eyebrow">In closing — Discover</p>
        <h2 className="spotlight-heading">A wedding, written in your own hand.</h2>
        <p className="spotlight-lede">
          We design slowly, in private, to a single measure — so the day
          arrives feeling not produced, but inevitable. Hover any chapter
          to read more.
        </p>

        <ul className="spotlight-list" ref={listRef}>
          {SPOTLIGHT_ITEMS.map((it, i) => (
            <li
              className={`spotlight-row ${activeIndex === i ? 'is-active' : ''}`}
              data-spotlight-row={i}
              key={it.name}
            >
              <div className="spotlight-row-main">
                <span className="spotlight-row-name">{it.name}</span>
                <span className="spotlight-row-thumb" aria-hidden>
                  <img src={it.img} alt="" loading="lazy" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={cardRef}
        className={`spotlight-floating-card ${item ? 'is-visible' : ''}`}
        aria-hidden={!item}
      >
        {item && (
          <>
            <div className="spotlight-floating-card-img">
              <img src={item.img} alt="" loading="lazy" />
            </div>
            <p className="spotlight-floating-card-body">{item.body}</p>
          </>
        )}
      </div>
    </section>
  );
}
