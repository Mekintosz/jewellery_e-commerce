import { NavLink } from "react-router-dom";
import styles from "./MobileMenu.module.css";
import { Button } from "../../ui/Button/Button";
import { useUI } from "../../../context/UIContext";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Contact", to: "/contact" },
  { label: "Profile", to: "/profile" },
];

export const MobileMenu = () => {
  const { activeModal, closeModal } = useUI();
  const isOpen = activeModal === "menu";

  return (
    <div
      className={`${styles["mobile-menu"]} ${
        isOpen ? styles["mobile-menu--open"] : ""
      }`}
      aria-hidden={!isOpen}
    >
      <div className={styles["mobile-menu__header"]}>
        <p className={styles["mobile-menu__title"]}>Menu</p>
        <Button
          variant="ghost"
          size="menu"
          onClick={closeModal}
          aria-label="Close mobile menu"
        >
          ✕
        </Button>
      </div>
      <nav
        className={styles["mobile-menu__nav"]}
        aria-label="Mobile navigation"
      >
        <ul className={styles["mobile-menu__list"]}>
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={styles["mobile-menu__link"]}
                onClick={closeModal}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
