"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";

export interface ProtectedImageProps extends ImageProps {
  /** ラッパー div に渡す className（例: absolute inset-0, relative） */
  wrapperClassName?: string;
}

/**
 * 右クリック保存・ドラッグ保存・範囲選択を抑止した next/image のラッパー。
 * 画像を包む div で contextmenu を無効化し、user-select: none と draggable={false} を適用する。
 */
export default function ProtectedImage({
  wrapperClassName = "relative",
  ...imageProps
}: ProtectedImageProps) {
  return (
    <div
      className={`select-none ${wrapperClassName}`.trim()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image {...imageProps} draggable={false} />
    </div>
  );
}
