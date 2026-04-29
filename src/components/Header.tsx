import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './Header.css';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.set(header, { autoAlpha: 0, y: -16 });
    gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power2.out' });

    // Hide once user has scrolled past the hero
    const trigger = ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom top+=20',
      onEnter: () =>
        gsap.to(header, { yPercent: -160, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () =>
        gsap.to(header, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }),
    });

    return () => {
      trigger.kill();
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
          <span className="cursive">Evara</span>
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
