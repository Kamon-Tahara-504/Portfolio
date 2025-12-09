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

  useEffect(() => {
    // 非表示になったらアニメーションを停止し、値をリセット
    if (!isVisible) {
      // 既存のタイムアウトとアニメーションフレームをクリア
      if (delayTimeoutRef.current !== null) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      setCurrentValue(0);
      return;
    }

    // 表示されたとき：遅延後にアニメーション開始
    delayTimeoutRef.current = setTimeout(() => {
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        // アニメーション中に非表示になった場合は停止
        if (!isVisible) {
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          setCurrentValue(0);
          return;
        }

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

  return currentValue;
}
