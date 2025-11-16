import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

type LogoProps = {
  to?: string;
};

export const Logo = ({ to = "/" }: LogoProps) => (
  <Link to={to} className={styles.logo} aria-label="Jewellery home">
    <span className={styles["logo__text"]}>Jewells</span>
  </Link>
);
