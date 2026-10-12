import { useState, type FC } from "react";
import {
  IoCall,
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
} from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { useCall } from "../../model/hooks/useCall";
import { VideoTile } from "./VideoTile";
import styles from "./CallRoom.module.css";

export interface CallRoomProps {
  callId: string;
  chatId?: string;
  workspaceId?: string;
  className?: string;
  onLeave?: () => void;
}

export const CallRoom: FC<CallRoomProps> = ({
  callId,
  chatId,
  workspaceId,
  className,
  onLeave,
}) => {
  const {
    localStream,
    remoteParticipants,
    isConnected,
    error,
    join,
    leave,
    toggleMic,
    toggleCamera,
  } = useCall(callId, { chatId, workspaceId });

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleToggleMic = () => {
    toggleMic();
    setIsMicMuted((prev) => !prev);
  };

  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOff((prev) => !prev);
  };

  const handleLeave = () => {
    leave();
    onLeave?.();
  };

  if (error) {
    return (
      <div className={`${styles.container} ${className ?? ""}`}>
        <div className={styles.errorContainer}>
          <div className={styles.errorTitle}>Ошибка звонка</div>
          <div className={styles.errorMessage}>{error.message}</div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnRetry}`}
            onClick={join}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const totalTiles = (localStream ? 1 : 0) + remoteParticipants.length;
  const gridLayoutClass =
    totalTiles <= 1
      ? styles.grid1
      : totalTiles === 2
        ? styles.grid2
        : styles.gridMany;

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {isConnected && remoteParticipants.length === 0 && (
        <div className={styles.waitingBadge}>
          Ожидание других участников...
        </div>
      )}

      <div className={`${styles.grid} ${gridLayoutClass}`}>
        {localStream && (
          <VideoTile
            stream={localStream}
            muted
            label="Вы"
            isLocal
          />
        )}
        {remoteParticipants.map((p) => (
          <VideoTile key={p.socketId} stream={p.stream} label={p.socketId} />
        ))}
      </div>

      <div className={styles.controlsBar}>
        {!isConnected ? (
          <button
            type="button"
            onClick={join}
            className={`${styles.btn} ${styles.btnJoin}`}
          >
            <IoCall size={20} />
            <span>Присоединиться к звонку</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleToggleMic}
              className={`${styles.btn} ${styles.btnAction} ${isMicMuted ? styles.btnOff : ""
                }`}
              title={isMicMuted ? "Включить микрофон" : "Выключить микрофон"}
            >
              {isMicMuted ? <IoMicOff /> : <IoMic />}
            </button>

            <button
              type="button"
              onClick={handleToggleCamera}
              className={`${styles.btn} ${styles.btnAction} ${isCameraOff ? styles.btnOff : ""
                }`}
              title={isCameraOff ? "Включить камеру" : "Выключить камеру"}
            >
              {isCameraOff ? <IoVideocamOff /> : <IoVideocam />}
            </button>

            <button
              type="button"
              onClick={handleLeave}
              className={`${styles.btn} ${styles.btnLeave}`}
              title="Завершить звонок"
            >
              <MdCallEnd />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
