import { RefObject, useEffect } from "react";

type UseInfiniteScrollParams = {
  target: RefObject<Element>;
  onIntersect: () => void;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
};

export const useInfiniteScroll = ({
  target,
  onIntersect,
  enabled = true,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
}: UseInfiniteScrollParams) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const node = target.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect, root, rootMargin, target, threshold]);
};
