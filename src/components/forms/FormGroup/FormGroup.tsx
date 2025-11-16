import clsx from 'clsx';
import styles from './FormGroup.module.css';

type FormGroupProps = {
  label?: string;
  helperText?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
};

export const FormGroup = ({ label, helperText, error, htmlFor, children, className }: FormGroupProps) => (
  <div className={clsx(styles['form-group'], className)}>
    {label ? (
      <label className={styles['form-group__label']} htmlFor={htmlFor}>
        {label}
      </label>
    ) : null}
    <div
      className={clsx(styles['form-group__control'], {
        [styles['form-group__control--error']]: Boolean(error)
      })}
    >
      {children}
    </div>
    {error ? <span className={styles['form-group__error']}>{error}</span> : null}
    {helperText && !error ? <span className={styles['form-group__helper']}>{helperText}</span> : null}
  </div>
);
