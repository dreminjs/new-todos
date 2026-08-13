import type { FC } from "react";
import styles from "./TodoKanbanBoard.module.css";
import { createPortal } from "react-dom";

interface RemoteDraggingGhostProps {
  title: string;
  originRect: DOMRect;
  x: number;
  y: number;
}

export const RemoteDraggingGhost: FC<RemoteDraggingGhostProps> = ({
  title,
  originRect,
  x,
  y,
}) => {
  return createPortal(
    <div
      className={styles.RemoteDraggingGhost}
      style={{
        position: "fixed",
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 50ms linear",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {title}
    </div>,
    document.body,
  );
};
