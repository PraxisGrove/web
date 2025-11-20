'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

interface InViewResult {
  ref: RefObject<HTMLElement | null>;
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export function useInView({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = false,
  skip = false,
}: InViewOptions = {}): InViewResult {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || skip || !ref.current) return;

    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setInView(isIntersecting);
        setEntry(entry);

        if (isIntersecting && triggerOnce) {
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, skip]);

  return { ref, inView, entry };
}

// 多个元素的可见性检测
export function useInViewMultiple(
  count: number,
  options: InViewOptions = {}
): InViewResult[] {
  const [results, setResults] = useState<InViewResult[]>([]);

  useEffect(() => {
    const newResults: InViewResult[] = [];

    for (let i = 0; i < count; i++) {
      newResults.push({
        ref: { current: null },
        inView: false,
      });
    }

    setResults(newResults);
  }, [count]);

  return results.map(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useInView(options);
  });
}

// 带延迟的可见性检测
export function useInViewWithDelay({
  delay = 0,
  ...options
}: InViewOptions & { delay?: number } = {}) {
  const { ref, inView: immediateInView, entry } = useInView(options);
  const [delayedInView, setDelayedInView] = useState(false);

  useEffect(() => {
    if (immediateInView && !delayedInView) {
      const timer = setTimeout(() => {
        setDelayedInView(true);
      }, delay);

      return () => clearTimeout(timer);
    } else if (!immediateInView && delayedInView && !options.triggerOnce) {
      setDelayedInView(false);
    }
  }, [immediateInView, delayedInView, delay, options.triggerOnce]);

  return { ref, inView: delayedInView, entry };
}

// 滚动方向检测
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
    null
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
}

// 滚动进度检测
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;

      setProgress(Math.min(100, Math.max(0, Math.round(scrolled * 100))));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return progress;
}

// 元素位置检测
export function useElementPosition(ref: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [ref]);

  return position;
}
