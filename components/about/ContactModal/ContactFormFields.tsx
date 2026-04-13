"use client";

import type React from "react";

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
  return (
    <>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-zinc-200 sm:text-base"
        >
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={`w-full rounded-md border bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 sm:text-base ${
            errors.name ? "border-red-500" : "border-zinc-300/30"
          }`}
          placeholder="お名前を入力してください"
        />
        {errors.name && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-zinc-200 sm:text-base"
        >
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`w-full rounded-md border bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 sm:text-base ${
            errors.email ? "border-red-500" : "border-zinc-300/30"
          }`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-semibold text-zinc-200 sm:text-base"
        >
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          className={`w-full rounded-md border bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 sm:text-base ${
            errors.subject ? "border-red-500" : "border-zinc-300/30"
          }`}
          placeholder="お問い合わせの件名を入力してください"
        />
        {errors.subject && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-zinc-200 sm:text-base"
        >
          メッセージ <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={6}
          className={`w-full resize-none rounded-md border bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 sm:text-base ${
            errors.message ? "border-red-500" : "border-zinc-300/30"
          }`}
          placeholder="お問い合わせ内容を入力してください（10文字以上）"
        />
        {errors.message && (
          <p className="mt-1 text-xs font-semibold text-red-500 sm:text-sm">
            {errors.message}
          </p>
        )}
      </div>
    </>
  );
}

