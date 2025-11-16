import clsx from 'clsx';
import styles from './Loader.module.css';

type LoaderVariant = 'inline' | 'section' | 'page';

type LoaderProps = {
  variant?: LoaderVariant;
  label?: string;
};

export const Loader = ({ variant = 'inline', label = 'Loading' }: LoaderProps) => (
  <div className={clsx(styles.loader, styles[`loader--${variant}`])} role="status" aria-live="polite">
    <span className={styles['loader__spinner']} />
    <span className={styles['loader__label']}>{label}</span>
  </div>
);
