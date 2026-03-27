"use client";

import { useCallback, useEffect, useState } from "react";

interface UseModalLifecycleOptions {
  onClose: () => void;
  setIsModalOpen?: (open: boolean) => void;
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
