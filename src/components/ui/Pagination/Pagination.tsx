import clsx from 'clsx';
import styles from './Pagination.module.css';
import { Button } from '../Button/Button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  const pages = range(start, end);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </Button>
      <ul className={styles['pagination__list']}>
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={clsx(styles['pagination__item'], {
                [styles['pagination__item--active']]: page === currentPage
              })}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </Button>
    </nav>
  );
};
