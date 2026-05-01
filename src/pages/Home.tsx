import Hero from '../sections/Hero';
import Manifesto from '../sections/Manifesto';
import Pause from '../sections/Pause';
import Process from '../sections/Process';
import Book from '../sections/Book';
import BlackSection from '../sections/BlackSection';
import Testimonials from '../sections/Testimonials';
import FAQ from '../sections/FAQ';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Pause />
      <Process />
      <Book />
      <BlackSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
