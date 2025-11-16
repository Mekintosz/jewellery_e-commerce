import styles from './UserProfilePage.module.css';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Address } from '../../types/user';

const UserProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <p className={styles['page__empty']}>Please sign in to view your profile.</p>;
  }

  return (
    <div className={styles.page}>
      <header className={styles['page__header']}>
        <h1 className={styles['page__title']}>
          Welcome back, {user.firstName} {user.lastName}
        </h1>
        <Button variant="ghost" onClick={logout}>
          Sign out
        </Button>
      </header>

      <div className={styles['page__grid']}>
        <Card heading="Personal details">
          <ul className={styles['page__list']}>
            <li>Email: {user.email}</li>
            {user.phone ? <li>Phone: {user.phone}</li> : null}
          </ul>
          <Button variant="secondary" size="sm">
            Edit profile
          </Button>
        </Card>

        <Card heading="Saved addresses">
          {user.addresses.length === 0 ? (
            <p>No saved addresses yet.</p>
          ) : (
            <ul className={styles['page__list']}>
              {user.addresses.map((address: Address) => (
                <li key={address.id}>
                  <strong>{address.label}</strong>
                  <div>{address.line1}</div>
                  <div>
                    {address.city}, {address.state} {address.postalCode}
                  </div>
                  <div>{address.country}</div>
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" size="sm">
            Add address
          </Button>
        </Card>

        <Card heading="Payment methods">
          {user.paymentMethods.length === 0 ? (
            <p>No payment methods saved.</p>
          ) : (
            <ul className={styles['page__list']}>
              {user.paymentMethods.map((method) => (
                <li key={method.id}>
                  {method.brand} ending in {method.last4}, expires {method.expiryMonth}/{method.expiryYear}
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" size="sm">
            Add payment method
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
