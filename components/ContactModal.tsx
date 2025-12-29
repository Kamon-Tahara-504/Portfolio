"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // 背景のスクロールを防ぐ（htmlとbodyの両方に適用）
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Email送信エラー:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 touch-none"
      onClick={onClose}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-black bg-white text-black transition-colors hover:bg-black/5"
          aria-label="モーダルを閉じる"
        >
          <span className="text-2xl">×</span>
        </button>

        {/* コンテンツ */}
        <div className="p-8 md:p-12">
          <h2 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
            お問い合わせ
          </h2>

          {submitStatus === "success" ? (
            <div className="space-y-4">
              <div className="rounded-md border border-green-500 bg-green-50 p-4 text-green-800">
                <p className="font-medium">送信が完了しました！</p>
                <p className="mt-2 text-sm">
                  お問い合わせありがとうございます。できるだけ早くご返信いたします。
                </p>
              </div>
            </div>
          ) : submitStatus === "error" ? (
            <div className="mb-6 rounded-md border border-red-500 bg-red-50 p-4 text-red-800">
              <p className="font-medium">送信に失敗しました</p>
              <p className="mt-2 text-sm">
                しばらく時間をおいて再度お試しください。問題が続く場合は、直接メールでご連絡ください。
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 名前 */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-black"
              >
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.name ? "border-red-500" : "border-black"
                }`}
                placeholder="お名前を入力してください"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-black"
              >
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.email ? "border-red-500" : "border-black"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* 件名 */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-black"
              >
                件名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.subject ? "border-red-500" : "border-black"
                }`}
                placeholder="お問い合わせの件名を入力してください"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            {/* メッセージ */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-black"
              >
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black resize-none ${
                  errors.message ? "border-red-500" : "border-black"
                }`}
                placeholder="お問い合わせ内容を入力してください（10文字以上）"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-black bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5 md:text-base"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
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

