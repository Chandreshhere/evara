import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './Pause.css';

const PAGES = [
  {
    src: '/images/chapters/c1.jpg',
    title: 'Custom Wedding Design',
    tagline: 'Every wedding a royal masterpiece',
  },
  {
    src: '/images/chapters/c2.jpeg',
    title: 'Luxury Guest Management',
    tagline: 'Seamless comfort for every guest',
  },
  {
    src: '/images/chapters/c3.jpeg',
    title: 'Personalized Invitations & Gifting',
    tagline: 'Stories written in every invitation and gift',
  },
  {
    src: '/images/chapters/c4.jpeg',
    title: 'Vendor Coordination & Supervision',
    tagline: 'Trusted partners, flawless execution',
  },
  {
    src: '/images/chapters/c5.jpeg',
    title: 'Ritual Coordination',
    tagline: 'Seamlessly weaving sacred traditions into your celebration',
  },
  {
    src: '/images/chapters/c6.jpg',
    title: 'Grand Venue Selection',
    tagline: 'Palaces and heritage, perfectly chosen',
  },
];

export default function Pause() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    let rafId = 0;

    const heroPinReady = () =>
      ScrollTrigger.getAll().some(
        (t) =>
          t.pin && (t.trigger as HTMLElement | null)?.classList.contains('hero'),
      );

    const setup = () => {
      // Wait until Hero's pin ScrollTrigger has been created. Hero gates
      // its pin behind an image-preload `ready` flag (see Hero.tsx), so it
      // can register seconds after Pause mounts. If we set our trigger up
      // before Hero pins, our `top top` is computed against a layout that
      // is missing 200vh of Hero pin-spacer — Pause then pins partway
      // through Manifesto instead of after it.
      if (!heroPinReady()) {
        rafId = requestAnimationFrame(setup);
        return;
      }
      ctx = gsap.context(() => {
        const pages = gsap.utils.toArray<HTMLElement>('.pause-page');
        gsap.set(pages, { rotationY: 0, transformOrigin: 'left center' });

        // Smooth entrance — the stage slides up + fades in as Manifesto
        // exits, so by the time the pin engages the composition is
        // already in its resting position. No snap.
        gsap.fromTo(
          '.pause-stage',
          { yPercent: 12, autoAlpha: 0.35 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // Extra ~75% on the end leaves room for the closing phase
            // so the book closes during the pin tail and unpins clean.
            end: `+=${(PAGES.length - 1) * 95 + 75}%`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const FLIP = 1.2;
        const OVERLAP = 0.22;
        pages.forEach((page, i) => {
          if (i === pages.length - 1) return;
          const shade = page.querySelector(
            '.pause-page-shade',
          ) as HTMLElement | null;
          const at = i === 0 ? 0 : `-=${OVERLAP}`;
          // Rotation. Slight Z arc — page lifts mid-flip then settles —
          // and the rotation easing is power3.inOut so the leaf accelerates
          // into the turn and lands gently on the other side.
          tl.to(
            page,
            {
              rotationY: -172,
              ease: 'power3.inOut',
              duration: FLIP,
            },
            at,
          )
            .to(
              page,
              {
                z: 22,
                ease: 'sine.inOut',
                duration: FLIP / 2,
                yoyo: true,
                repeat: 1,
              },
              `<`,
            );
          if (shade) {
            // Triangle ramp — shade peaks at 90° (mid-flip, page perpendicular
            // to the eye, max self-shadow) then fades as the leaf lays down.
            tl.to(
              shade,
              { opacity: 0.6, duration: FLIP / 2, ease: 'sine.in' },
              `<`,
            ).to(
              shade,
              { opacity: 0, duration: FLIP / 2, ease: 'sine.out' },
              `>`,
            );
          }
        });

        // Closing phase — once every leaf has been turned, restack them
        // in reverse so the book visibly closes during the pin tail.
        // Stagger from the last-flipped leaf back to the first so the
        // closure reads as the book being shut, not snapped flat.
        const flipped = pages.slice(0, -1).reverse();
        tl.to(
          flipped,
          {
            rotationY: 0,
            ease: 'power2.inOut',
            duration: 0.9,
            stagger: 0.12,
          },
          '+=0.15',
        );
      }, section);
      ScrollTrigger.refresh();
    };

    rafId = requestAnimationFrame(setup);
    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} className="pause" id="splendor">
      <div className="pause-stage">
        <picture>
          <source srcSet="/images/paper.avif" type="image/avif" />
          <img className="pause-paper" src="/images/paper.png" alt="" aria-hidden />
        </picture>

        <span className="pause-eyebrow">Begin your royal journey</span>

        <h2 className="pause-headline" aria-label="Step into the splendor">
          <span className="pause-headline-word pause-headline-word--tl">
            STEP&nbsp;INTO
          </span>
          <span className="pause-headline-word pause-headline-word--tr">
            THE&nbsp;<em className="pause-script">splendor</em>
          </span>
        </h2>

        <p className="pause-body pause-body--lb">
          Let EVARA be your gateway to celebrations conceived in regal
          imagination and crafted with flawless artistry. Our suite of exquisite
          services transforms every moment&mdash;from the entrance to the final
          blessing&mdash;into a story woven with tradition, joy, and luxury.
        </p>
        <p className="pause-body pause-body--rt">
          Whether you desire a majestic palace gathering or an intimate affair
          drenched in heritage, our expertise ensures your experience is as
          extraordinary as your love story.
        </p>

        <div className="pause-book" aria-hidden>
          <div className="pause-book-stage">
            {PAGES.map((p, i) => (
              <div
                key={`${p.title}-${i}`}
                className="pause-page"
                style={{ zIndex: PAGES.length - i }}
              >
                <div className="pause-page-face pause-page-face--front">
                  <img src={p.src} alt="" loading="lazy" />
                  <div className="pause-page-caption">
                    <span className="pause-page-num">
                      N&deg; {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="pause-page-title">{p.title}</h3>
                    <p className="pause-page-tagline">{p.tagline}</p>
                  </div>
                  <div className="pause-page-shade" />
                </div>
                <div className="pause-page-face pause-page-face--back">
                  <span className="pause-page-folio">EVARA &middot; {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="pause-mark">( EVARA &middot; ATELIER )</span>
      </div>
    </section>
  );
}
