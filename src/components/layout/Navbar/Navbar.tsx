import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'About', to: '/contact' },
  { label: 'Profile', to: '/profile' }
];

export const Navbar = () => (
  <nav className={styles.navbar} aria-label="Primary">
    <ul className={styles['navbar__list']}>
      {LINKS.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles['navbar__link']} ${styles['navbar__link--active']}` : styles['navbar__link']
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
