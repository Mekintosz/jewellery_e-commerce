import { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, className, id, children, ...props }, ref) => (
    <div className={clsx(styles.select, className)}>
      {label ? (
        <label className={styles["select__label"]} htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div
        className={clsx(styles["select__control"], {
          [styles["select__control--error"]]: Boolean(error),
        })}
      >
        <select
          ref={ref}
          id={id}
          className={styles["select__field"]}
          {...props}
        >
          {children}
        </select>
        <span aria-hidden="true" className={styles["select__icon"]}>
          ▾
        </span>
      </div>
      {error ? (
        <span className={styles["select__error"]} role="alert">
          {error}
        </span>
      ) : null}
      {helperText && !error ? (
        <span className={styles["select__helper"]}>{helperText}</span>
      ) : null}
    </div>
  ),
);

Select.displayName = "Select";
