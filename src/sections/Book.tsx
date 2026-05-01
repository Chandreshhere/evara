import { useEffect, useState } from 'react';
import './Book.css';

export default function Book() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section className="book" id="book">
      {/* <span className="book-eyebrow">Book your moment</span> */}
      <picture>
        <source srcSet="/images/stars.avif" type="image/avif" />
        <img
          className="book-stars"
          src="/images/stars.png"
          alt=""
          aria-hidden
        />
      </picture>

      <div className="envelope">
        <picture>
          <source srcSet="/images/enve.avif" type="image/avif" />
          <img
            className="envelope-image"
            src="/images/enve.png"
            alt="Open navy wedding envelope"
          />
        </picture>
        <div className="envelope-letter">
          <h2 className="book-headline">
            Begin your
            <br />
            <em className="book-headline-script">royal&nbsp;legacy</em>
          </h2>
          <p className="book-body">
            Step into a celebration crafted with timeless elegance and
            heartfelt artistry. Let EVARA transform your love story into a
            regal affair destined to be remembered for generations.
          </p>
        </div>
      </div>

      {open && <ContactModal onClose={() => setOpen(false)} />}
    </section>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    typeOfService: '',
    message: '',
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className="contact-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="contact-modal__backdrop" onClick={onClose} aria-hidden />
      <div className="contact-modal__card">
        <button
          type="button"
          className="contact-modal__close"
          onClick={onClose}
          aria-label="Close contact form"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <header className="contact-modal__head">
          <span className="contact-modal__eyebrow">Get in touch</span>
          <h3 id="contact-modal-title" className="contact-modal__title">
            Contact <em className="contact-modal__title-script">Us</em>
          </h3>
        </header>

        <form className="contact-form" onSubmit={onSubmit}>
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="contact-firstName" className="sr-only">
                First Name
              </label>
              <input
                id="contact-firstName"
                className="contact-form__input"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={onChange}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="contact-lastName"
                className="contact-form__input"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={onChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="contact-phone" className="sr-only">
                Phone
              </label>
              <input
                id="contact-phone"
                className="contact-form__input"
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
              />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                className="contact-form__input"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-typeOfService" className="sr-only">
              Type of Service
            </label>
            <input
              id="contact-typeOfService"
              className="contact-form__input"
              type="text"
              name="typeOfService"
              placeholder="Type of Service"
              value={form.typeOfService}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="contact-form__submit">
            Submit
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
