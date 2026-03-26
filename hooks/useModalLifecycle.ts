"use client";

import { useEffect, useState } from "react";

interface UseModalLifecycleOptions {
  onClose: () => void;
  setIsModalOpen?: (open: boolean) => void;
}

export function useModalLifecycle({
  onClose,
  setIsModalOpen,
}: UseModalLifecycleOptions) {
  const [isOpen, setIsOpen] = useState(false);

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
        onClose();
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
  }, [onClose]);

  return { isOpen };
}
