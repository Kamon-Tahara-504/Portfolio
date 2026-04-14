"use client";

import { useContext, useState } from "react";
import emailjs from "@emailjs/browser";
import { ViewContext } from "@/components/Layout";
import ContactModalStatus from "./ContactModal/ContactModalStatus";
import ContactFormFields from "./ContactModal/ContactFormFields";
import { getTvPowerAnimationClass, useModalLifecycle } from "@/hooks/useModalLifecycle";

interface ContactModalProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const viewContext = useContext(ViewContext);
  const { isOpen, isClosing, handleClose } = useModalLifecycle({
    onClose,
    setIsModalOpen: viewContext?.setIsModalOpen,
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "名前を入力してください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "件名を入力してください";
    }

    if (!formData.message.trim()) {
      newErrors.message = "メッセージを入力してください";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "メッセージは10文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const toEmail = process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL;

      if (!publicKey || !serviceId || !templateId || !toEmail) {
        throw new Error("環境変数が設定されていません");
      }

      // EmailJSを初期化
      emailjs.init(publicKey);

      // メール送信
      await emailjs.send(serviceId, templateId, {
        to_email: toEmail,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // 3秒後にモーダルを閉じる
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Email送信エラー:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // body { overflow: hidden } で背景スクロールは制御済み
  };

  const handleWheel = (e: React.WheelEvent) => {
    // 同上
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md transition-opacity duration-300 ease-out sm:p-4 lg:p-6 ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className={`relative h-[94vh] max-h-[94vh] w-full max-w-[min(980px,94vw)] select-none rounded-2xl border border-zinc-300/20 bg-zinc-950/95 text-zinc-100 shadow-2xl md:h-[88vh] md:max-h-[88vh] lg:h-[84vh] lg:max-h-[84vh] ${getTvPowerAnimationClass(isOpen, isClosing)}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300/30 bg-zinc-900/90 text-zinc-100 shadow-md transition-[transform,box-shadow] duration-200 hover:bg-zinc-800 active:translate-y-0.5 active:shadow-sm sm:right-4 sm:top-4"
          aria-label="モーダルを閉じる"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-10">
          <h2 className="mb-6 text-[clamp(1.85rem,4vw,2.4rem)] font-bold tracking-tight lg:mb-8">
            お問い合わせ
          </h2>

          <ContactModalStatus submitStatus={submitStatus} />

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <ContactFormFields
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            {/* 送信ボタン */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="group flex-1 rounded-full border border-zinc-300/30 bg-zinc-900/70 px-6 py-3 text-sm font-bold text-zinc-100 shadow-md transition-[border-color,transform,box-shadow,background-color] duration-300 hover:scale-105 hover:border-zinc-300/50 hover:bg-zinc-800/85 hover:shadow-lg active:scale-[1.02] active:shadow-sm sm:text-base"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full border border-zinc-200/40 bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                {isSubmitting ? "送信中..." : "送信"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

