"use client";

import type React from "react";
import { usePortfolioView } from "@/components/page/PortfolioViewContext";
import { formInput, formLabel } from "@/lib/portfolioViewStyles";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export default function ContactFormFields({
  formData,
  errors,
  onChange,
}: {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  const { viewMode } = usePortfolioView();

  return (
    <>
      <div>
        <label htmlFor="name" className={formLabel(viewMode)}>
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={formInput(viewMode, Boolean(errors.name))}
          placeholder="お名前を入力してください"
        />
        {errors.name && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={formLabel(viewMode)}>
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={formInput(viewMode, Boolean(errors.email))}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className={formLabel(viewMode)}>
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          className={formInput(viewMode, Boolean(errors.subject))}
          placeholder="お問い合わせの件名を入力してください"
        />
        {errors.subject && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={formLabel(viewMode)}>
          メッセージ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={6}
          className={formInput(viewMode, Boolean(errors.message))}
          placeholder="お問い合わせ内容を入力してください（10文字以上）"
        />
        {errors.message && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">{errors.message}</p>
        )}
      </div>
    </>
  );
}
