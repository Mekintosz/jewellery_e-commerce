import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg" | "menu";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isFullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        {
          [styles["button--full"]]: isFullWidth,
          [styles["button--loading"]]: isLoading,
        },
        className,
      )}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {leftIcon ? (
        <span className={styles["button__icon"]}>{leftIcon}</span>
      ) : null}
      <span className={styles["button__label"]}>{children}</span>
      {rightIcon ? (
        <span className={styles["button__icon"]}>{rightIcon}</span>
      ) : null}
      {isLoading ? (
        <span className={styles["button__spinner"]} aria-hidden="true" />
      ) : null}
    </button>
  ),
);

Button.displayName = "Button";
