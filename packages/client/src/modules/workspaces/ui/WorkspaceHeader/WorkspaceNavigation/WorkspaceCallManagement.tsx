import { IoIosCall, IoIosCamera } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import styles from "./WorkspaceNavigation.module.css";

export const WorkspaceCallManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCall = location.pathname.includes("calls");
  const pathSegments = location.pathname.split("/");

  const workspaceId = pathSegments[2];
  const isChats = pathSegments[3] === "chats";
  const chatId = pathSegments[4];

  if (!isCall && (!isChats || !chatId)) {
    return null;
  }

  const handleStartCall = (video = false) => {
    if (isCall) {
      navigate(`/workspaces/${workspaceId}/chats/${chatId}`);
    } else {
      navigate(
        `/workspaces/${workspaceId}/chats/${chatId}/calls${video ? "?video=true" : ""}`
      );
    }
  };

  return (
    <ul className={styles.workspaceCallManagement}>
      {isCall ? (
        <li>
          <button
            type="button"
            className={`${styles.callButton} ${styles.callButtonActive}`}
            onClick={() => handleStartCall(false)}
            title="Завершить звонок"
          >
            <MdCallEnd size={30} />
          </button>
        </li>
      ) : (
        <>
          <li>
            <button
              type="button"
              className={styles.callButton}
              onClick={() => handleStartCall(false)}
              title="Начать звонок"
            >
              <IoIosCall size={30} />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.callButton}
              onClick={() => handleStartCall(true)}
              title="Начать видеозвонок"
            >
              <IoIosCamera size={30} />
            </button>
          </li>
        </>
      )}
    </ul>
  );
};
