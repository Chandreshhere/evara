import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './Manifesto.css';

const PHOTOS = [
  {
    src: '/images/9.jpeg',
    alt: 'Wedding moment',
    rotate: -6,
    translate: '40px, -10px',
  },
  {
    src: '/images/8.jpeg',
    alt: 'Wedding moment',
    rotate: 0,
    translate: '0, 22px',
    caption: 'love is in the air',
  },
  {
    src: '/images/10.jpeg',
    alt: 'Wedding moment',
    rotate: 5,
    translate: '-30px, 0',
  },
];

const MARQUEE = [
  '/images/evara-01.jpg',
  '/images/evara-02.jpg',
  '/images/evara-03.jpg',
  '/images/evara-04.jpg',
  '/images/evara-05.jpg',
  '/images/evara-06.jpg',
  '/images/evara-07.jpg',
];

function MarqueeRow() {
  return (
    <>
      {MARQUEE.map((src, i) => (
        <figure className="swan-marquee__item" key={`${src}-${i}`}>
          <img src={src} alt="" loading="lazy" />
        </figure>
      ))}
    </>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      // Blur → unblur the welcome block, line by line, as the user scrolls
      // through the section. Each child of .swan-welcome (headline → body
      // → CTA) unblurs in quick sequence via stagger. Tight stagger + short
      // per-element duration keeps the reveal snappy.
      // NOTE: Hero is pinned for +=200% above this section, so viewport-
      // relative triggers like "top 85%" fire while Hero is still pinned
      // and Manifesto isn't visible yet. Anchor to "top top" (section top
      // = viewport top, i.e. the moment Hero unpins) and run over the
      // first 40% of the section so the reveal feels fast.
      // One-shot reveal on enter (no scrub) — scrubbed `filter: blur()`
      // recomputes a GPU blur every scroll tick on three text elements,
      // which is the main scroll-jank source in this section.
      gsap.fromTo(
        '.swan-welcome > *',
        { filter: 'blur(10px)', autoAlpha: 0.3 },
        {
          filter: 'blur(0px)',
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.swan-polaroids',
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, section);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} className="swan" id="philosophy">
      <img
        className="swan-paper"
        src="/images/paper.png"
        alt=""
        aria-hidden
      />
      <div className="swan-paper-fade" aria-hidden />

      {/* Atelier + Heritage sub — commented out for now, keeping copy for re-use elsewhere
      <div className="swan-script-block" aria-hidden>
        <span className="swan-title-script">Atelier</span>
        <p className="swan-script-sub">
          Heritage estates &amp;
          <br />
          private villas across Iberia.
        </p>
      </div>
      */}

      <span className="swan-welcome-tag">Welcome to Evara</span>

      <div className="swan-polaroids">
        {PHOTOS.map((p, i) => (
          <div key={p.src} className={`swan-polaroid-slot swan-polaroid-slot--${i}`}>
            <figure className="swan-polaroid">
              <img src={p.src} alt={p.alt} loading="lazy" />
              {p.caption && <figcaption>{p.caption}</figcaption>}
            </figure>
          </div>
        ))}
      </div>

      <div className="swan-welcome">
        <h3 className="swan-welcome-headline">
          A wedding, written
          <br />
          in your own hand.
        </h3>
        <p className="swan-welcome-body">
          We design weddings the way couture is made &mdash; slowly, in private,
          to a single measure. No template, no spectacle for its own sake.
          Only the rituals that matter to you, set in rooms that know how to
          hold them, with the kind of detail your family will remember by
          name.
        </p>
      </div>

      <div className="swan-marquee" aria-hidden>
        <div className="swan-marquee__track">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>


      {/* EVARA caps + sub para — commented out for now, will reuse copy elsewhere
      <h2 className="swan-title">
        <span className="swan-title-caps">EVARA</span>
        <p className="swan-title-sub">
          Royal weddings, soulfully designed
          <br />
          for the moment and the family album.
        </p>
      </h2>
      */}

    </section>
  );
}
