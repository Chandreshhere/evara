import { useEffect } from 'react';
import { initLenis, destroyLenis } from './lib/lenis';
import { ScrollTrigger } from './lib/gsap';
import Header from './components/Header';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Pause from './sections/Pause';
import Process from './sections/Process';
import Book from './sections/Book';
import BlackSection from './sections/BlackSection';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';

// Prevent the browser from restoring the previous scroll position on reload —
// it collides with the Hero's lockScroll + pinned ScrollTrigger and leaves the
// page stuck in a mid-takeover layout. Run this BEFORE React mounts so the
// restore never happens in the first place.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
}

export default function App() {
  useEffect(() => {
    // Belt-and-braces: in case anything restored scroll between module eval
    // and effect run, snap back to top before Lenis/ScrollTrigger initialize.
    window.scrollTo(0, 0);
    initLenis();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      destroyLenis();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Pause />
        <Process />
        <Book />
        <BlackSection />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
