import { FormEvent, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { Input } from '../../components/forms/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/ui/Alert/Alert';

type LocationState = {
  from?: {
    pathname: string;
  };
};

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    try {
      await login(email, password);
      navigate(state?.from?.pathname ?? '/profile', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles['page__header']}>
        <h1 className={styles['page__title']}>Sign in</h1>
        <p className={styles['page__subtitle']}>
          Access your saved pieces, order history, and personalised recommendations.
        </p>
      </header>
      {error ? <Alert variant="error" title="Authentication failed" description={error} /> : null}
      <form className={styles['page__form']} onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" id="email" required />
        <Input label="Password" name="password" type="password" id="password" required />
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
      <p className={styles['page__footer']}>
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
