import { useEffect, useRef, useState } from 'react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger } from '../lib/gsap';
import Footer from '../sections/Footer';
import './Services.css';

const SERVICES = [
  {
    n: '01',
    chapter: 'Chapter I',
    title: 'Royal Weddings',
    sub: 'Heritage forts, marble courtyards & mandap couture',
    body: 'Three-day celebrations carved into palaces — every garland tied, every aarti choreographed, every guest received like family.',
    image: '/images/evara-01.jpg',
    accent: 'Bespoke',
  },
  {
    n: '02',
    chapter: 'Chapter II',
    title: 'Destination Escapes',
    sub: 'Coastlines, vineyards & cliffside ceremonies',
    body: 'From Como to Kerala, we build ceremonies that move with you — flights, fittings, florals — composed into a quiet itinerary.',
    image: '/images/evara-03.jpg',
    accent: 'Wandering',
  },
  {
    n: '03',
    chapter: 'Chapter III',
    title: 'Editorial Design',
    sub: 'Art-direction, stationery & cinematic production',
    body: 'A creative studio for every printed corner of your wedding — invitations, menu cards, film direction, and the keepsake archive.',
    image: '/images/evara-05.jpg',
    accent: 'Storied',
  },
  {
    n: '04',
    chapter: 'Chapter IV',
    title: 'Private Soirées',
    sub: 'Sangeets, cocktail evenings & after-parties',
    body: 'Intimate evenings staged with restraint and rhythm — bar programs, live ensembles, and a guest list that lingers past midnight.',
    image: '/images/evara-06.jpg',
    accent: 'Intimate',
  },
  {
    n: '05',
    chapter: 'Chapter V',
    title: 'Heirloom Anniversaries',
    sub: 'Vow-renewals, milestone galas & family rituals',
    body: 'Celebrations of the years already lived — gathered with the same care we bring to a first wedding day.',
    image: '/images/evara-07.jpg',
    accent: 'Lasting',
  },
];

const PILLARS = [
  { k: 'Atelier-led', v: 'Single design lead from first call to final farewell.' },
  { k: 'Discreet', v: 'NDA-bound team. Every guest list closed to the press.' },
  { k: 'Worldwide', v: 'Permitting, logistics & vendor diplomacy on three continents.' },
  { k: 'Archival', v: 'A printed monograph delivered six months after your day.' },
];

export default function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);

  // Hero: split-text rise + drifting decorative shapes + cursor parallax
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const head = root.querySelector('.svc-hero-head') as HTMLElement | null;
      const sub = root.querySelector('.svc-hero-sub') as HTMLElement | null;
      let splitHead: SplitType | null = null;
      let splitSub: SplitType | null = null;

      if (head) {
        splitHead = new SplitType(head, { types: 'lines,words,chars' });
        gsap.from(splitHead.chars, {
          yPercent: 130,
          rotate: 6,
          opacity: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: { each: 0.018, from: 'start' },
          delay: 0.15,
        });
      }
      if (sub) {
        splitSub = new SplitType(sub, { types: 'lines,words' });
        gsap.from(splitSub.words, {
          yPercent: 100,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.025,
          delay: 0.6,
        });
      }

      gsap.from('.svc-hero-eyebrow', {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: 'power2.out',
      });
      gsap.from('.svc-hero-meta > *', {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.9,
      });
      gsap.from('.svc-hero-rule', {
        scaleX: 0,
        transformOrigin: '0 50%',
        duration: 1.4,
        ease: 'expo.out',
        delay: 1.1,
      });

      // Scroll takeover — tiles fly OUT to their corners and headline
      // lifts + blurs as the hero scrolls past. NOT pinned: the showcase
      // section below rises into view at the same time, which is what
      // gives the "section coming up while hero blurs" feel.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        '.svc-hero-tile--tl',
        { xPercent: -180, yPercent: -60, autoAlpha: 0, ease: 'none' },
        0,
      )
        .to(
          '.svc-hero-tile--tr',
          { xPercent: 180, yPercent: -60, autoAlpha: 0, ease: 'none' },
          0,
        )
        .to(
          '.svc-hero-tile--bl',
          { xPercent: -180, yPercent: 60, autoAlpha: 0, ease: 'none' },
          0,
        )
        .to(
          '.svc-hero-tile--br',
          { xPercent: 180, yPercent: 60, autoAlpha: 0, ease: 'none' },
          0,
        );

      tl.to(
        '.svc-hero-head, .svc-hero-sub, .svc-hero-eyebrow, .svc-hero-meta, .svc-hero-rule',
        {
          y: -40,
          scale: 0.94,
          filter: 'blur(6px)',
          autoAlpha: 0,
          ease: 'none',
          duration: 0.8,
        },
        0,
      );

      return () => {
        splitHead?.revert();
        splitSub?.revert();
      };
    }, root);
    return () => ctx.revert();
  }, []);

  // Horizontal pinned showcase
  useEffect(() => {
    const section = showcaseRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.svc-card');
      const mm = gsap.matchMedia();

      // ---- Rise-up entrance ----
      // Slide the showcase content up from below WHILE the hero is
      // still scrolling and its text is blurring out. Animates only the
      // inner rail + track so the section's own bounding box stays
      // clean for the horizontal pin trigger that fires next.
      const riseTrigger = {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(
        '.svc-showcase-rail',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: riseTrigger },
      );
      gsap.fromTo(
        track,
        { yPercent: 50, opacity: 0.3, scale: 0.94 },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          ease: 'none',
          transformOrigin: '50% 100%',
          scrollTrigger: riseTrigger,
        },
      );

      mm.add('(min-width: 901px)', () => {
        const totalScroll = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -totalScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalScroll()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        cards.forEach((card) => {
          const img = card.querySelector('.svc-card-img') as HTMLElement | null;
          const cover = card.querySelector('.svc-card-cover') as HTMLElement | null;
          const num = card.querySelector('.svc-card-num') as HTMLElement | null;
          const title = card.querySelector('.svc-card-title') as HTMLElement | null;
          const meta = card.querySelectorAll('.svc-card-meta > *');
          const dataIdx = card.dataset.idx;
          const serviceIdx = dataIdx != null ? Number(dataIdx) : -1;

          if (cover) {
            gsap.fromTo(
              cover,
              { scaleY: 1 },
              {
                scaleY: 0,
                transformOrigin: 'top center',
                ease: 'power3.inOut',
                duration: 1.2,
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: 'left 80%',
                  end: 'left 30%',
                  scrub: false,
                  toggleActions: 'play none none reverse',
                  onEnter: () => {
                    if (serviceIdx >= 0 && serviceIdx < SERVICES.length) {
                      setActiveIdx(serviceIdx);
                    }
                  },
                  onEnterBack: () => {
                    if (serviceIdx >= 0 && serviceIdx < SERVICES.length) {
                      setActiveIdx(serviceIdx);
                    }
                  },
                },
              },
            );
          }
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.35, filter: 'grayscale(1) contrast(1.05)' },
              {
                scale: 1,
                filter: 'grayscale(0) contrast(1.05)',
                ease: 'power3.out',
                duration: 1.6,
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: 'left 80%',
                  end: 'left 20%',
                  scrub: 1,
                },
              },
            );
          }
          if (num) {
            gsap.from(num, {
              yPercent: 110,
              opacity: 0,
              ease: 'expo.out',
              duration: 1.2,
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left 70%',
                toggleActions: 'play none none reverse',
              },
            });
          }
          if (title) {
            const split = new SplitType(title, { types: 'words' });
            gsap.from(split.words, {
              yPercent: 110,
              opacity: 0,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left 70%',
                toggleActions: 'play none none reverse',
              },
            });
          }
          if (meta.length) {
            gsap.from(meta, {
              y: 26,
              opacity: 0,
              duration: 0.9,
              ease: 'power2.out',
              stagger: 0.08,
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left 65%',
                toggleActions: 'play none none reverse',
              },
            });
          }
        });

        // Progress bar
        gsap.to('.svc-progress-bar', {
          scaleX: 1,
          ease: 'none',
          transformOrigin: '0 50%',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalScroll()}`,
            scrub: true,
          },
        });
      });

      // Mobile: stacked scroll-driven reveals
      mm.add('(max-width: 900px)', () => {
        cards.forEach((card) => {
          const img = card.querySelector('.svc-card-img');
          const cover = card.querySelector('.svc-card-cover');
          const dataIdx = card.dataset.idx;
          const serviceIdx = dataIdx != null ? Number(dataIdx) : -1;

          if (img) {
            gsap.from(img, {
              scale: 1.25,
              filter: 'grayscale(1)',
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
                onEnter: () => {
                  if (serviceIdx >= 0 && serviceIdx < SERVICES.length) {
                    setActiveIdx(serviceIdx);
                  }
                },
                onEnterBack: () => {
                  if (serviceIdx >= 0 && serviceIdx < SERVICES.length) {
                    setActiveIdx(serviceIdx);
                  }
                },
              },
            });
          }
          if (cover) {
            gsap.from(cover, {
              scaleY: 1,
              transformOrigin: 'top center',
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            });
          }
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Awards-style massive headline that auto-cycles accent words.
  // No pin / no extra scroll — just one viewport tall, words morph
  // on a loop, decorative accent drifts on a parallax.
  useEffect(() => {
    const section = awardsRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.svc-awards-word');
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(words[0], { yPercent: 0, opacity: 1 });

      // Auto-cycle through words on a loop. Pauses when the section is
      // off-screen to save cycles + so the user always lands on the
      // first word when scrolling back into view.
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.4,
        defaults: { ease: 'expo.out' },
        paused: true,
      });
      words.forEach((w, i) => {
        if (i === 0) return;
        tl.to(
          words[i - 1],
          { yPercent: -110, opacity: 0, duration: 0.55, ease: 'power3.in' },
          `+=1.4`,
        ).to(
          w,
          { yPercent: 0, opacity: 1, duration: 0.7 },
          '<0.05',
        );
      });
      // Loop the last word back to the first.
      tl.to(
        words[words.length - 1],
        { yPercent: -110, opacity: 0, duration: 0.55, ease: 'power3.in' },
        `+=1.4`,
      ).to(words[0], { yPercent: 0, opacity: 1, duration: 0.7 }, '<0.05');

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });

      // Header reveal
      gsap.from('.svc-awards-eyebrow, .svc-awards-head, .svc-awards-sub', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Pillars stagger
      gsap.from('.svc-pillar', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.svc-pillars',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Stamp (✦) gently rotates as the section scrolls past.
      gsap.to('.svc-awards-stamp', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Magnetic CTA
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const onMove = (e: MouseEvent) => {
      const r = cta.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(cta, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.6,
        ease: 'power3.out',
      });
    };
    const onLeave = () => {
      gsap.to(cta, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' });
    };
    cta.addEventListener('mousemove', onMove);
    cta.addEventListener('mouseleave', onLeave);
    return () => {
      cta.removeEventListener('mousemove', onMove);
      cta.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="svc">
      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="svc-hero">
        <picture className="svc-hero-paper" aria-hidden>
          <source srcSet="/images/paper.avif" type="image/avif" />
          <img src="/images/paper.png" alt="" />
        </picture>

        {/* Four corner tiles — fly out on scroll, same as Home hero */}
        <figure className="svc-hero-tile svc-hero-tile--tl">
          <img src="/images/1.jpeg" alt="Royal bridal portrait" />
        </figure>
        <figure className="svc-hero-tile svc-hero-tile--tr">
          <img src="/images/3.jpeg" alt="Mandap ceremony at golden hour" />
        </figure>
        <figure className="svc-hero-tile svc-hero-tile--bl">
          <img src="/images/4.jpeg" alt="Couple portrait at a Rajasthan wedding" />
        </figure>
        <figure className="svc-hero-tile svc-hero-tile--br">
          <img src="/images/5.jpeg" alt="Floral decor detail from an Evara wedding" />
        </figure>

        <span className="svc-hero-eyebrow">
          The EVARA Atelier <span aria-hidden>—</span> Services
        </span>

        <h1 className="svc-hero-head">
          A celebration,
          <br />
          composed by hand.
        </h1>

        <p className="svc-hero-sub">
          Five quiet disciplines, one atelier — weddings, escapes, editorial,
          soirées and heirloom anniversaries, each built from a single design
          conversation that begins long before the invitations are mailed.
        </p>

        <div className="svc-hero-rule" aria-hidden />

        <div className="svc-hero-meta">
          <span>Est. 2014</span>
          <span>·</span>
          <span>120+ Weddings</span>
          <span>·</span>
          <span>Three Continents</span>
          <span>·</span>
          <span>One Atelier</span>
        </div>

      </section>

      {/* ---------- HORIZONTAL PINNED SHOWCASE ---------- */}
      <section
        id="showcase"
        ref={showcaseRef}
        className="svc-showcase"
        aria-label="Services showcase"
      >
        <div className="svc-showcase-rail">
          <span className="svc-showcase-eyebrow">
            <em>{String(activeIdx + 1).padStart(2, '0')}</em>
            &nbsp;/&nbsp;
            {String(SERVICES.length).padStart(2, '0')}
          </span>
          <span className="svc-showcase-current">
            {SERVICES[activeIdx]?.title ?? SERVICES[0].title}
          </span>
          <div className="svc-progress">
            <div className="svc-progress-bar" />
          </div>
        </div>

        <div ref={trackRef} className="svc-track">
          <div className="svc-card svc-card--intro">
            <div className="svc-intro">
              <span className="svc-intro-eyebrow">The Menu</span>
              <h2 className="svc-intro-head">
                Five chapters,
                <br />
                <em>one studio.</em>
              </h2>
              <p className="svc-intro-body">
                Glide through the offerings — every chapter is a complete
                world, built from the same atelier hand.
              </p>
              <span className="svc-intro-arrow" aria-hidden>
                &rarr;
              </span>
            </div>
          </div>

          {SERVICES.map((s, idx) => (
            <article
              key={s.n}
              className="svc-card svc-card--service"
              data-idx={idx}
            >
              <div className="svc-card-frame">
                <img className="svc-card-img" src={s.image} alt={s.title} />
                <div className="svc-card-cover" aria-hidden />
                <span className="svc-card-stamp">{s.accent}</span>
              </div>

              <div className="svc-card-body">
                <span className="svc-card-num">{s.n}</span>
                <span className="svc-card-chapter">{s.chapter}</span>
                <h3 className="svc-card-title">{s.title}</h3>
                <p className="svc-card-sub">{s.sub}</p>
                <div className="svc-card-meta">
                  <p>{s.body}</p>
                  <a className="svc-card-link" href="/contact">
                    Begin this chapter <span aria-hidden>&rarr;</span>
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="svc-card svc-card--outro">
            <div className="svc-intro">
              <span className="svc-intro-eyebrow">The Atelier</span>
              <h2 className="svc-intro-head">
                Begin
                <br />
                <em>your chapter.</em>
              </h2>
              <a href="/contact" className="svc-intro-cta">
                Reserve a consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- AWARDS-STYLE MORPHING TYPE ---------- */}
      <section ref={awardsRef} className="svc-awards">
        <span className="svc-awards-stamp" aria-hidden>
          ✦
        </span>
        <span className="svc-awards-eyebrow">
          <span className="svc-awards-eyebrow-line" aria-hidden />
          The Atelier promise
          <span className="svc-awards-eyebrow-line" aria-hidden />
        </span>

        <h2 className="svc-awards-head">
          We design
          <span className="svc-awards-rotor" aria-hidden>
            <span className="svc-awards-word">heirlooms.</span>
            <span className="svc-awards-word">escapes.</span>
            <span className="svc-awards-word">archives.</span>
            <span className="svc-awards-word">rituals.</span>
            <span className="svc-awards-word">memory.</span>
          </span>
        </h2>

        <p className="svc-awards-sub">
          Not events. Not weekends. Things your family will quote by name in
          forty years — and a printed monograph to prove they happened.
        </p>

        <span className="svc-awards-divider" aria-hidden />

        <div className="svc-pillars">
          {PILLARS.map((p, i) => (
            <div key={p.k} className="svc-pillar">
              <span className="svc-pillar-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="svc-pillar-k">{p.k}</span>
              <span className="svc-pillar-v">{p.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="svc-cta">
        <span className="svc-cta-eyebrow">Step inside</span>
        <h2 className="svc-cta-head">
          Reserve a <em>private</em> consultation.
        </h2>
        <p className="svc-cta-sub">
          Six couples a year. We listen first, then build a single proposal
          that reads like the wedding itself.
        </p>
        <a ref={ctaRef} href="/contact" className="svc-cta-button">
          <span>Begin a chapter</span>
          <span className="svc-cta-arrow" aria-hidden>
            &rarr;
          </span>
        </a>
      </section>

      <Footer />
    </div>
  );
}
