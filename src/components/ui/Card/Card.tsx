import clsx from 'clsx';
import styles from './Card.module.css';

type CardProps = {
  heading?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ heading, actions, children, className }: CardProps) => (
  <section className={clsx(styles.card, className)}>
    {(heading || actions) && (
      <header className={styles['card__header']}>
        {heading ? <h3 className={styles['card__title']}>{heading}</h3> : null}
        {actions ? <div className={styles['card__actions']}>{actions}</div> : null}
      </header>
    )}
    <div className={styles['card__body']}>{children}</div>
  </section>
);
