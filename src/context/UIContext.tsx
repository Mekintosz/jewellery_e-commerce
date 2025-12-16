import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ModalType, ToastMessage, ToastVariant, UIState } from "../types/ui";

type UIContextValue = UIState & {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

const createToast = (toast: Omit<ToastMessage, "id">): ToastMessage => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `toast-${Date.now()}`,
  ...toast,
});

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UIState>({
    activeModal: "none",
    isLoading: false,
    toasts: [],
  });

  const openModal = useCallback((modal: ModalType) => {
    setState((prev) => ({
      ...prev,
      activeModal: modal,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeModal: "none",
    }));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, createToast(toast)],
    }));
  }, []);

  const removeToast = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
      addToast,
      removeToast,
      setLoading,
    }),
    [addToast, closeModal, openModal, removeToast, setLoading, state],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
};
