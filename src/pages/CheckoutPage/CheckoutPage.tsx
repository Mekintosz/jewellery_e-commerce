import { FormEvent, useState } from 'react';
import styles from './CheckoutPage.module.css';
import { Input } from '../../components/forms/Input/Input';
import { Select } from '../../components/forms/Select/Select';
import { Checkbox } from '../../components/forms/Checkbox/Checkbox';
import { Button } from '../../components/ui/Button/Button';
import { CartSummary } from '../../components/cart/CartSummary/CartSummary';
import { useCart } from '../../context/CartContext';
import { Alert } from '../../components/ui/Alert/Alert';

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      clearCart();
    }, 1200);
  };

  if (items.length === 0 && !isCompleted) {
    return (
      <div className={styles['page__empty']}>
        <p>Your bag is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles['page__header']}>
        <h1 className={styles['page__title']}>Checkout</h1>
        <p className={styles['page__subtitle']}>Secure payments with 256-bit encryption.</p>
      </header>

      {isCompleted ? (
        <Alert
          variant="success"
          title="Thank you for your order!"
          description="We have sent a confirmation email with your order details."
        />
      ) : null}

      <form className={styles['page__form']} onSubmit={handleSubmit}>
        <section className={styles['page__section']}>
          <h2 className={styles['page__heading']}>Shipping address</h2>
          <div className={styles['page__grid']}>
            <Input label="First name" id="first-name" name="firstName" required />
            <Input label="Last name" id="last-name" name="lastName" required />
          </div>
          <Input label="Email" type="email" id="email" name="email" required />
          <Input label="Street address" id="address" name="address" required />
          <div className={styles['page__grid']}>
            <Input label="City" id="city" name="city" required />
            <Select label="Country" id="country" name="country" required defaultValue="USA">
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CAN">Canada</option>
              <option value="AUS">Australia</option>
            </Select>
            <Input label="Postal code" id="postal" name="postal" required />
          </div>
          <Checkbox label="Save this address for future purchases" name="saveAddress" />
        </section>

        <section className={styles['page__section']}>
          <h2 className={styles['page__heading']}>Payment</h2>
          <Select label="Payment method" id="payment-method" name="paymentMethod" defaultValue="card">
            <option value="card">Credit card</option>
            <option value="paypal">PayPal</option>
          </Select>
          <div className={styles['page__grid']}>
            <Input label="Cardholder name" id="card-name" name="cardName" required />
            <Input label="Card number" id="card-number" name="cardNumber" inputMode="numeric" required />
          </div>
          <div className={styles['page__grid']}>
            <Input label="Expiry" id="expiry" name="expiry" placeholder="MM/YY" required />
            <Input label="Security code" id="cvc" name="cvc" inputMode="numeric" required />
          </div>
          <Checkbox label="Bill to the same address" name="sameBilling" defaultChecked />
        </section>

        <aside className={styles['page__summary']}>
          <CartSummary />
          <Button type="submit" variant="primary" size="lg" isFullWidth isLoading={isSubmitting}>
            Place order
          </Button>
        </aside>
      </form>
    </div>
  );
};

export default CheckoutPage;
