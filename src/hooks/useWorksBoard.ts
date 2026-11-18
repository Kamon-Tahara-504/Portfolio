import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from "react";

type Pan = { x: number; y: number };

const DRAG_THRESHOLD_PX = 6;
export const BOARD_MOTION_MS = 700;
const SETTLE_MS = BOARD_MOTION_MS;

/**
 * 展開した作品の板を、枠の中でドラッグ、または横スクロールする。
 * 指の移動と同じだけ動かし、枠より外には出さない。
 * 少し動かしたあとのクリックは、カードを開く操作として扱わない。
 */
export function useWorksBoard(enabled: boolean) {
  const stageRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<Pan>({ x: 0, y: 0 });
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const userMoved = useRef(false);
  const settling = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const [dragging, setDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);

  const clamp = useCallback((x: number, y: number): Pan => {
    const stage = stageRef.current;
    const board = boardRef.current;
    if (!stage || !board) return { x: 0, y: 0 };
    const minX = Math.min(0, stage.clientWidth - (board.offsetLeft + board.offsetWidth));
    const minY = Math.min(0, stage.clientHeight - board.offsetHeight);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  }, []);

  const applyPan = useCallback((next: Pan) => {
    panRef.current = next;
    const board = boardRef.current;
    if (board) board.style.transform = `translate(${next.x}px, ${next.y}px)`;
  }, []);

  const reset = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
    const board = boardRef.current;
    if (board) board.style.transition = "";
    applyPan({ x: 0, y: 0 });
  }, [applyPan]);

  // 閉じるときは、ドラッグで動いた位置から元の左端まで戻してから終わらせる
  const settle = useCallback(() => {
    return new Promise<void>((resolve) => {
      dragRef.current = null;
      setDragging(false);
      settling.current = true;
      const board = boardRef.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const distance = Math.hypot(panRef.current.x, panRef.current.y);
      // 動いていなくても、右の列のフェードが終わるまでは枠を残す
      const ms = reduced ? 0 : SETTLE_MS;
      if (board && !reduced && distance >= 1) {
        board.style.transition = `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        applyPan({ x: 0, y: 0 });
      } else if (board) {
        board.style.transition = "";
        applyPan({ x: 0, y: 0 });
      }
      window.setTimeout(() => {
        if (board) board.style.transition = "";
        settling.current = false;
        userMoved.current = false;
        resolve();
      }, ms);
    });
  }, [applyPan]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      // 展開中の広い幅を覚えると、閉じた瞬間にその幅でカードが広がる
      if (enabledRef.current) return;
      setStageWidth(stage.clientWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // 開いた直後は今のカードを動かさない。右の列だけを足す
  useLayoutEffect(() => {
    if (!enabled) {
      userMoved.current = false;
      settling.current = false;
      return;
    }
    if (settling.current) return;
    if (!userMoved.current) {
      applyPan({ x: 0, y: 0 });
      return;
    }
    applyPan(clamp(panRef.current.x, panRef.current.y));
  }, [enabled, stageWidth, applyPan, clamp]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;
    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const horizontal = event.shiftKey || absX > absY;
      if (!horizontal) return;
      const delta = absX > 0 ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();
      userMoved.current = true;
      applyPan(clamp(panRef.current.x - delta, panRef.current.y));
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [enabled, applyPan, clamp]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("[data-board-toggle]")) return;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      drag.moved = true;
      userMoved.current = true;
      setDragging(true);
      // ドラッグ中は、開いたときの移動アニメーションを止める
      const board = boardRef.current;
      if (board) board.style.transition = "none";
      // 合成イベントではポインタを掴めないことがある
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // 掴めなくても、枠の中にいるあいだは move が届く
      }
    }
    applyPan(clamp(drag.originX + dx, drag.originY + dy));
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) {
      suppressClick.current = true;
      // click は pointerup の直後に来る。来なかったときは次のフレームで捨てる
      requestAnimationFrame(() => {
        suppressClick.current = false;
      });
    }
    dragRef.current = null;
    setDragging(false);
    const board = boardRef.current;
    if (board) board.style.transition = "";
  };

  const onClickCapture = (event: MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onFocusCapture = (event: FocusEvent) => {
    if (!enabled) return;
    const stage = stageRef.current;
    const board = boardRef.current;
    const target = event.target as HTMLElement;
    if (!stage || !board || !board.contains(target)) return;
    const stageRect = stage.getBoundingClientRect();
    const cardRect = target.getBoundingClientRect();
    let { x, y } = panRef.current;
    if (cardRect.left < stageRect.left) x += stageRect.left - cardRect.left;
    else if (cardRect.right > stageRect.right) x -= cardRect.right - stageRect.right;
    if (cardRect.top < stageRect.top) y += stageRect.top - cardRect.top;
    else if (cardRect.bottom > stageRect.bottom) y -= cardRect.bottom - stageRect.bottom;
    if (x === panRef.current.x && y === panRef.current.y) return;
    applyPan(clamp(x, y));
  };

  return {
    stageRef,
    boardRef,
    dragging,
    stageWidth,
    reset,
    settle,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
      onFocusCapture,
    },
  };
}
