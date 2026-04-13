"use client";

export default function ContactModalStatus({
  submitStatus,
}: {
  submitStatus: "success" | "error" | null;
}) {
  if (submitStatus === "success") {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-200">
          <p className="font-semibold">送信が完了しました！</p>
          <p className="mt-2 text-sm font-medium">
            お問い合わせありがとうございます。できるだけ早くご返信いたします。
          </p>
        </div>
      </div>
    );
  }

  if (submitStatus === "error") {
    return (
      <div className="mb-6 rounded-md border border-red-400/40 bg-red-500/10 p-4 text-red-200">
        <p className="font-semibold">送信に失敗しました</p>
        <p className="mt-2 text-sm font-medium">
          しばらく時間をおいて再度お試しください。問題が続く場合は、直接メールでご連絡ください。
        </p>
      </div>
    );
  }

  return null;
}

