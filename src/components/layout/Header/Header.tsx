import { ChangeEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Logo } from "../../common/Logo/Logo";
import { Badge } from "../../ui/Badge/Badge";
import { Navbar } from "../Navbar/Navbar";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { useUI } from "../../../context/UIContext";
import { MiniCart } from "../../cart/MiniCart/MiniCart";
import { useProducts } from "../../../context/ProductContext";

export const Header = () => {
  const { items } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useUI();
  const { filters, setFilters } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setFilters((prev) => ({
      ...prev,
      query,
    }));

    const nextParams = new URLSearchParams(
      location.pathname === "/products" ? location.search : ""
    );
    if (query.trim().length > 0) {
      nextParams.set("query", query);
    } else {
      nextParams.delete("query");
    }

    const nextSearch = nextParams.toString();
    const nextUrl =
      nextSearch.length > 0 ? `/products?${nextSearch}` : "/products";
    navigate(nextUrl, { replace: location.pathname === "/products" });
  };

  const handleCartToggle = () => {
    setMiniCartOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles["header__inner"]}>
        <div className={styles["header__left"]}>
          <button
            className={styles["header__menu"]}
            aria-label="Open navigation"
            onClick={() => openModal("menu")}
          >
            ☰
          </button>
          <Logo />
          <Navbar />
        </div>
        <div className={styles["header__search"]}>
          <span
            className={`${
              styles["header__search-icon"]
            } ${"material-symbols-outlined"}`}
            aria-hidden="true"
          >
            search
          </span>
          <input
            className={styles["header__search-field"]}
            placeholder="Search jewellery"
            aria-label="Search jewellery"
            onChange={handleSearchChange}
            value={filters.query}
          />
        </div>
        <div className={styles["header__actions"]}>
          <Link
            to="/wishlist"
            className={`${styles["header__icon"]} ${styles["header__wishlist"]}`}
            aria-label="View wishlist"
          >
            Wishlist
          </Link>
          <button
            type="button"
            className={styles["header__icon"]}
            onClick={handleCartToggle}
            aria-label="Open cart"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 ? (
              <Badge
                className={styles["header__badge"]}
                variant="default"
                size="cart"
              >
                {cartCount}
              </Badge>
            ) : null}
          </button>
          {isAuthenticated && user ? (
            <Link to="/profile" className={styles["header__account"]}>
              <span className={styles["header__avatar"]} aria-hidden="true">
                {user.firstName.charAt(0)}
              </span>
              <span className={styles["header__name"]}>{user.firstName}</span>
            </Link>
          ) : (
            <Link to="/login" className={styles["header__signin"]}>
              Sign in
            </Link>
          )}
        </div>
      </div>
      <MobileMenu />
      <MiniCart
        isOpen={isMiniCartOpen}
        onClose={() => setMiniCartOpen(false)}
      />
    </header>
  );
};
