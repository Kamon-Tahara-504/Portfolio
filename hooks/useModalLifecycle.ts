"use client";

import { useCallback, useEffect, useState } from "react";

interface UseModalLifecycleOptions {
  onClose: () => void;
  setIsModalOpen?: (open: boolean) => void;
}

// TV電源風の開閉演出クラスをモーダル間で共通化する。
export function getTvPowerAnimationClass(isOpen: boolean, isClosing: boolean): string {
  if (isClosing) return "animate-tv-close";
  if (isOpen) return "animate-tv-open";
  return "scale-y-0 opacity-0";
}

export function useModalLifecycle({
  onClose,
  setIsModalOpen,
}: UseModalLifecycleOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 250);
  }, [isClosing, onClose]);

  useEffect(() => {
    setIsOpen(true);
    setIsModalOpen?.(true);

    return () => {
      setIsModalOpen?.(false);
    };
  }, [setIsModalOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  return { isOpen, isClosing, handleClose };
}
