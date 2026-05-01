import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import Spotlight from '../components/Spotlight/Spotlight';
import Footer from '../sections/Footer';
import './Contact.css';

const QUICK_LINES = [
  'Begin a conversation',
  'Heritage estates',
  'Soulful design',
  'Private ateliers',
  'A measure of your own',
];

const CARDS = [
  {
    label: 'Atelier',
    title: 'Udaipur',
    lines: ['12 Rajwada Marg', 'Udaipur 313001, India'],
    mark: 'By appointment',
  },
  {
    label: 'Write',
    title: 'hello@evara',
    lines: ['hello@evaraweddings.com', 'press@evaraweddings.com'],
    mark: 'Replies within 48 h',
    href: 'mailto:hello@evaraweddings.com',
  },
  {
    label: 'Call',
    title: '+91 98 765 43210',
    lines: ['Mon — Fri · 10:00–18:00 IST', 'WhatsApp on the same line'],
    mark: 'Studio direct',
    href: 'tel:+919876543210',
  },
  {
    label: 'Travel',
    title: 'We come to you',
    lines: ['Across India · Iberia', 'Mediterranean estates'],
    mark: 'On request',
  },
];

const SERVICES = [
  'Full-design wedding',
  'Destination weekend',
  'Heritage venue concept',
  'Sangeet & Mehndi only',
  'Private ceremony',
  'Editorial / brand',
];

export default function Contact() {
  const heroRef = useRef<HTMLElement>(null);
  const ornamentRef = useRef<HTMLImageElement>(null);
  const starsRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    service: SERVICES[0],
    message: '',
  });
  const [sent, setSent] = useState(false);

  // Hero entrance + sway on the decorative ornament + scroll-driven
  // word reveal on the manifesto block. Mirrors the Manifesto/About
  // language so the page feels of-a-piece with the rest of the site.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      // Entrance: stagger the eyebrow / display / script / lede.
      gsap.fromTo(
        '.contact-hero__line',
        { y: 64, autoAlpha: 0, filter: 'blur(14px)' },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
        },
      );


      // Subtle sway on the journey ornament — same easing as the home
      // Process section so the motion matches the rest of the site.
      const orn = ornamentRef.current;
      if (orn) {
        gsap.set(orn, { transformOrigin: '50% 100%' });
        gsap.to(orn, {
          rotation: 5,
          duration: 4.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
        gsap.to(orn, {
          skewX: 2.6,
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // Lazy float on the stars cluster.
      const stars = starsRef.current;
      if (stars) {
        gsap.to(stars, {
          y: -14,
          duration: 3.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // Word-by-word reveal on the manifesto block.
      gsap.fromTo(
        '.contact-manifesto__word',
        { autoAlpha: 0.1, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.contact-manifesto',
            start: 'top 75%',
            once: true,
          },
        },
      );

      // Card grid: float in on scroll.
      gsap.fromTo(
        '.contact-card',
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.contact-cards',
            start: 'top 80%',
            once: true,
          },
        },
      );

      // Envelope rises into the form.
      gsap.fromTo(
        '.contact-form-card',
        { y: 80, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-form-section',
            start: 'top 75%',
            once: true,
          },
        },
      );
    }, hero);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // Magnetic submit button — pulls toward the cursor a little.
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.18;
      const dy = (e.clientY - cy) * 0.22;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    gsap.fromTo(
      '.contact-form-card',
      { scale: 1 },
      { scale: 0.985, yoyo: true, repeat: 1, duration: 0.25, ease: 'power2.inOut' },
    );
  };

  const manifesto =
    'A wedding is an heirloom in the making. Tell us a little about yours — the place you have in mind, the family that will gather, the rituals that matter. We answer every note in our own hand.';

  return (
    <div className="page contact">
      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="contact-hero">
        <picture>
          <source srcSet="/images/paper.avif" type="image/avif" />
          <img
            className="contact-hero__paper"
            src="/images/paper.png"
            alt=""
            aria-hidden
          />
        </picture>

        <picture>
          <source srcSet="/images/stars.avif" type="image/avif" />
          <img
            ref={starsRef}
            className="contact-hero__stars"
            src="/images/stars.png"
            alt=""
            aria-hidden
          />
        </picture>

        <picture aria-hidden>
          <source srcSet="/images/journey.avif" type="image/avif" />
          <img
            ref={ornamentRef}
            className="contact-hero__ornament"
            src="/images/journey.png"
            alt=""
          />
        </picture>

        <div className="contact-hero__inner container">
          <span className="contact-hero__line contact-hero__eyebrow">
            Chapter IV — Correspondence
          </span>
          <h1 className="contact-hero__line contact-hero__title">
            Write to
            <br />
            the <em className="contact-hero__title-script">atelier</em>
          </h1>
          <p className="contact-hero__line contact-hero__lede">
            A private studio. A standing invitation. Begin the conversation
            and we will reply by name, in our own hand, within forty-eight
            hours.
          </p>
          <div className="contact-hero__line contact-hero__meta">
            <span>
              <i>01</i> Studio · Udaipur
            </span>
            <span>
              <i>02</i> Available worldwide
            </span>
            <span>
              <i>03</i> By appointment
            </span>
          </div>
        </div>

      </section>

      {/* ---------- MARQUEE ---------- */}
      <section className="contact-marquee" aria-hidden>
        <div className="contact-marquee__track">
          {Array.from({ length: 3 }).map((_, k) => (
            <div className="contact-marquee__row" key={k}>
              {QUICK_LINES.map((t) => (
                <span key={`${k}-${t}`} className="contact-marquee__item">
                  {t}
                  <em className="contact-marquee__dot">✦</em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- MANIFESTO + CARDS ---------- */}
      <section className="contact-manifesto">
        <div className="container contact-manifesto__grid">
          <div className="contact-manifesto__col">
            <span className="contact-manifesto__eyebrow">A short note</span>
            <h2 className="contact-manifesto__copy">
              {manifesto.split(' ').map((w, i) => (
                <span className="contact-manifesto__word" key={i}>
                  {w}
                  {i < manifesto.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <header className="contact-cards-head">
              <span className="contact-cards-eyebrow">Find us</span>
              <h3 className="contact-cards-title">
                Four ways
                <br />
                to <em>arrive</em>
              </h3>
            </header>
          </div>

          <div className="contact-cards">
            {CARDS.map((c, i) => {
              const Tag = c.href ? 'a' : 'div';
              return (
                <Tag
                  key={c.label}
                  {...(c.href ? { href: c.href } : {})}
                  className={`contact-card contact-card--${i + 1}`}
                >
                  <span className="contact-card__num">0{i + 1}</span>
                  <span className="contact-card__label">{c.label}</span>
                  <h4 className="contact-card__title">{c.title}</h4>
                  <ul className="contact-card__lines">
                    {c.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <span className="contact-card__mark">{c.mark}</span>
                  <span className="contact-card__shine" aria-hidden />
                </Tag>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- FORM (envelope card) ---------- */}
      <section className="contact-form-section">
        <picture>
          <source srcSet="/images/stars.avif" type="image/avif" />
          <img
            className="contact-form-section__stars"
            src="/images/stars.png"
            alt=""
            aria-hidden
          />
        </picture>

        <div className="container">
          <header className="contact-form-head">
            <span className="contact-form-eyebrow">The letter</span>
            <h3 className="contact-form-title">
              Tell us about
              <br />
              your <em>day.</em>
            </h3>
            <p className="contact-form-lede">
              Fill the page below — even a few lines is enough to begin.
            </p>
          </header>

          <form className="contact-form-card" onSubmit={onSubmit}>
            <div className="contact-form-card__seal" aria-hidden>
              EVARA
            </div>

            <fieldset>
              <legend>About you</legend>
              <div className="contact-form-grid">
                <Field label="First name" required>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    required
                  />
                </Field>
                <Field label="Last name" required>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    required
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </Field>
                <Field label="Phone (optional)">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend>About the day</legend>
              <div className="contact-form-grid">
                <Field label="Approximate date">
                  <input
                    type="text"
                    name="date"
                    placeholder="e.g. Spring 2027"
                    value={form.date}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Guest count">
                  <input
                    type="text"
                    name="guests"
                    placeholder="e.g. 180"
                    value={form.guests}
                    onChange={onChange}
                  />
                </Field>
              </div>

              <div className="contact-form-services">
                <span className="contact-form-services__label">
                  What you have in mind
                </span>
                <div className="contact-form-services__chips">
                  {SERVICES.map((s) => (
                    <label
                      key={s}
                      className={`contact-chip ${
                        form.service === s ? 'is-active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={s}
                        checked={form.service === s}
                        onChange={onChange}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Field label="A few words about your story" textarea>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Where you imagine the day, the people who will gather, the rituals that matter…"
                />
              </Field>
            </fieldset>

            <div className="contact-form-foot">
              <p className="contact-form-foot__note">
                We answer every enquiry personally. No automated replies, no
                lists.
              </p>
              <button
                ref={ctaRef}
                type="submit"
                className="contact-form-submit"
                disabled={sent}
              >
                <span className="contact-form-submit__inner">
                  {sent ? 'Sent — thank you' : 'Send the letter'}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="contact-form-submit__halo" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ---------- FAQ STRIP ---------- */}
      <section className="contact-faq">
        <div className="container">
          <span className="contact-faq__eyebrow">Before you write</span>
          <div className="contact-faq__grid">
            <FAQItem
              q="Do you travel?"
              a="Yes — across India, Iberia and the Mediterranean. Further afield by arrangement."
            />
            <FAQItem
              q="When should we reach out?"
              a="Most couples write 9 to 18 months ahead. Smaller weekends are taken on shorter notice."
            />
            <FAQItem
              q="Is there a minimum?"
              a="Full-design weddings begin at a private studio fee. We will share figures privately on the first call."
            />
            <FAQItem
              q="What happens next?"
              a="A reply by name within 48 h, then a quiet first call to listen — no decks, no pitch."
            />
          </div>
        </div>
      </section>

      <Spotlight />
      <Footer />
    </div>
  );
}

function Field({
  label,
  required,
  textarea,
  children,
}: {
  label: string;
  required?: boolean;
  textarea?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`contact-field ${textarea ? 'contact-field--wide' : ''}`}>
      <span className="contact-field__label">
        {label}
        {required && <i aria-hidden>*</i>}
      </span>
      <span className="contact-field__control">{children}</span>
      <span className="contact-field__rule" aria-hidden />
    </label>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <article className="contact-faq__item">
      <h4>{q}</h4>
      <p>{a}</p>
    </article>
  );
}
