import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { preloadFrames } from '../lib/preload';
import './Footer.css';

const FRAME_COUNT = 90;

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefix = isMobile ? '/frames/footer/sm/' : '/frames/footer/';

    let cancelled = false;
    preloadFrames(prefix, FRAME_COUNT).then((imgs) => {
      if (cancelled) return;
      imagesRef.current = imgs;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !section || !overlay) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawFrame = (i: number) => {
      const img = imagesRef.current[i];
      if (!img) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cAspect = cw / ch;
      const iAspect = iw / ih;
      let dw = cw,
        dh = ch,
        dx = 0,
        dy = 0;
      if (iAspect > cAspect) {
        dh = ch;
        dw = ch * iAspect;
        dx = (cw - dw) / 2;
      } else {
        dw = cw;
        dh = cw / iAspect;
        dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    drawFrame(0);

    // Video frames advance while the user is APPROACHING the footer —
    // start scrubbing when the section first enters the viewport, finish
    // by the time it's fully in view. No pin — the section scrolls past
    // naturally and the clip is already played by the time the user is
    // standing on it.
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'top top',
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (FRAME_COUNT - 1));
        drawFrame(idx);
      },
    });

    // Overlay copy fades + lifts in over the same approach window
    const overlayTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.6,
      },
    });
    overlayTl
      .from(overlay.querySelectorAll('.footer-line'), {
        yPercent: 80,
        autoAlpha: 0,
        stagger: 0.12,
        ease: 'power2.out',
      })
      .from(
        overlay.querySelectorAll('.footer-col, .footer-mark'),
        { autoAlpha: 0, y: 24, stagger: 0.08, ease: 'power2.out' },
        '>-0.2',
      );

    // "Forever" — blur to clarity on scroll, in place
    const titleEl = overlay.querySelector('.footer-title');
    const titleBlur = titleEl
      ? gsap.fromTo(
          titleEl,
          { filter: 'blur(16px)' },
          {
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 0.4,
            },
          },
        )
      : null;

    return () => {
      window.removeEventListener('resize', resize);
      st.kill();
      overlayTl.kill();
      titleBlur?.scrollTrigger?.kill();
      titleBlur?.kill();
    };
  }, [ready]);

  const year = new Date().getFullYear();

  return (
    <section ref={sectionRef} className="footer-section">
      <div className="footer-canvas-wrap">
        <canvas ref={canvasRef} className="footer-canvas" aria-hidden="true" />
        <div className="footer-canvas-tint" />
      </div>

      <div className="footer-overlay" ref={overlayRef}>
        <div className="footer-top">
          <span className="footer-mono">
            Evara &middot; Editorial Wedding Atelier
          </span>
          <span className="footer-mono footer-mono--accent">
            ( An everlasting note )
          </span>
        </div>

        <div className="footer-headline">
          <span className="footer-tag footer-line">A lifetime begins —</span>
          <h2 className="footer-title footer-line">Forever</h2>
          <p className="footer-lede footer-line">
            The day fades, the story stays. Should yours wish to be told with
            the same quiet care, <em className="footer-lede-script">begin</em>{' '}
            a conversation with us.
          </p>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-col-num" aria-hidden>
              N&deg;&nbsp;01
            </span>
            <span className="footer-col-label">Reach</span>
            <a href="mailto:hello@evara.studio">hello@evara.studio</a>
            <a href="tel:+34644102880">+34 644 102 880</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-num" aria-hidden>
              N&deg;&nbsp;02
            </span>
            <span className="footer-col-label">Follow</span>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Pinterest">Pinterest</a>
            <a href="#" aria-label="Vimeo">Vimeo</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-num" aria-hidden>
              N&deg;&nbsp;03
            </span>
            <span className="footer-col-label">Visit</span>
            <p>Atelier &mdash; Madrid</p>
            <p>By appointment only</p>
          </div>

          <div className="footer-mark">
            <span className="footer-mark-name">Evara</span>
            <small>© {year} &middot; Crafted with patience.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
