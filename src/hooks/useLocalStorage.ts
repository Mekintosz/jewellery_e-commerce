import { useCallback, useEffect, useRef, useState } from "react";

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
};

const defaultSerializer = <T>(value: T) => JSON.stringify(value);
const defaultDeserializer = <T>(value: string): T => JSON.parse(value) as T;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
) => {
  const { serializer = defaultSerializer, deserializer = defaultDeserializer } =
    options;
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  });

  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    try {
      const value = serializer(storedValue);
      window.localStorage.setItem(key, value);
    } catch {
      // no-op; localStorage write failures should not break UI
    }
  }, [key, serializer, storedValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        setStoredValue(initialValueRef.current);
        return;
      }

      try {
        const nextValue = deserializer(event.newValue);
        setStoredValue(nextValue);
      } catch {
        setStoredValue(initialValueRef.current);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [deserializer, key]);

  const remove = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
    }
    setStoredValue(initialValueRef.current);
  }, [key]);

  return {
    value: storedValue,
    setValue: setStoredValue,
    remove,
  };
};
