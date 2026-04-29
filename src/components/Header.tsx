import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import './Header.css';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.set(header, { autoAlpha: 0, y: -16 });
    gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power2.out' });

    let lastY = window.scrollY;
    let hidden = false;
    const THRESHOLD = 12;
    const SHOW_AT_TOP = 80;

    const update = () => {
      const y = window.scrollY;
      const dy = y - lastY;

      if (y < SHOW_AT_TOP) {
        if (hidden) {
          hidden = false;
          gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
        }
      } else if (dy > THRESHOLD) {
        if (!hidden) {
          hidden = true;
          gsap.to(header, { yPercent: -160, autoAlpha: 0, duration: 0.45, ease: 'power2.out' });
        }
        lastY = y;
      } else if (dy < -THRESHOLD) {
        if (hidden) {
          hidden = false;
          gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
        }
        lastY = y;
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Collapse if user clicks outside the pill
  useEffect(() => {
    if (!expanded) return;
    const onDoc = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [expanded]);

  return (
    <header ref={headerRef} className={`site-header ${expanded ? 'is-expanded' : ''}`}>
      <div className="header-pill">
        <nav className="header-nav header-nav--left" aria-hidden={!expanded}>
          <a href="#stories">Stories</a>
          <a href="#weddings">Weddings</a>
          <a href="#escapes">Escapes</a>
        </nav>

        <button
          type="button"
          className="brand-mark"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <img
            className="brand-logo"
            src="/images/evara-logo.png"
            alt="Evara Weddings"
            draggable={false}
          />
        </button>

        <nav className="header-nav header-nav--right" aria-hidden={!expanded}>
          <a href="#atelier">Atelier</a>
          <a href="#journal">Journal</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
