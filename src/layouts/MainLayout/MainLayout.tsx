import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import { Header } from "../../components/layout/Header/Header";
import { Footer } from "../../components/layout/Footer/Footer";
import { Breadcrumbs } from "../../components/navigation/Breadcrumbs/Breadcrumbs";

export const MainLayout = () => (
  <div className={styles.layout}>
    <Header />
    <div className={styles["layout__breadcrumbs"]}>
      <Breadcrumbs />
    </div>
    <main className={styles["layout__main"]}>
      <Outlet />
    </main>
    <Footer />
  </div>
);
