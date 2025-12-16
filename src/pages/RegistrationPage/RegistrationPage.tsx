import { FormEvent, useState } from "react";
import styles from "./RegistrationPage.module.css";
import { Input } from "../../components/forms/Input/Input";
import { Checkbox } from "../../components/forms/Checkbox/Checkbox";
import { Button } from "../../components/ui/Button/Button";
import { Alert } from "../../components/ui/Alert/Alert";

const RegistrationPage = () => {
  const [errors, setErrors] = useState<{ password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password")?.toString() ?? "";
    const confirmPassword = data.get("confirmPassword")?.toString() ?? "";

    if (password !== confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsCreated(true);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      <header className={styles["page__header"]}>
        <h1 className={styles["page__title"]}>Join LuxeGems</h1>
        <p className={styles["page__subtitle"]}>
          Enjoy tailored recommendations and expedited checkout.
        </p>
      </header>
      {isCreated ? (
        <Alert
          variant="success"
          title="Welcome to the circle"
          description="Your account has been created. Sign in to explore your personalised experience."
        />
      ) : null}
      <form className={styles["page__form"]} onSubmit={handleSubmit}>
        <Input label="First name" name="firstName" id="first-name" required />
        <Input label="Last name" name="lastName" id="last-name" required />
        <Input label="Email" name="email" type="email" id="email" required />
        <Input
          label="Password"
          name="password"
          id="password"
          type="password"
          required
          minLength={8}
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          id="confirm-password"
          type="password"
          required
          error={errors.password}
        />
        <Checkbox
          name="subscribe"
          label="Keep me updated with new launches, curated guides, and private events."
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        >
          Create account
        </Button>
      </form>
    </div>
  );
};

export default RegistrationPage;
