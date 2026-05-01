import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '../../lib/gsap';
import './HowWeWork.css';

const STEPS = [
  {
    title: 'Discovery / Listen',
    body: 'We begin in private, over long conversations — your story, your families, the rituals that matter most. Constraints, calendar and measure of success are defined together.',
    img: '/images/evara-01.jpg',
  },
  {
    title: 'Direction / Compose',
    body: 'A single creative direction is drawn — palette, materials, music, light. Quick mood studies test options and reveal the thread that best holds the day.',
    img: '/images/evara-03.jpg',
  },
  {
    title: 'Detail / Coordinate',
    body: 'Drawings and specifications are developed across stationery, florals, joinery and timing. Samples are reviewed in natural light while budget and runway stay in view.',
    img: '/images/evara-05.jpg',
  },
  {
    title: 'Build / Hold',
    body: 'We oversee the day with care and precision. Timings, transitions and the small intimacies are anticipated, so you and your family can simply be present.',
    img: '/images/evara-07.jpg',
  },
];

// Two-column section. Left = sticky list of all four step titles with
// a vertical gold progress line; right = stacked cards that scroll
// past. ScrollTrigger drives a 0..1 progress (--progress CSS var) and
// an active step index. No GSAP pin → no pin-spacer DOM wrap.
export default function HowWeWork() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = cardsRef.current;
    const track = trackRef.current;
    if (!cards || !track) return;

    const progressTrigger = ScrollTrigger.create({
      trigger: cards,
      start: 'top 70%',
      end: 'bottom 60%',
      onUpdate: (self) => {
        track.style.setProperty('--progress', String(self.progress));
      },
    });

    const cardEls = cards.querySelectorAll<HTMLElement>('.how-we-work-card');
    const activeTriggers: ScrollTrigger[] = [];
    cardEls.forEach((card, index) => {
      activeTriggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        }),
      );
    });

    return () => {
      progressTrigger.kill();
      activeTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="how-we-work">
      <div className="how-we-work-header">
        <div className="how-we-work-header-content">
          <p className="how-we-work-eyebrow">Process in focus</p>
          <h3 className="how-we-work-heading">
            From first sketches to final details, our process is shaped to
            bring clarity and rhythm.
          </h3>

          <div className="how-we-work-track" ref={trackRef}>
            <div className="how-we-work-track-rail" aria-hidden />
            <div className="how-we-work-track-fill" aria-hidden />

            <ol className="how-we-work-list">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={`how-we-work-list-item ${active === i ? 'is-active' : ''}`}
                >
                  <span className="how-we-work-list-num">0{i + 1}</span>
                  <span className="how-we-work-list-title">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="how-we-work-cards" ref={cardsRef}>
        {STEPS.map((step, i) => (
          <article className="how-we-work-card" key={step.title}>
            <div className="how-we-work-card-img">
              <img src={step.img} alt={step.title} loading="lazy" />
            </div>
            <div className="how-we-work-card-copy">
              <span className="how-we-work-card-num">0{i + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
