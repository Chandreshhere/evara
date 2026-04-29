import { useRef, useState } from 'react';
import './FAQ.css';

type Item = {
  q: string;
  a: string;
};

const ITEMS: Item[] = [
  {
    q: 'How far in advance should we book Evara’s services?',
    a: 'We recommend booking at least 12–18 months before your wedding date to ensure comprehensive planning and availability.',
  },
  {
    q: 'Can Evara accommodate destination weddings across India?',
    a: 'Yes — we specialize in destination weddings across India. Our team has extensive experience planning celebrations in venues from Rajasthan palaces to Kerala backwaters, ensuring seamless coordination regardless of the location.',
  },
  {
    q: 'Do you offer customized wedding design packages?',
    a: 'Absolutely. We believe every wedding is unique. Our design team works closely with you to create personalized themes, decor, and experiences that reflect your story, cultural traditions, and personal style.',
  },
  {
    q: 'How do you manage vendor coordination?',
    a: 'We have a curated network of trusted vendors across India. Our team handles all coordination — from initial selection to final execution — ensuring quality, timeline adherence, and budget management for a stress-free experience.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpen((curr) => (curr === i ? null : i));
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <img
        className="faq-paper"
        src="/images/paper.png"
        alt=""
        aria-hidden
      />

      <span className="faq-eyebrow">Curiosities &amp; clarifications</span>

      <div className="faq-grid">
        {/* ---- LEFT: portrait frame ---- */}
        <aside className="faq-side" aria-hidden>
          <div className="faq-portrait">
            <span className="faq-portrait-tag">N&deg;&nbsp;01 — Atelier</span>
            <div className="faq-portrait-frame">
              <img
                src="/images/2.jpeg"
                alt=""
                loading="lazy"
              />
              <div className="faq-portrait-shade" />
            </div>
            <figcaption className="faq-portrait-caption">
              <span className="faq-portrait-caption-script">whispered</span>
              <span className="faq-portrait-caption-line">
                answers, softly held
              </span>
            </figcaption>
          </div>
        </aside>

        {/* ---- RIGHT: content + accordion ---- */}
        <div className="faq-content">
          <h2 className="faq-headline" id="faq-title">
            Frequently
            <br />
            asked
            <br />
            <em className="faq-headline-script">questions</em>
          </h2>

          <p className="faq-lede">
            A few of the questions we&rsquo;re asked most often, answered with
            the same care we bring to every celebration.
          </p>

          <ol className="faq-list">
            {ITEMS.map((it, i) => {
              const isOpen = open === i;
              const panel = panelRefs.current[i];
              const height = isOpen && panel ? panel.scrollHeight : 0;
              return (
                <li
                  key={it.q}
                  className={`faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-row"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq-num" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq-q">{it.q}</span>
                    <span className="faq-icon" aria-hidden>
                      <span className="faq-icon-bar faq-icon-bar--h" />
                      <span className="faq-icon-bar faq-icon-bar--v" />
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${i}`}
                    className="faq-panel"
                    style={{ height: `${height}px` }}
                    role="region"
                    aria-hidden={!isOpen}
                  >
                    <div
                      className="faq-panel-inner"
                      ref={(el) => {
                        panelRefs.current[i] = el;
                      }}
                    >
                      <p className="faq-a">{it.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="faq-foot">
            Something more particular in mind?{' '}
            <a className="faq-foot-link" href="#book">
              Begin a conversation
            </a>
            <em className="faq-foot-script">&nbsp;with us</em>.
          </p>
        </div>
      </div>

      <span className="faq-mark">( EVARA &middot; ATELIER )</span>
    </section>
  );
}
