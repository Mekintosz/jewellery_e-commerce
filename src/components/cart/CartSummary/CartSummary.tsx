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
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("");
      return;
    }
    const couponData =
      MOCK_COUPONS[trimmedCode.toUpperCase() as keyof typeof MOCK_COUPONS];
    if (!couponData) {
      setError("Invalid coupon code");
      return;
    }
    applyCoupon(couponData);
    setError("");
  };

  const isApplyDisabled = !code.trim();

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
          onChange={(event) => {
            setCode(event.target.value);
            if (error) {
              setError("");
            }
          }}
          error={error}
        />
        <Button
          variant="secondary"
          onClick={handleApply}
          disabled={isApplyDisabled}
        >
          Apply
        </Button>
      </div>
      {coupon ? (
        <div className={styles["summary__applied"]}>
          <p>Applied coupon: {coupon.code}</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => applyCoupon(null)}
          >
            Remove
          </Button>
        </div>
      ) : null}
    </section>
  );
};
