import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import './BlackSection.css';

const FEATURED = [
  { slug: 'a', name: 'ETERNAL',  tagline: 'A study in elegance',    locale: 'Vol. III',   image: '/images/evara-04.jpg' },
  { slug: 'b', name: 'HEIRLOOM', tagline: 'Pages of forever',       locale: 'Folio I',    image: '/images/evara-05.jpg' },
  { slug: 'c', name: 'VOWS',     tagline: 'The art of the promise', locale: 'Issue 04',   image: '/images/evara-07.jpg' },
  { slug: 'd', name: 'FOLIO',    tagline: 'Heritage in motion',     locale: 'Edit 12',    image: '/images/evara-01.jpg' },
  { slug: 'e', name: 'ROMANCE',  tagline: 'Whispered traditions',   locale: 'Series II',  image: '/images/evara-02.jpg' },
  { slug: 'f', name: 'LEGACY',   tagline: 'A canvas of love',       locale: 'Vol. V',     image: '/images/evara-03.jpg' },
  { slug: 'g', name: 'RITUAL',   tagline: 'Slow ceremonies',        locale: 'Folio VII',  image: '/images/evara-06.jpg' },
  { slug: 'h', name: 'SONNET',   tagline: 'Cinema of celebration',  locale: 'Issue 02',   image: '/images/evara-04.jpg' },
  { slug: 'i', name: 'ENVOI',    tagline: 'The quiet glamour',      locale: 'Edit 09',    image: '/images/evara-05.jpg' },
  { slug: 'j', name: 'CANTO',    tagline: 'Velvet evenings',        locale: 'Series I',   image: '/images/evara-07.jpg' },
  { slug: 'k', name: 'ATELIER',  tagline: 'Marigold mornings',      locale: 'Vol. II',    image: '/images/evara-01.jpg' },
  { slug: 'l', name: 'BLOOM',    tagline: 'A tender procession',    locale: 'Folio X',    image: '/images/evara-03.jpg' },
];

export default function BlackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [radius, setRadius] = useState(500);
  const [cardWidth, setCardWidth] = useState(160);
  const angleRef = useRef(0);
  const dragRef = useRef({
    startX: 0,
    startAngle: 0,
    isDragging: false,
    isActive: false,
    lastX: 0,
    velocity: 0,
  });

  const total = FEATURED.length;
  const anglePerCard = 360 / total;

  const tickerRef = useRef<((t: number, dt: number) => void) | null>(null);
  const hoverCountRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setRadius(w < 768 ? Math.max(w * 0.7, 280) : Math.max(w * 0.4, 430));
      setCardWidth(w < 768 ? 135 : Math.min(Math.max(w * 0.14, 180), 240));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const stopAutoSpin = useCallback(() => {
    if (tickerRef.current) {
      gsap.ticker.remove(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const startAutoSpin = useCallback(() => {
    if (tickerRef.current) return;
    const speed = -6; // degrees per second (one full revolution per 60s)
    const tick = (_t: number, dt: number) => {
      angleRef.current += speed * (dt / 1000);
      const drum = drumRef.current;
      if (drum) {
        gsap.set(drum, {
          rotateY: angleRef.current,
          x: '-50%',
          y: '-50%',
        });
      }
    };
    gsap.ticker.add(tick);
    tickerRef.current = tick;
  }, []);

  const setDrumAngle = useCallback((angle: number) => {
    const drum = drumRef.current;
    if (!drum) return;
    angleRef.current = angle;
    gsap.set(drum, {
      rotateY: angle,
      x: '-50%',
      y: '-50%',
    });
  }, []);

  const animateToAngle = useCallback(
    (angle: number, duration = 0.5) => {
      const drum = drumRef.current;
      if (!drum) return;
      const proxy = { v: angleRef.current };
      const normalizedAngle = ((-angle % 360) + 360) % 360;
      const nearest = Math.round(normalizedAngle / anglePerCard) % total;
      setCurrent(nearest);
      gsap.to(proxy, {
        v: angle,
        duration,
        ease: 'expo.out',
        overwrite: true,
        onUpdate: () => {
          angleRef.current = proxy.v;
          gsap.set(drum, { rotateY: proxy.v, x: '-50%', y: '-50%' });
        },
        onComplete: () => {
          startAutoSpin();
        },
      });
    },
    [anglePerCard, total, startAutoSpin],
  );

  const snapToNearest = useCallback(
    (extraMomentum = 0) => {
      const currentAngle = angleRef.current + extraMomentum;
      const normalizedAngle = ((-currentAngle % 360) + 360) % 360;
      const nearestIndex = Math.round(normalizedAngle / anglePerCard) % total;
      const snapAngle = -nearestIndex * anglePerCard;
      let diff = snapAngle - currentAngle;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      animateToAngle(currentAngle + diff, 1.2);
    },
    [anglePerCard, total, animateToAngle],
  );

  const goTo = useCallback(
    (index: number) => {
      stopAutoSpin();
      const wrapped = ((index % total) + total) % total;
      const targetAngle = -wrapped * anglePerCard;
      let diff = targetAngle - angleRef.current;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      const finalAngle = angleRef.current + diff;
      setCurrent(wrapped);
      const proxy = { v: angleRef.current };
      gsap.to(proxy, {
        v: finalAngle,
        duration: 0.9,
        ease: 'expo.out',
        overwrite: true,
        onUpdate: () => {
          angleRef.current = proxy.v;
          gsap.set(drumRef.current, {
            rotateY: proxy.v,
            x: '-50%',
            y: '-50%',
          });
        },
        onComplete: () => startAutoSpin(),
      });
    },
    [total, anglePerCard, stopAutoSpin, startAutoSpin],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    setDrumAngle(0);
    startAutoSpin();

    const ctx = gsap.context(() => {
      const headerEls = section.querySelectorAll('.bs-reveal');
      gsap.fromTo(
        headerEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
          },
        },
      );

      const track = trackRef.current;
      if (track) {
        gsap.fromTo(
          track,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: track,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    }, section);

    return () => {
      ctx.revert();
      stopAutoSpin();
    };
  }, [setDrumAngle, startAutoSpin, stopAutoSpin]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const handlePointerDown = (e: React.PointerEvent) => {
    stopAutoSpin();
    gsap.killTweensOf(drumRef.current);
    dragRef.current = {
      startX: e.clientX,
      startAngle: angleRef.current,
      isDragging: true,
      isActive: false,
      lastX: e.clientX,
      velocity: 0,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    if (!dragRef.current.isActive) {
      if (Math.abs(deltaX) < 8) return;
      dragRef.current.isActive = true;
    }
    const sensitivity =
      typeof window !== 'undefined'
        ? window.innerWidth < 768
          ? window.innerWidth / 8
          : window.innerWidth / 14
        : 100;
    const angleDelta = (deltaX / sensitivity) * anglePerCard;
    const newAngle = dragRef.current.startAngle + angleDelta;

    dragRef.current.velocity = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;

    setDrumAngle(newAngle);
  };

  const handlePointerUp = () => {
    if (!dragRef.current.isDragging) return;
    const wasActive = dragRef.current.isActive;
    dragRef.current.isDragging = false;
    dragRef.current.isActive = false;
    if (!wasActive) {
      startAutoSpin();
      return;
    }

    // Free-stop: glide a touch with the release momentum and stay
    // wherever the user let go — no snapping to the nearest card.
    const sensitivity =
      typeof window !== 'undefined'
        ? window.innerWidth < 768
          ? window.innerWidth / 8
          : window.innerWidth / 14
        : 100;
    const coast =
      (dragRef.current.velocity * 0.04 / sensitivity) * anglePerCard;
    const targetAngle = angleRef.current + coast;

    // Keep the dot/index in sync with the visible card without
    // forcing the rotation onto its center.
    const normalized = ((-targetAngle % 360) + 360) % 360;
    setCurrent(Math.round(normalized / anglePerCard) % total);

    const proxy = { v: angleRef.current };
    gsap.killTweensOf(proxy);
    gsap.to(proxy, {
      v: targetAngle,
      duration: 0.55,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        angleRef.current = proxy.v;
        gsap.set(drumRef.current, {
          rotateY: proxy.v,
          x: '-50%',
          y: '-50%',
        });
      },
      onComplete: () => startAutoSpin(),
    });
  };

  return (
    <section
      ref={sectionRef}
      id="black-section"
      className="bs-section"
      aria-labelledby="bs-heading"
    >
      <div className="bs-grain" aria-hidden />

      <picture>
        <source srcSet="/images/decor-2.avif" type="image/avif" />
        <img
          className="bs-decor bs-decor--bottom-left"
          src="/images/decor-2.png"
          alt=""
          aria-hidden
        />
      </picture>

      <div className="bs-content">
        <div className="bs-top">
          <div className="bs-top-left">
            <h2 id="bs-heading" className="bs-headline bs-reveal">
              Explore the <em>Chapters</em>
            </h2>
          </div>
        </div>

        <div
          ref={trackRef}
          className="bs-track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={drumRef}
            className="bs-drum"
            style={{ transform: 'translate(-50%, -50%) rotateY(0deg)' }}
          >
            {FEATURED.map((product, i) => {
              const angle = i * anglePerCard;
              return (
                <div
                  key={product.slug}
                  className="bs-card"
                  onClick={() => {
                    if (i !== current) goTo(i);
                  }}
                  onMouseEnter={(e) => {
                    hoverCountRef.current += 1;
                    stopAutoSpin();
                    const frame = e.currentTarget.querySelector(
                      '.bs-card-frame',
                    );
                    if (frame) {
                      gsap.to(frame, {
                        scale: 1.12,
                        rotationZ: -3,
                        rotationY: 6,
                        duration: 0.55,
                        ease: 'power3.out',
                        overwrite: 'auto',
                      });
                    }
                  }}
                  onMouseLeave={(e) => {
                    hoverCountRef.current = Math.max(
                      0,
                      hoverCountRef.current - 1,
                    );
                    const frame = e.currentTarget.querySelector(
                      '.bs-card-frame',
                    );
                    const resume = () => {
                      if (hoverCountRef.current === 0) startAutoSpin();
                    };
                    if (frame) {
                      gsap.to(frame, {
                        scale: 1,
                        rotationZ: 0,
                        rotationY: 0,
                        duration: 0.55,
                        ease: 'power3.out',
                        overwrite: 'auto',
                        onComplete: resume,
                      });
                    } else {
                      resume();
                    }
                  }}
                  style={{
                    width: `${cardWidth}px`,
                    transform: `translate(-50%, -60%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div className="bs-card-frame">
                    <img
                      src={product.image}
                      alt={product.name}
                      draggable={false}
                      loading="lazy"
                    />
                    <div className="bs-card-shade" />
                    <div className="bs-card-editorial">
                      <span className="bs-card-eyebrow">
                        Chapter N° {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="bs-card-name">{product.name}</h3>
                      <p className="bs-card-tagline">{product.tagline}</p>
                      <span className="bs-card-locale">
                        {product.locale} &middot; EVARA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bs-foot">
          <p className="bs-body bs-body--left bs-reveal">
            Twelve chapters, twelve worlds — palaces, vineyards, and coastlines
            curated into a single editorial journey through the EVARA atelier.
          </p>
          <p className="bs-body bs-body--right bs-reveal">
            Step into a celebration crafted with timeless elegance and
            heartfelt artistry. Let EVARA transform your love story into a
            regal affair destined to be remembered for generations.
          </p>
        </div>
      </div>
    </section>
  );
}
