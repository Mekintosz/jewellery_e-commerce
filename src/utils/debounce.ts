export type DebouncedFunction<Args extends unknown[]> = ((
  ...args: Args
) => void) & {
  cancel: () => void;
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as DebouncedFunction<Args>;

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  return debounced;
};
