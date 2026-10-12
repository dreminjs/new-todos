import { useEffect, useRef, useState, type FC } from "react";
import { IoPerson } from "react-icons/io5";
import styles from "./CallRoom.module.css";

export interface VideoTileProps {
  stream: MediaStream;
  muted?: boolean;
  label: string;
  isLocal?: boolean;
}

export const VideoTile: FC<VideoTileProps> = ({
  stream,
  muted = false,
  label,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const checkVideoTrack = () => {
      const videoTracks = stream.getVideoTracks();
      const isEnabled = videoTracks.length > 0 && videoTracks.some((t) => t.enabled);
      setHasVideo(isEnabled);
    };

    checkVideoTrack();

    const handleTrackChange = () => {
      checkVideoTrack();
    };

    stream.addEventListener("addtrack", handleTrackChange);
    stream.addEventListener("removetrack", handleTrackChange);

    const tracks = stream.getVideoTracks();
    tracks.forEach((track) => {
      track.addEventListener("mute", handleTrackChange);
      track.addEventListener("unmute", handleTrackChange);
      track.addEventListener("ended", handleTrackChange);
    });

    return () => {
      stream.removeEventListener("addtrack", handleTrackChange);
      stream.removeEventListener("removetrack", handleTrackChange);
      tracks.forEach((track) => {
        track.removeEventListener("mute", handleTrackChange);
        track.removeEventListener("unmute", handleTrackChange);
        track.removeEventListener("ended", handleTrackChange);
      });
    };
  }, [stream]);

  return (
    <div className={styles.tile}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`${styles.video} ${isLocal ? styles.localVideo : ""} ${!hasVideo ? styles.hidden : ""
          }`}
        style={{ display: hasVideo ? "block" : "none" }}
      />

      {!hasVideo && (
        <div className={styles.avatarFallback}>
          <div className={styles.avatarCircle}>
            <IoPerson />
          </div>
          <span className={styles.avatarText}>{label}</span>
        </div>
      )}

      <span className={styles.badge}>
        <span className={styles.liveDot} />
        {label}
      </span>
    </div>
  );
};
