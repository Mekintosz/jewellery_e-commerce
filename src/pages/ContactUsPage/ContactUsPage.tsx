import { FormEvent, useState } from 'react';
import styles from './ContactUsPage.module.css';
import { Input } from '../../components/forms/Input/Input';
import { Select } from '../../components/forms/Select/Select';
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
      <header className={styles['page__header']}>
        <h1 className={styles['page__title']}>Connect with us</h1>
        <p className={styles['page__subtitle']}>
          We are here to assist with bespoke requests, styling guidance, and aftercare services.
        </p>
      </header>
      {isSent ? (
        <Alert variant="success" title="Message sent" description="Our stylists will be in touch within 24 hours." />
      ) : null}
      <form className={styles['page__form']} onSubmit={handleSubmit}>
        <div className={styles['page__grid']}>
          <Input label="Full name" name="name" id="name" required />
          <Input label="Email" type="email" name="email" id="email" required />
          <Input label="Phone" type="tel" name="phone" id="phone" helperText="Optional" />
        </div>
        <Select label="Reason" name="reason" id="reason" defaultValue="appointment">
          <option value="appointment">Book a private appointment</option>
          <option value="order">Order assistance</option>
          <option value="aftercare">Aftercare & repairs</option>
          <option value="press">Press enquiry</option>
        </Select>
        <label className={styles['page__message']}>
          Message
          <textarea name="message" rows={6} required />
        </label>
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          Send message
        </Button>
      </form>

      <section className={styles['page__info']}>
        <div>
          <h2 className={styles['page__heading']}>Flagship atelier</h2>
          <p>128 Madison Avenue, New York, NY</p>
          <p>Open Monday – Saturday, 10am – 6pm</p>
        </div>
        <div>
          <h2 className={styles['page__heading']}>Concierge</h2>
          <p>care@luxegems.com</p>
          <p>+1 555 0199</p>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
