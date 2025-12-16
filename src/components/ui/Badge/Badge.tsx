import clsx from "clsx";
import styles from "./Badge.module.css";

type BadgeVariant = "default" | "success" | "danger" | "warning";
type BadgeSize = "sm" | "md" | "cart";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
};

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) => (
  <span
    className={clsx(
      styles.badge,
      styles[`badge--${variant}`],
      styles[`badge--${size}`],
      className,
    )}
  >
    {children}
  </span>
);
