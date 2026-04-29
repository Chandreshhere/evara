import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import './Footer.css';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let scrubST: ScrollTrigger | null = null;

    const setupScrub = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // ignore
      }
      scrubST = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.5,
        onUpdate: (self) => {
          const t = Math.min(duration * self.progress, duration - 0.001);
          video.currentTime = t;
        },
      });
    };

    if (video.readyState >= 1 && isFinite(video.duration)) {
      setupScrub();
    } else {
      video.addEventListener('loadedmetadata', setupScrub, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', setupScrub);
      scrubST?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="footer-section">
      <div className="footer-canvas-wrap">
        <video
          ref={videoRef}
          className="footer-video"
          src="/footer.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="footer-canvas-tint" />
      </div>

      <div className="footer-center">
        <span className="footer-tag">A lifetime begins —</span>
        <h2 className="footer-title">Forever yours</h2>
        <p className="footer-signoff-line">
          with patience, until the last note.
        </p>
      </div>

      <div className="footer-brand-center">
        <img
          src="/images/evara-logo-light.png"
          alt="Evara Weddings"
          className="footer-brand-logo"
          draggable={false}
        />
      </div>

      <aside className="footer-contact" aria-label="Contact">
        <ul className="footer-contact-list">
          <li>
            <span className="footer-contact-label">Atelier</span>
            <span className="footer-contact-value">
              12 Rajwada Marg, Udaipur, India
            </span>
          </li>
          <li>
            <span className="footer-contact-label">Email</span>
            <a
              className="footer-contact-value"
              href="mailto:hello@evaraweddings.com"
            >
              hello@evaraweddings.com
            </a>
          </li>
          <li>
            <span className="footer-contact-label">Phone</span>
            <a className="footer-contact-value" href="tel:+919876543210">
              +91 98765 43210
            </a>
          </li>
        </ul>
      </aside>

      <aside className="footer-social" aria-label="Social">
        <span className="footer-social-label">Follow</span>
        <ul className="footer-social-list">
          <li>
            <a
              href="https://instagram.com/evaraweddings"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.25-1.25a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z"
                />
              </svg>
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a
              href="https://pinterest.com/evaraweddings"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.2-1.9 0-2.7l1.3-5.5s-.3-.7-.3-1.7c0-1.6.9-2.7 2-2.7.95 0 1.4.7 1.4 1.55 0 .95-.6 2.35-.9 3.65-.25 1.1.55 2 1.65 2 2 0 3.5-2.1 3.5-5.1 0-2.65-1.9-4.5-4.65-4.5-3.15 0-5 2.35-5 4.8 0 .95.35 2 .8 2.5.1.1.1.2.1.3l-.3 1.2c-.05.2-.15.25-.4.15-1.4-.65-2.25-2.7-2.25-4.35 0-3.55 2.6-6.8 7.45-6.8 3.9 0 6.95 2.8 6.95 6.5 0 3.9-2.45 7-5.85 7-1.15 0-2.2-.6-2.55-1.3l-.7 2.65c-.25.95-.9 2.15-1.35 2.85A9 9 0 1 0 12 3Z"
                />
              </svg>
              <span>Pinterest</span>
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com/evaraweddings"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.5 21v-7.5h2.4l.4-3H14.5V8.7c0-.9.3-1.5 1.55-1.5h1.65V4.6a23 23 0 0 0-2.4-.13c-2.4 0-4 1.5-4 4.1V10.5h-2.6v3h2.6V21Z"
                />
              </svg>
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a
              href="https://youtube.com/@evaraweddings"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15.1V8.9l5.2 3.1Z"
                />
              </svg>
              <span>YouTube</span>
            </a>
          </li>
        </ul>
      </aside>
    </section>
  );
}
