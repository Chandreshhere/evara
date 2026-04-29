import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { lockScroll, unlockScroll } from '../lib/lenis';
import './Hero.css';

const TILES = [
  {
    pos: 'top-left',
    src: '/images/1.jpeg',
    alt: 'Wedding moment one',
  },
  {
    pos: 'top-center',
    src: '/images/5.jpeg',
    alt: 'Wedding moment five',
  },
  {
    pos: 'top-right',
    src: '/images/2.jpeg',
    alt: 'Wedding moment two',
  },
  {
    pos: 'bottom-left',
    src: '/images/3.jpeg',
    alt: 'Wedding moment three',
  },
  {
    pos: 'bottom-right',
    src: '/images/4.jpeg',
    alt: 'Wedding moment four',
  },
];

const FRAME_COUNT = 192;
const FRAME_BASE_PATH = '/frames/wedding/f_';
const FRAME_W = 720;
const FRAME_H = 768;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Preload all video frames once. Drawing the first frame as soon as it's
  // ready so the canvas isn't blank on initial paint.
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_BASE_PATH}${String(i).padStart(4, '0')}.jpg`;
      images.push(img);
    }
    framesRef.current = images;

    const drawFirst = () => drawFrame(0);
    if (images[0].complete) drawFirst();
    else images[0].addEventListener('load', drawFirst, { once: true });
  }, []);

  const drawFrame = (idx: number) => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    const img = framesRef.current[idx];
    if (!ctx2d || !img || !img.complete || img.naturalWidth === 0) return;
    ctx2d.drawImage(img, 0, 0, canvas.width, canvas.height);
    currentFrameRef.current = idx;
  };

  // Lock scroll until the 5 tile photos AND the first video frame are
  // decoded — that way the fly-in animation never starts on top of an
  // image that is still loading and there is no sudden layout shift.
  useEffect(() => {
    // Re-arm the boot lock on every mount. In dev StrictMode (and any
    // unmount/remount), the previous mount's takeover useEffect cleanup
    // calls ctx.revert(), which kills the pin and lets manifesto snap
    // back to its pre-pin overlap (margin-top:-55vh). Without re-adding
    // the class here, manifesto would flash inside the hero between the
    // pin teardown and the next pin rebuild.
    document.documentElement.classList.add('evara-loading');
    lockScroll();

    const tileSrcs = TILES.map((t) => t.src);
    const firstFrameSrc = `${FRAME_BASE_PATH}0001.jpg`;
    const sources = [...tileSrcs, firstFrameSrc];

    let remaining = sources.length;
    const onOne = () => {
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    };

    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) onOne();
      else {
        img.addEventListener('load', onOne, { once: true });
        img.addEventListener('error', onOne, { once: true });
      }
    });

    // Safety net — never lock for longer than 4s, even on a slow network
    const failSafe = window.setTimeout(() => setReady(true), 4000);
    return () => {
      window.clearTimeout(failSafe);
      unlockScroll();
      document.documentElement.classList.remove('evara-loading');
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      // No mount/reload animations — everything is rendered in its final
      // state immediately. The scroll-driven takeover is the only animation
      // and it's set up below.
      unlockScroll();

      // Restore the pinned takeover (the version before the parallax detour):
      // tiles fly out, bottom-middle video scales up to 70% zoom, hero text
      // blurs/lifts behind it, frames scrub forward across both phases, the
      // grayscale fades to colour, and the corners curve a touch as it grows.
      // Phase 2 keeps the 70% scale but translates the video up off-screen so
      // the next section can come in from the bottom.
      const bottomCenter = section.querySelector(
        '.hero-tile--bottom-center',
      ) as HTMLElement | null;

      function setupTakeover() {
        if (!bottomCenter) return;
        const rect = bottomCenter.getBoundingClientRect();
        const sx = window.innerWidth / rect.width;
        const sy = window.innerHeight / rect.height;
        const scale = Math.max(sx, sy) * 0.7;
        const dy =
          window.innerHeight / 2 - (rect.top + rect.height / 2);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Tiles fly out + hero scroll arrow fades (phase 1, duration 1)
        tl.to(
          '.hero-tile--top-left',
          { xPercent: -180, yPercent: -40, autoAlpha: 0, ease: 'none' },
          0,
        )
          .to(
            '.hero-tile--top-right',
            { xPercent: 180, yPercent: -40, autoAlpha: 0, ease: 'none' },
            0,
          )
          .to(
            '.hero-tile--top-center',
            { yPercent: -200, autoAlpha: 0, ease: 'none' },
            0,
          )
          .to(
            '.hero-tile--bottom-left',
            { xPercent: -180, yPercent: 40, autoAlpha: 0, ease: 'none' },
            0,
          )
          .to(
            '.hero-tile--bottom-right',
            { xPercent: 180, yPercent: 40, autoAlpha: 0, ease: 'none' },
            0,
          );

        // Video — scale + bottom corner curve happen during phase 1
        // (duration 1), y travel is ONE continuous tween over the full
        // timeline (duration 2) so velocity stays constant.
        const exitY = dy - window.innerHeight;
        tl.to(
          '.hero-tile--bottom-center',
          { scale, ease: 'none', duration: 1 },
          0,
        )
          .to(
            '.hero-video-canvas, .hero-video-fade',
            {
              borderTopLeftRadius: '0%',
              borderTopRightRadius: '0%',
              borderBottomLeftRadius: '50%',
              borderBottomRightRadius: '50%',
              ease: 'none',
              duration: 1,
            },
            0,
          )
          .to(
            '.hero-tile--bottom-center',
            { y: exitY, ease: 'none', duration: 2 },
            0,
          );

        gsap.set('.hero-video-canvas', {
          filter: 'grayscale(1) contrast(1.05)',
        });
        const frameProxy = { idx: 0 };
        tl.to(
          frameProxy,
          {
            idx: FRAME_COUNT - 1,
            ease: 'none',
            duration: 2,
            onUpdate: () => drawFrame(Math.round(frameProxy.idx)),
          },
          0,
        ).to(
          '.hero-video-canvas',
          { filter: 'grayscale(0) contrast(1.05)', ease: 'none' },
          0,
        );

        // Hero text — fully blur + fade out by the end of phase 1 so it's
        // gone before the video starts its phase-2 travel up off-screen.
        tl.to(
          '.hero-center',
          {
            y: -40,
            scale: 0.92,
            filter: 'blur(6px)',
            autoAlpha: 0,
            ease: 'none',
            duration: 0.7,
          },
          0,
        );

        // Side flowers — left draws LEFT → RIGHT, right draws RIGHT → LEFT.
        // Both wipe in lockstep with the takeover progress, so the flowers
        // appear "drawn" inward as the video zooms and lifts.
        tl.fromTo(
          '.hero-flower--left',
          { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            autoAlpha: 1,
            ease: 'none',
            duration: 1.2,
          },
          0,
        ).fromTo(
          '.hero-flower--right',
          { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            autoAlpha: 1,
            ease: 'none',
            duration: 1.2,
          },
          0,
        );
      }

      // Build the takeover ScrollTrigger immediately — no mount-fly-in to
      // wait for. Then refresh so positions are picked up correctly.
      setupTakeover();
      ScrollTrigger.refresh();
      // Boot lock from index.html clipped the doc to a single viewport so
      // lower sections couldn't flash over the hero on reload. Wait one
      // paint frame so the pin spacer is fully laid out (manifesto at its
      // post-pin y, off-viewport) BEFORE we let it become visible — that
      // way it can never paint at its pre-pin overlap position.
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('evara-loading');
      });
    }, section);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [ready]);

  return (
    <section ref={sectionRef} className="hero" id="top">
      {/* Botanical flowers framing the video — left + right.
          Wipe-reveal from top → bottom in lockstep with the takeover
          scroll, so they appear "drawn" as the video zooms and lifts. */}
      <img
        className="hero-flower hero-flower--left"
        src="/images/flower.png"
        alt=""
        aria-hidden
      />
      <img
        className="hero-flower hero-flower--right"
        src="/images/flower.png"
        alt=""
        aria-hidden
      />

      <div className="hero-grid">
        {TILES.map((t) => {
          const dx =
            t.pos.includes('left') ? -160 : t.pos.includes('right') ? 160 : 0;
          const dy = t.pos.startsWith('top') ? -100 : 100;
          return (
            <figure
              key={t.pos}
              className={`hero-tile hero-tile--${t.pos}`}
              data-dx={dx}
              data-dy={dy}
            >
              <img src={t.src} alt={t.alt} />
            </figure>
          );
        })}

        {/* Bottom-middle is a canvas-driven cinematic video, scrubbed by
            scroll, with B&W → color filter tied to the takeover progress. */}
        <figure
          className="hero-tile hero-tile--bottom-center hero-tile--video"
          data-dx={0}
          data-dy={100}
        >
          <canvas
            ref={videoCanvasRef}
            className="hero-video-canvas"
            width={FRAME_W}
            height={FRAME_H}
            aria-label="Wedding film"
          />
          <div className="hero-video-fade" aria-hidden />
        </figure>

        <div className="hero-center">
          <span ref={dotRef} className="hero-dot" aria-hidden />

          <p className="hero-eyebrow">
            Curating royal experiences <span aria-hidden>•</span> One celebration at a time
          </p>

          <h1 ref={headRef} className="hero-headline display">
            <span className="hero-line">
              <span className="hero-word">Unfold</span>{' '}
              <span className="hero-word">your</span>
            </span>
            <span className="hero-line">
              <span className="hero-word">royal</span>{' '}
              <span className="hero-word">love</span>{' '}
              <span className="hero-word">story</span>
            </span>
          </h1>

        </div>
      </div>
    </section>
  );
}
