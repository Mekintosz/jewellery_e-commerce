import { FormEvent, useState } from 'react';
import styles from './ContactUsPage.module.css';
import { Button } from '../../components/ui/Button/Button';
import { Alert } from '../../components/ui/Alert/Alert';

const ContactUsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 900);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles['page__header']}>
        <h1 className={styles['page__title']}>Get in Touch</h1>
        <p className={styles['page__subtitle']}>
          We'd love to hear from you. Whether you have a question about our collections, a custom order, or just want to say hello, our team is ready to answer all your questions.
        </p>
      </header>

      {/* Info Cards */}
      <div className={styles['info-cards']}>
        <div className={styles['info-card']}>
          <div className={styles['info-card__icon']}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div className={styles['info-card__content']}>
            <h2 className={styles['info-card__title']}>Business Hours</h2>
            <p className={styles['info-card__text']}>
              Monday - Friday: 10am - 6pm<br />
              Saturday: 11am - 5pm<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className={styles['info-card']}>
          <div className={styles['info-card__icon']}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className={styles['info-card__content']}>
            <h2 className={styles['info-card__title']}>Our Address</h2>
            <p className={styles['info-card__text']}>
              123 Artisan Way, Handcrafted City,<br />
              HC 12345
            </p>
          </div>
        </div>

        <div className={styles['info-card']}>
          <div className={styles['info-card__icon']}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div className={styles['info-card__content']}>
            <h2 className={styles['info-card__title']}>Phone & Email</h2>
            <p className={styles['info-card__text']}>
              <a href="tel:+1234567890" className={styles['info-card__link']}>+1 (234) 567-890</a><br />
              <a href="mailto:hello@jewelry.com" className={styles['info-card__link']}>hello@jewelry.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* Form and Location Grid */}
      <div className={styles['content-grid']}>
        {/* Form Section */}
        <div className={styles['form-section']}>
          <h2 className={styles['section-title']}>Send Us a Message</h2>
          {isSent ? (
            <Alert variant="success" title="Message sent" description="Our team will be in touch within 24 hours." />
          ) : (
            <form className={styles['contact-form']} onSubmit={handleSubmit}>
              <div className={styles['form-field']}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  className={styles['form-input']}
                  required
                />
              </div>
              <div className={styles['form-field']}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  className={styles['form-input']}
                  required
                />
              </div>
              <div className={styles['form-field']}>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  rows={6}
                  className={styles['form-textarea']}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
                Submit
              </Button>
            </form>
          )}
        </div>

        {/* Location Section */}
        <div className={styles['location-section']}>
          <h2 className={styles['section-title']}>Our Location</h2>
          <div className={styles['map-container']}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBePyV4cmaNEWoTz3i8gzFj2d9V4PAqwQoDvMC54hgREa2R2RxwBfanHvaaSTYj28XJEmBJMDXo1yD2SyvX2TcL6uo9yO1k5LMiUv0A6UWP9wXIc3fftETOkhGKwKX-OVNMqpSVnNuNG4nIW0t8bVM-sm-n137U12XcbI8dyEkkS-4R6xvmDvFZXVRUAVtRCTWqljxgS-JG9lIICHRPyWoc3rXPwWqwQb7vR8pl3bwXyrP_ZdwVjNOLNaWsEnyzHEZqc0bPR2fXnlA"
              alt="Store location map"
              className={styles['map-image']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
