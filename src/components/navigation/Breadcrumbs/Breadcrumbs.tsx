import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const LABEL_MAP: Record<string, string> = {
  products: "Products",
  checkout: "Checkout",
  cart: "Cart",
  contact: "Contact",
  profile: "Profile",
  register: "Register",
};

const getLabel = (segment: string) =>
  LABEL_MAP[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

export const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = [
    { label: "Home", to: "/" },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        label: getLabel(segment),
        to: path,
      };
    }),
  ];

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles["breadcrumbs__list"]}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.to} className={styles["breadcrumbs__item"]}>
              {isLast ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className={styles["breadcrumbs__link"]}>
                  {crumb.label}
                </Link>
              )}
              {!isLast ? (
                <span
                  className={styles["breadcrumbs__separator"]}
                  aria-hidden="true"
                >
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
