import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './Manifesto.css';

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=720&q=80',
    alt: 'Bride seated in white silk',
    rotate: -6,
    translate: '40px, -10px',
  },
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=720&q=80',
    alt: 'Bride and groom toasting champagne',
    rotate: 0,
    translate: '0, 22px',
    caption: 'love is in the air',
  },
  {
    src: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=720&q=80',
    alt: 'Wedding cake with cherries',
    rotate: 5,
    translate: '-30px, 0',
  },
];

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
          Where Every Love Story Finds Its Magic
        </h3>
        <p className="swan-welcome-body">
          Let your royal love story unfold in a canvas of timeless elegance
          where every detail is artfully curated and every memory becomes a
          masterpiece. Step into EVARA&apos;s world of everlasting celebration,
          where moments shine with grandeur and passion, echoing through
          eternity.
        </p>
        <a className="swan-welcome-cta" href="#services">
          View Services
        </a>
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
