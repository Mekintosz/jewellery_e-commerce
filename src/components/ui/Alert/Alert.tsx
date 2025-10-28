import clsx from 'clsx';
import styles from './Alert.module.css';

type AlertVariant = 'success' | 'error' | 'info';

type AlertProps = {
  title: string;
  description?: string;
  variant?: AlertVariant;
  action?: React.ReactNode;
  className?: string;
};

export const Alert = ({ title, description, variant = 'info', action, className }: AlertProps) => (
  <div className={clsx(styles.alert, styles[`alert--${variant}`], className)} role="status">
    <div>
      <p className={styles['alert__title']}>{title}</p>
      {description ? <p className={styles['alert__description']}>{description}</p> : null}
    </div>
    {action ? <div className={styles['alert__action']}>{action}</div> : null}
  </div>
);
