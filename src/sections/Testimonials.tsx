import { useEffect, useState } from 'react';
import './Testimonials.css';

type Testimonial = {
  quote: string;
  name: string;
  place: string;
  image: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'EVARA transformed our vision into a majestic reality. The attention to detail and cultural authenticity were unparalleled.',
    name: 'Priya & Arjun',
    place: 'Udaipur, 2024',
    image: '/images/1.jpeg',
  },
  {
    quote:
      'Our wedding was beyond our wildest dreams. Every moment was crafted with such elegance and perfection.',
    name: 'Meera & Raj',
    place: 'Jaipur, 2024',
    image: '/images/2.jpeg',
  },
  {
    quote:
      'The team at EVARA made our special day truly unforgettable. Their expertise in Indian weddings is unmatched.',
    name: 'Ananya & Vikram',
    place: 'Goa, 2023',
    image: '/images/3.jpeg',
  },
];

const STEP_MS = 5200;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % TESTIMONIALS.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const count = TESTIMONIALS.length;
  const go = (dir: -1 | 1) =>
    setActive((i) => (i + dir + count) % count);

  const prevIdx = (active - 1 + count) % count;
  const nextIdx = (active + 1) % count;
  const current = TESTIMONIALS[active];

  return (
    <section
      className="loves"
      id="testimonials"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="loves-title">Testimonials</h2>

      <div className="loves-gallery" aria-hidden>
        <button
          type="button"
          className="loves-thumb loves-thumb--side"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
        >
          <img src={TESTIMONIALS[prevIdx].image} alt="" loading="lazy" />
        </button>

        <div className="loves-thumb loves-thumb--center" key={current.image}>
          <img src={current.image} alt={`Wedding portrait — ${current.name}`} />
        </div>

        <button
          type="button"
          className="loves-thumb loves-thumb--side"
          onClick={() => go(1)}
          aria-label="Next testimonial"
        >
          <img src={TESTIMONIALS[nextIdx].image} alt="" loading="lazy" />
        </button>
      </div>

      <nav className="loves-nav" aria-label="Testimonial navigation">
        <button
          type="button"
          className="loves-nav-btn"
          onClick={() => go(-1)}
        >
          Prev
        </button>
        <span className="loves-nav-rule" aria-hidden />
        <button
          type="button"
          className="loves-nav-btn"
          onClick={() => go(1)}
        >
          Next
        </button>
      </nav>

      <div className="loves-copy" key={current.name}>
        <blockquote className="loves-quote">
          &ldquo;{current.quote}&rdquo;
        </blockquote>
        <div className="loves-meta">
          <p className="loves-place">{current.place}</p>
          <p className="loves-name">{current.name}</p>
        </div>
      </div>
    </section>
  );
}
