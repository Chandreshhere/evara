import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import './studio.css';

import HowWeWork from '../components/HowWeWork/HowWeWork';
import Spotlight from '../components/Spotlight/Spotlight';
import CTAWindow from '../components/CTAWindow/CTAWindow';
import Footer from '../sections/Footer';

export default function About() {
  const journeyRef = useRef<HTMLImageElement>(null);

  // Match the home Process section's journey sway: rotate + skew yoyos
  // around the bottom-center pivot so the graphic feels suspended.
  useEffect(() => {
    const el = journeyRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { transformOrigin: '50% 100%' });
      gsap.to(el, {
        rotation: 5,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(el, {
        skewX: 2.6,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="page studio">
      <section className="studio-hero">
        <div className="container">
          <div className="studio-hero-col">
            <p>
              We see a wedding as more than an event. It is an ongoing
              dialogue between people, ritual, and place — shaped with care,
              and built to be remembered.
            </p>
            <picture className="studio-hero-journey" aria-hidden>
              <source srcSet="/images/journey.avif" type="image/avif" />
              <img ref={journeyRef} src="/images/journey.png" alt="" />
            </picture>
          </div>
          <div className="studio-hero-col">
            <h2>
              Our atelier exists to design weddings that feel honest,
              lived-in, and quietly transformative. Every celebration begins
              with listening, and ends in a memory your family will keep by
              name.
            </h2>
            <div className="studio-hero-hero-img">
              <img src="/images/evara-03.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="more-facts">
        <div className="container">
          <div className="more-facts-items">
            <div className="fact">
              <p>Weddings designed</p>
              <h2>120+</h2>
            </div>
            <div className="fact">
              <p>Heritage venues</p>
              <h2>60</h2>
            </div>
            <div className="fact">
              <p>Ateliers partnered</p>
              <h2>25+</h2>
            </div>
            <div className="fact">
              <p>Hours hand-stitched</p>
              <h2>3k+</h2>
            </div>
            <div className="fact">
              <p>Bespoke details</p>
              <h2>724</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="how-we-work-container">
        <div className="container">
          <HowWeWork />
        </div>
      </section>

      <CTAWindow
        img="/images/evara-06.jpg"
        header="The Archive"
        callout="Weddings that speak through form"
        description="Each celebration tells a story of light, fabric and rhythm. Explore how ideas take shape and grow into evenings remembered."
      />

      <Spotlight />

      <Footer />
    </div>
  );
}
