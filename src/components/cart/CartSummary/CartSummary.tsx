import { useState } from "react";
import styles from "./CartSummary.module.css";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/currency";
import { Input } from "../../forms/Input/Input";
import { Button } from "../../ui/Button/Button";

const MOCK_COUPONS = {
  LUXE15: {
    code: "LUXE15",
    description: "15% off your order",
    discountPercentage: 15,
  },
} as const;

export const CartSummary = () => {
  const { summary, applyCoupon, coupon } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const couponData =
      MOCK_COUPONS[code.toUpperCase() as keyof typeof MOCK_COUPONS];
    if (!couponData) {
      setError("Invalid coupon code");
      return;
    }
    applyCoupon(couponData);
    setError("");
  };

  return (
    <section className={styles.summary}>
      <h2 className={styles["summary__title"]}>Order Summary</h2>
      <div className={styles["summary__row"]}>
        <span>Subtotal</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      <div className={styles["summary__row"]}>
        <span>Discount</span>
        <span>-{formatCurrency(summary.discounts)}</span>
      </div>
      <div className={styles["summary__row"]}>
        <span>Estimated tax</span>
        <span>{formatCurrency(summary.tax)}</span>
      </div>
      <div className={styles["summary__total"]}>
        <span>Total</span>
        <strong>{formatCurrency(summary.total)}</strong>
      </div>

      <div className={styles["summary__coupon"]}>
        <Input
          placeholder="Promo code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          error={error}
        />
        <Button variant="secondary" onClick={handleApply}>
          Apply
        </Button>
      </div>
      {coupon ? (
        <p className={styles["summary__applied"]}>
          Applied coupon: {coupon.code}
        </p>
      ) : null}
    </section>
  );
};
