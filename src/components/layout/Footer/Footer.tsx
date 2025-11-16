import styles from './Footer.module.css';
import { Logo } from '../../common/Logo/Logo';
import { Input } from '../../forms/Input/Input';
import { Button } from '../../ui/Button/Button';

const footerLinks = {
  Shop: ['New Arrivals', 'Best Sellers', 'Necklaces', 'Rings'],
  Company: ['About Us', 'Sustainability', 'Careers', 'Press'],
  Support: ['Contact', 'FAQs', 'Shipping & Returns', 'Care Guide']
};

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles['footer__top']}>
      <div className={styles['footer__branding']}>
        <Logo />
        <p className={styles['footer__description']}>
          Handcrafted fine jewellery with responsibly sourced materials. Discover timeless pieces designed to celebrate
          life&apos;s luminous moments.
        </p>
        <div className={styles['footer__newsletter']}>
          <p className={styles['footer__newsletter-text']}>Join our circle for exclusive previews and offers.</p>
          <form className={styles['footer__form']} aria-label="Newsletter signup">
            <Input type="email" placeholder="Email address" aria-label="Email address" required />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className={styles['footer__links']}>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section} className={styles['footer__column']}>
            <p className={styles['footer__heading']}>{section}</p>
            <ul className={styles['footer__list']}>
              {links.map((link) => (
                <li key={link}>
                  <a href="/" className={styles['footer__link']}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className={styles['footer__bottom']}>
      <p className={styles['footer__copy']}>&copy; {new Date().getFullYear()} LuxeGems. All rights reserved.</p>
      <div className={styles['footer__payments']} aria-label="Accepted payment methods">
        <span>Visa</span>
        <span>Mastercard</span>
        <span>Amex</span>
        <span>PayPal</span>
      </div>
      <div className={styles['footer__social']}>
        <a href="/" aria-label="Instagram" className={styles['footer__social-link']}>
          IG
        </a>
        <a href="/" aria-label="Pinterest" className={styles['footer__social-link']}>
          PI
        </a>
        <a href="/" aria-label="TikTok" className={styles['footer__social-link']}>
          TT
        </a>
      </div>
    </div>
  </footer>
);
