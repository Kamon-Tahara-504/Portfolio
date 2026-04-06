"use client";

import { useContext, useState } from "react";
import emailjs from "@emailjs/browser";
import { ViewContext } from "@/components/Layout";
import ContactModalStatus from "./ContactModal/ContactModalStatus";
import ContactFormFields from "./ContactModal/ContactFormFields";
import { useModalLifecycle } from "@/hooks/useModalLifecycle";

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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-opacity duration-300 ease-out ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className={`relative max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white border border-black ${
          isClosing
            ? "animate-tv-close"
            : isOpen
            ? "animate-tv-open"
            : "scale-y-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-md transition-[transform,box-shadow] duration-200 active:translate-y-0.5 active:shadow-sm"
          aria-label="モーダルを閉じる"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="p-8 md:p-12">
          <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
            お問い合わせ
          </h2>

          <ContactModalStatus submitStatus={submitStatus} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <ContactFormFields
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />

            {/* 送信ボタン */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="group flex-1 rounded-full border-2 border-black bg-white px-6 py-3 text-sm font-bold text-black shadow-md transition-[border-color,transform,box-shadow,background-color] duration-300 hover:scale-105 hover:border-neutral-500 hover:bg-neutral-50 hover:shadow-lg active:scale-[1.02] active:shadow-sm md:text-base"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
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

