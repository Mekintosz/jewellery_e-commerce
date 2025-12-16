import { ReactNode, useEffect, useId, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./Modal.module.css";
import { Button } from "../Button/Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
};

const getFocusableElements = (container: HTMLElement) => {
  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        'input:not([disabled]):not([type="hidden"])',
        "select:not([disabled])",
        "textarea:not([disabled])",
        "iframe",
        "object",
        "embed",
        '[contenteditable="true"]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(","),
    ),
  );

  return focusables.filter((el) => {
    const isHidden = el.getAttribute("aria-hidden") === "true";
    return !isHidden && el.tabIndex >= 0;
  });
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  ariaLabel,
  size = "md",
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = originalOverflow;

      const previouslyFocused = previouslyFocusedElementRef.current;
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const dialogEl = dialogRef.current;
    if (!dialogEl) {
      return;
    }

    const focusables = getFocusableElements(dialogEl);

    if (focusables.length === 0) {
      event.preventDefault();
      dialogEl.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === dialogEl) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal}>
      <div
        className={styles["modal__backdrop"]}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className={clsx(
          styles["modal__content"],
          styles[`modal__content--${size}`],
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className={styles["modal__header"]}>
          {title ? (
            <h2 id={titleId} className={styles["modal__title"]}>
              {title}
            </h2>
          ) : null}
          <Button variant="ghost" aria-label="Close modal" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className={styles["modal__body"]}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
