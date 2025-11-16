import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, leftIcon, rightIcon, id, ...props }, ref) => (
    <div className={clsx(styles.input, className)}>
      {label ? (
        <label className={styles['input__label']} htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div
        className={clsx(styles['input__control'], {
          [styles['input__control--error']]: Boolean(error)
        })}
      >
        {leftIcon ? <span className={styles['input__icon']}>{leftIcon}</span> : null}
        <input ref={ref} id={id} className={styles['input__field']} {...props} />
        {rightIcon ? <span className={styles['input__icon']}>{rightIcon}</span> : null}
      </div>
      {error ? <span className={styles['input__error']} role="alert">{error}</span> : null}
      {helperText && !error ? <span className={styles['input__helper']}>{helperText}</span> : null}
    </div>
  )
);

Input.displayName = 'Input';
