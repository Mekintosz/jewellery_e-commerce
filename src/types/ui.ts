export type ModalType = 'cart' | 'menu' | 'auth' | 'filter' | 'none';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  timeout?: number;
};

export type UIState = {
  activeModal: ModalType;
  isLoading: boolean;
  toasts: ToastMessage[];
};
