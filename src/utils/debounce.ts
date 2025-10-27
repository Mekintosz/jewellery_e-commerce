export const debounce = <T extends (...args: never[]) => void>(fn: T, delay: number) => {
  let timeoutId: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
