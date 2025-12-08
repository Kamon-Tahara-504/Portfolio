'use client';

import { useEffect, useState, useRef } from 'react';

interface UseCountUpAnimationOptions {
  targetValue: number;
  duration?: number;
  delay?: number;
  isVisible: boolean;
}

export function useCountUpAnimation({
  targetValue,
  duration = 1500,
  delay = 0,
  isVisible,
}: UseCountUpAnimationOptions) {
  const [currentValue, setCurrentValue] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // 表示されていない、または既にアニメーション済みの場合は何もしない
    if (!isVisible || hasAnimatedRef.current) {
      return;
    }

    // 遅延後にアニメーション開始
    delayTimeoutRef.current = setTimeout(() => {
      hasAnimatedRef.current = true;
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // ease-outイージング関数
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const newValue = Math.floor(targetValue * easeOut);
        setCurrentValue(newValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // アニメーション完了時は確実に目標値に設定
          setCurrentValue(targetValue);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    // クリーンアップ
    return () => {
      if (delayTimeoutRef.current !== null) {
        clearTimeout(delayTimeoutRef.current);
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, delay, isVisible]);

  // 非表示になったらリセット（オプション：必要に応じてコメントアウト）
  useEffect(() => {
    if (!isVisible && hasAnimatedRef.current) {
      // 非表示になったらリセットする場合は以下のコメントを外す
      // setCurrentValue(0);
      // hasAnimatedRef.current = false;
    }
  }, [isVisible]);

  return currentValue;
}
