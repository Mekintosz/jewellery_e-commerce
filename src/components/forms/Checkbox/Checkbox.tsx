import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.css';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, className, ...props }, ref) => (
    <label className={clsx(styles.checkbox, className)}>
      <input ref={ref} type="checkbox" className={styles['checkbox__input']} {...props} />
      <span className={styles['checkbox__box']} aria-hidden="true">
        <span className={styles['checkbox__indicator']} />
      </span>
      {label ? <span className={styles['checkbox__label']}>{label}</span> : null}
      {helperText ? <span className={styles['checkbox__helper']}>{helperText}</span> : null}
    </label>
  )
);

Checkbox.displayName = 'Checkbox';
