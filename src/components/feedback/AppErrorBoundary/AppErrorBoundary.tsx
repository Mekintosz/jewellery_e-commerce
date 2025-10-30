import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './AppErrorBoundary.module.css';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.assign(window.location.origin);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles['error-boundary']}>
          <h1 className={styles['error-boundary__title']}>Something went wrong</h1>
          <p className={styles['error-boundary__message']}>
            {this.state.error?.message ?? 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button type="button" className={styles['error-boundary__button']} onClick={this.handleRetry}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
