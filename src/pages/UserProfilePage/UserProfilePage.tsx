import { useState } from "react";
import styles from "./UserProfilePage.module.css";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button/Button";
import { Address } from "../../types/user";

type Section = "profile" | "orders" | "shipping" | "payments";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("profile");

  if (!user) {
    return (
      <p className={styles["page__empty"]}>
        Please sign in to view your profile.
      </p>
    );
  }

  // Mock orders data
  const orders = [
    {
      id: "#34562",
      date: "June 15, 2024",
      total: "$250.00",
      status: "Delivered",
      statusClass: styles["status--delivered"],
    },
    {
      id: "#34501",
      date: "May 28, 2024",
      total: "$120.50",
      status: "Shipped",
      statusClass: styles["status--shipped"],
    },
    {
      id: "#34498",
      date: "May 25, 2024",
      total: "$45.00",
      status: "Processing",
      statusClass: styles["status--processing"],
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.page__title}>My Account</h1>

      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebar__card}>
            <div className={styles.sidebar__user}>
              <div className={styles.sidebar__avatar}>
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className={styles.sidebar__info}>
                <h2 className={styles.sidebar__name}>
                  {user.firstName} {user.lastName}
                </h2>
                <p className={styles.sidebar__email}>{user.email}</p>
              </div>
            </div>

            <nav className={styles.sidebar__nav}>
              <button
                className={`${styles.sidebar__link} ${
                  activeSection === "profile"
                    ? styles["sidebar__link--active"]
                    : ""
                }`}
                onClick={() => setActiveSection("profile")}
              >
                <span className={styles.sidebar__icon}>person</span>
                <span>Profile</span>
              </button>
              <button
                className={`${styles.sidebar__link} ${
                  activeSection === "orders"
                    ? styles["sidebar__link--active"]
                    : ""
                }`}
                onClick={() => setActiveSection("orders")}
              >
                <span className={styles.sidebar__icon}>shopping_cart</span>
                <span>Orders</span>
              </button>
              <button
                className={`${styles.sidebar__link} ${
                  activeSection === "shipping"
                    ? styles["sidebar__link--active"]
                    : ""
                }`}
                onClick={() => setActiveSection("shipping")}
              >
                <span className={styles.sidebar__icon}>local_shipping</span>
                <span>Shipping Addresses</span>
              </button>
              <button
                className={`${styles.sidebar__link} ${
                  activeSection === "payments"
                    ? styles["sidebar__link--active"]
                    : ""
                }`}
                onClick={() => setActiveSection("payments")}
              >
                <span className={styles.sidebar__icon}>payment</span>
                <span>Payment Methods</span>
              </button>
            </nav>

            <Button
              variant="primary"
              onClick={logout}
              className={styles.sidebar__logout}
            >
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Profile Section */}
          {activeSection === "profile" && (
            <section className={styles.section}>
              <h2 className={styles.section__title}>Profile Information</h2>
              <form className={styles.form}>
                <div className={styles.form__grid}>
                  <div className={styles.form__group}>
                    <label className={styles.form__label} htmlFor="name">
                      Full Name
                    </label>
                    <input
                      className={styles.form__input}
                      id="name"
                      type="text"
                      defaultValue={`${user.firstName} ${user.lastName}`}
                    />
                  </div>
                  <div className={styles.form__group}>
                    <label className={styles.form__label} htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className={styles.form__input}
                      id="email"
                      type="email"
                      defaultValue={user.email}
                    />
                  </div>
                </div>
                <div className={styles.form__group}>
                  <label className={styles.form__label} htmlFor="password">
                    Change Password
                  </label>
                  <input
                    className={styles.form__input}
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className={styles.form__actions}>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </section>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <section className={styles.section}>
              <h2 className={styles.section__title}>My Orders</h2>
              <div className={styles.table__wrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.table__header}>Order #</th>
                      <th className={styles.table__header}>Date</th>
                      <th className={styles.table__header}>Total</th>
                      <th className={styles.table__header}>Status</th>
                      <th className={styles.table__header}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className={styles.table__cell}>{order.id}</td>
                        <td className={styles.table__cell}>{order.date}</td>
                        <td className={styles.table__cell}>{order.total}</td>
                        <td className={styles.table__cell}>
                          <span
                            className={`${styles.status} ${order.statusClass}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          className={`${styles.table__cell} ${styles["table__cell--actions"]}`}
                        >
                          <a href="#" className={styles.table__link}>
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Shipping Addresses Section */}
          {activeSection === "shipping" && (
            <section className={styles.section}>
              <div className={styles.section__header}>
                <h2 className={styles.section__title}>Shipping Addresses</h2>
                <Button variant="primary" size="sm">
                  <span className={styles.button__icon}>+</span>
                  Add New Address
                </Button>
              </div>
              <div className={styles.cards}>
                {user.addresses.length === 0 ? (
                  <p>No saved addresses yet.</p>
                ) : (
                  user.addresses.map((address: Address) => (
                    <div key={address.id} className={styles.card}>
                      <div className={styles.card__content}>
                        <div>
                          <p className={styles.card__title}>{address.label}</p>
                          <p className={styles.card__text}>{address.line1}</p>
                          <p className={styles.card__text}>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                        </div>
                        <div className={styles.card__actions}>
                          <button
                            className={styles.card__button}
                            aria-label="Edit"
                          >
                            <span className={styles.card__icon}>edit</span>
                          </button>
                          <button
                            className={styles.card__button}
                            aria-label="Delete"
                          >
                            <span className={styles.card__icon}>delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Payment Methods Section */}
          {activeSection === "payments" && (
            <section className={styles.section}>
              <div className={styles.section__header}>
                <h2 className={styles.section__title}>Payment Methods</h2>
                <Button variant="primary" size="sm">
                  <span className={styles.button__icon}>+</span>
                  Add New Card
                </Button>
              </div>
              <div className={styles.cards}>
                {user.paymentMethods.length === 0 ? (
                  <div className={styles.card__empty}>
                    <span className={styles.card__empty__icon}>add_card</span>
                    <p className={styles.card__empty__text}>
                      You have no payment methods.
                    </p>
                  </div>
                ) : (
                  user.paymentMethods.map((method) => (
                    <div key={method.id} className={styles.card}>
                      <div className={styles.card__content}>
                        <div>
                          <p className={styles.card__title}>
                            {method.brand} ending in **** {method.last4}
                          </p>
                          <p className={styles.card__text}>
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                        <div className={styles.card__actions}>
                          <button
                            className={styles.card__button}
                            aria-label="Edit"
                          >
                            <span className={styles.card__icon}>edit</span>
                          </button>
                          <button
                            className={styles.card__button}
                            aria-label="Delete"
                          >
                            <span className={styles.card__icon}>delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
