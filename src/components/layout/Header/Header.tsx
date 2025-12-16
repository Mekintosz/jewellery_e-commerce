import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { debounce } from "../../../utils/debounce";

export const Header = () => {
  const { items } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useUI();
  const { filters, setFilters } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnProductsPage = location.pathname === "/products";

  const [searchValue, setSearchValue] = useState(filters.query);
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const isEditingSearchRef = useRef(false);

  useEffect(() => {
    if (!isEditingSearchRef.current) {
      setSearchValue(filters.query);
    }
  }, [filters.query]);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setFilters((prev) => {
          if (prev.query === query) {
            return prev;
          }
          return { ...prev, query };
        });
      }, 250),
    [setFilters],
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  useEffect(() => {
    if (!isOnProductsPage) {
      debouncedSetQuery.cancel();
    }
  }, [debouncedSetQuery, isOnProductsPage]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    isEditingSearchRef.current = true;

    const query = event.target.value;
    setSearchValue(query);

    if (isOnProductsPage) {
      debouncedSetQuery(query);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isEditingSearchRef.current = false;

    const normalized = searchValue.trim();
    setSearchValue(normalized);

    debouncedSetQuery.cancel();

    if (isOnProductsPage) {
      setFilters((prev) => {
        if (prev.query === normalized) {
          return prev;
        }
        return { ...prev, query: normalized };
      });
      return;
    }

    const nextParams = new URLSearchParams();
    if (normalized.length > 0) {
      nextParams.set("query", normalized);
    }

    const nextSearch = nextParams.toString();
    const nextUrl =
      nextSearch.length > 0 ? `/products?${nextSearch}` : "/products";
    navigate(nextUrl);
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
        <form
          className={styles["header__search"]}
          role="search"
          onSubmit={handleSearchSubmit}
        >
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
            type="search"
            placeholder="Search jewellery"
            aria-label="Search jewellery"
            onFocus={() => {
              isEditingSearchRef.current = true;
            }}
            onBlur={() => {
              isEditingSearchRef.current = false;
            }}
            onChange={handleSearchChange}
            value={searchValue}
          />
        </form>
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
