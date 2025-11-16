import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './Modal.module.css';
import { Button } from '../Button/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Modal = ({ isOpen, onClose, title, children, ariaLabel, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modal} role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={title ? 'modal-title' : undefined}>
      <div className={styles['modal__backdrop']} aria-hidden="true" onClick={onClose} />
      <div className={clsx(styles['modal__content'], styles[`modal__content--${size}`])}>
        <div className={styles['modal__header']}>
          {title ? (
            <h2 id="modal-title" className={styles['modal__title']}>
              {title}
            </h2>
          ) : null}
          <Button variant="ghost" aria-label="Close modal" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className={styles['modal__body']}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
