import { FormEvent, useState } from "react";
import styles from "./ContactUsPage.module.css";
import { Button } from "../../components/ui/Button/Button";
import { Alert } from "../../components/ui/Alert/Alert";

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
      <header className={styles["page__header"]}>
        <h1 className={styles["page__title"]}>Get in Touch</h1>
        <p className={styles["page__subtitle"]}>
          We&apos;d love to hear from you. Whether you have a question about our
          collections, a custom order, or just want to say hello, our team is
          ready to answer all your questions.
        </p>
      </header>

      {/* Info Cards */}
      <div className={styles["info-cards"]}>
        <div className={styles["info-card"]}>
          <div className={styles["info-card__icon"]}>
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className={styles["info-card__content"]}>
            <h2 className={styles["info-card__title"]}>Business Hours</h2>
            <p className={styles["info-card__text"]}>
              Monday - Friday: 10am - 6pm
              <br />
              Saturday: 11am - 5pm
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className={styles["info-card"]}>
          <div className={styles["info-card__icon"]}>
            <span className="material-symbols-outlined">pin_drop</span>
          </div>
          <div className={styles["info-card__content"]}>
            <h2 className={styles["info-card__title"]}>Our Address</h2>
            <p className={styles["info-card__text"]}>
              123 Artisan Way, Handcrafted City,
              <br />
              HC 12345
            </p>
          </div>
        </div>

        <div className={styles["info-card"]}>
          <div className={styles["info-card__icon"]}>
            <span className="material-symbols-outlined">mail</span>
          </div>
          <div className={styles["info-card__content"]}>
            <h2 className={styles["info-card__title"]}>Phone & Email</h2>
            <p className={styles["info-card__text"]}>
              <a href="tel:+1234567890" className={styles["info-card__link"]}>
                +1 (234) 567-890
              </a>
              <br />
              <a
                href="mailto:hello@jewelry.com"
                className={styles["info-card__link"]}
              >
                hello@jewelry.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Form and Location Grid */}
      <div className={styles["content-grid"]}>
        {/* Form Section */}
        <div className={styles["form-section"]}>
          <h2 className={styles["section-title"]}>Send Us a Message</h2>
          {isSent ? (
            <Alert
              variant="success"
              title="Message sent"
              description="Our team will be in touch within 24 hours."
            />
          ) : (
            <form className={styles["contact-form"]} onSubmit={handleSubmit}>
              <div className={styles["form-field"]}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  className={styles["form-input"]}
                  required
                />
              </div>
              <div className={styles["form-field"]}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  className={styles["form-input"]}
                  required
                />
              </div>
              <div className={styles["form-field"]}>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  rows={6}
                  className={styles["form-textarea"]}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </form>
          )}
        </div>

        {/* Location Section */}
        <div className={styles["location-section"]}>
          <h2 className={styles["section-title"]}>Our Location</h2>
          <div className={styles["map-container"]}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBePyV4cmaNEWoTz3i8gzFj2d9V4PAqwQoDvMC54hgREa2R2RxwBfanHvaaSTYj28XJEmBJMDXo1yD2SyvX2TcL6uo9yO1k5LMiUv0A6UWP9wXIc3fftETOkhGKwKX-OVNMqpSVnNuNG4nIW0t8bVM-sm-n137U12XcbI8dyEkkS-4R6xvmDvFZXVRUAVtRCTWqljxgS-JG9lIICHRPyWoc3rXPwWqwQb7vR8pl3bwXyrP_ZdwVjNOLNaWsEnyzHEZqc0bPR2fXnlA"
              alt="Store location map"
              className={styles["map-image"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
