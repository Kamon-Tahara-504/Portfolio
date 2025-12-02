import { useEffect, useRef } from "react";

const BRIGHTNESS_THRESHOLD = 128;

interface UseVideoColorDetectionOptions {
  videoElement: HTMLVideoElement | null;
  onColorDetected: (isDark: boolean) => void;
  enabled?: boolean;
}

export function useVideoColorDetection({
  videoElement,
  onColorDetected,
  enabled = true,
}: UseVideoColorDetectionOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 映像の色を検出する関数
  const detectVideoColor = () => {
    const video = videoElement;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !enabled) return;
    
    // video要素が有効な状態か確認
    // readyState: 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA
    if (video.readyState < 2) return;
    
    // video要素のサイズが有効か確認
    if (!video.videoWidth || !video.videoHeight || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Canvasのサイズを映像のサイズに合わせる（パフォーマンスのため縮小）
      const aspectRatio = video.videoHeight / video.videoWidth;
      canvas.width = 100;
      canvas.height = 100 * aspectRatio;

      // 映像フレームをCanvasに描画（再度状態確認）
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        return;
      }

      // ピクセルデータを取得
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 平均明度を計算
      let totalBrightness = 0;
      let pixelCount = 0;

      // サンプリング（全ピクセルではなく、間引いて計算）
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // RGBから明度を計算（0.299*R + 0.587*G + 0.114*B）
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;
        pixelCount++;
      }

      const averageBrightness = totalBrightness / pixelCount;
      onColorDetected(averageBrightness < BRIGHTNESS_THRESHOLD);
    } catch (error) {
      // エラーが発生した場合は無視（CORSなど）
      console.error("Video color detection error:", error);
    }
  };

  // 映像の色を定期的に検出（0.5秒ごと）
  useEffect(() => {
    const video = videoElement;
    if (!video || !enabled) return;

    const interval = setInterval(() => {
      detectVideoColor();
    }, 500); // 0.5秒ごとに検出

    // 映像が再生可能になった時にも検出
    const handleLoadedData = () => {
      detectVideoColor();
    };

    const handleTimeUpdate = () => {
      detectVideoColor();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      clearInterval(interval);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoElement, enabled]);

  return { canvasRef };
}

