import {
  Component,
  useEffect,
  useRef,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { initLenis, destroyLenis } from './lib/lenis';
import { ScrollTrigger } from './lib/gsap';
import Header from './components/Header';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Prevent the browser from restoring the previous scroll position on reload —
// it collides with the Hero's lockScroll + pinned ScrollTrigger and leaves the
// page stuck in a mid-takeover layout. Run this BEFORE React mounts so the
// restore never happens in the first place.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
// Only freeze scrolling on initial load to "/". On other routes the freeze
// just blocks the page until Hero's effect (which never runs there) clears
// it. Reading pathname at module-eval is safe because this runs once per
// page load. SPA navigation handles its own state via ScrollManager below.
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
  if (window.location.pathname === '/') {
    document.documentElement.style.overflow = 'hidden';
    if (document.body) document.body.style.overflow = 'hidden';
  }
}

// Lenis is only desirable on the long-scroll Home page. The Gallery is a
// drag-pan canvas and About/Services/Contact are short — running Lenis there
// just fights native scrolling and breaks the gallery's drag math.
function ScrollManager() {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string | null>(null);

  // Tear down ScrollTrigger pins DURING RENDER on pathname change.
  // GSAP's pin wraps the pinned section in a <div class="pin-spacer">
  // outside React's knowledge. The commit phase fires DOM mutations
  // BEFORE useEffect / useLayoutEffect cleanups, so by the time
  // either of those cleanups run, React has already attempted to
  // remove a section that is no longer a direct child of its parent
  // → "removeChild: not a child of this node" → black screen.
  //
  // Render phase runs strictly before commit, so killing triggers
  // here unwraps every pin-spacer before React mutates the DOM.
  // Idempotent (re-running it kills nothing), so concurrent / strict
  // mode double-renders are harmless.
  if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
    if (typeof window !== 'undefined') {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    }
  }
  prevPathRef.current = pathname;

  // Render-phase scroll-lock release for non-home routes. Belt and
  // suspenders against the same locks the useEffect below clears —
  // doing it here too means the document is already scrollable when
  // children commit, and there's no flash of a frozen html.
  if (typeof document !== 'undefined' && pathname !== '/') {
    if (document.documentElement.style.overflow === 'hidden') {
      document.documentElement.style.overflow = '';
    }
    if (document.body && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
    const htmlCl = document.documentElement.classList;
    if (
      htmlCl.contains('lenis-stopped') ||
      htmlCl.contains('lenis') ||
      htmlCl.contains('lenis-smooth') ||
      htmlCl.contains('evara-loading')
    ) {
      htmlCl.remove('lenis-stopped', 'lenis', 'lenis-smooth', 'lenis-scrolling', 'evara-loading');
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    // Make sure the document is scrollable on every non-home route.
    // Three independent scroll-locks can leak from "/" into a SPA
    // navigation: the module-eval inline overflow style, the Hero's
    // own lockScroll, and the `lenis-stopped` class that Lenis adds
    // to <html> when stopped (which has `overflow: hidden` in
    // reset.css). Strip all three.
    if (pathname !== '/') {
      document.documentElement.style.overflow = '';
      if (document.body) document.body.style.overflow = '';
      document.documentElement.classList.remove(
        'lenis-stopped',
        'lenis',
        'lenis-smooth',
        'lenis-scrolling',
        'evara-loading',
      );
    }

    // Long-scroll, animation-driven routes get Lenis. Gallery is a
     // drag-pan canvas and Contact is short — Lenis there just fights
     // native scrolling. Services has pinned horizontal showcase that
     // benefits from smoothing.
    const wantsLenis =
      pathname === '/' ||
      pathname === '/about' ||
      pathname === '/services' ||
      pathname === '/contact';

    if (wantsLenis) {
      initLenis();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const rafId = window.requestAnimationFrame(refresh);
      return () => {
        window.removeEventListener('load', refresh);
        window.cancelAnimationFrame(rafId);
        destroyLenis();
      };
    } else {
      const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => window.cancelAnimationFrame(id);
    }
  }, [pathname]);

  return null;
}

// Belt-and-suspenders: any DOM-mutation race between GSAP and React
// during route swaps surfaces as a render-phase exception that would
// otherwise blank the screen. Catching it lets the user recover with
// a click instead of a hard reload.
class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route error boundary:', error, info);
    try {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    } catch {
      // ignore — we're already in an error state
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--bone, #f4efe6)',
            color: 'var(--ink, #00223f)',
            fontFamily: 'var(--font-body, system-ui)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
              Something tripped during navigation.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid currentColor',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontSize: '0.78rem',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Header />
      <main id="main">
        <RouteErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </RouteErrorBoundary>
      </main>
    </BrowserRouter>
  );
}
