import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './Process.css';

const STEPS = [
  {
    n: '01',
    title: 'Discovery & Vision',
    body: 'We begin by understanding your love story, personality, and dreams to create a celebration uniquely yours.',
  },
  {
    n: '02',
    title: 'Design & Planning',
    body: 'Our expert team curates every detail: venue, décor, ritual, blending tradition with luxurious elegance. All with your approval, of course.',
  },
  {
    n: '03',
    title: 'Vendor Coordination',
    body: 'We carefully select and manage trusted partners, ensuring seamless execution and flawless experiences.',
  },
  {
    n: '04',
    title: 'Celebration & Beyond',
    body: 'From the grand ceremony to heartfelt moments, we orchestrate your wedding journey with grace and joy.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const journey = journeyRef.current;
    const section = sectionRef.current;
    if (!journey || !section) return;
    const ctx = gsap.context(() => {
      gsap.set(journey, { transformOrigin: '50% 100%' });
      gsap.to(journey, {
        rotation: 5,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(journey, {
        skewX: 2.6,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Reveal each step from blurred → sharp as the user scrolls past
      // it. Staggered so the column reads top-down, never all at once.
      gsap.fromTo(
        '.process-step',
        { filter: 'blur(14px)', autoAlpha: 0, y: 40 },
        {
          filter: 'blur(0px)',
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          duration: 1,
          stagger: 0.18,
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.6,
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
    <section ref={sectionRef} className="process" id="process">
      <span className="process-eyebrow">Our Process</span>

      <div className="process-content">
        <h2 className="process-headline">
          A wedding,
          <br />
          <em className="process-headline-script">orchestrated</em>
        </h2>

        <ol className="process-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="process-step">
              <span className="process-step-num">{s.n}</span>
              <div className="process-step-body">
                <h3 className="process-step-title">{s.title}</h3>
                <p className="process-step-text">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <picture>
        <source srcSet="/images/journey.avif" type="image/avif" />
        <img
          ref={journeyRef}
          className="process-journey"
          src="/images/journey.png"
          alt="The Evara journey through royal Indian wedding planning"
        />
      </picture>
    </section>
  );
}
