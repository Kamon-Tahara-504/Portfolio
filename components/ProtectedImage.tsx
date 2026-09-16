"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";

export interface ProtectedImageProps extends ImageProps {
  /** ラッパー div に渡す className（例: absolute inset-0, relative） */
  wrapperClassName?: string;
}

/**
 * 右クリック保存・ドラッグ保存を抑止した next/image のラッパー。
 * 透明オーバーレイで画像への直接ヒットを防ぎ、contextmenu / drag を無効化する。
 */
export default function ProtectedImage({
  wrapperClassName = "relative",
  className,
  alt,
  ...imageProps
}: ProtectedImageProps) {
  return (
    <div
      // relative を常時付与すると absolute inset-0 と競合して fill 画像が消えるため付けない
      className={`select-none ${wrapperClassName}`.trim()}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <Image
        {...imageProps}
        alt={alt}
        draggable={false}
        className={`pointer-events-none ${className ?? ""}`.trim()}
      />
      {/* 画像の上に透明レイヤーを重ね、保存メニューの対象にならないようにする */}
      <span aria-hidden className="absolute inset-0 z-[1]" />
    </div>
  );
}
