'use client';

import { useEffect, useRef, useState } from 'react';

interface UseFadeInOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useFadeInOnScroll(options: UseFadeInOnScrollOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', delay = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 既存のタイムアウトをクリア
          if (delayTimeoutRef.current) {
            clearTimeout(delayTimeoutRef.current);
            delayTimeoutRef.current = null;
          }

          if (entry.isIntersecting) {
            // ビューポートに入ったとき：遅延後に表示
            delayTimeoutRef.current = setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            // ビューポートから出たとき：即座に非表示
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay, isMounted]);

  return { ref: elementRef, isVisible };
}

