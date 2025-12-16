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
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch {
      return initialValue;
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

  const remove = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      setStoredValue(initialValue);
    }
  }, [initialValue, key]);

  return {
    value: storedValue,
    setValue: setStoredValue,
    remove,
  };
};
