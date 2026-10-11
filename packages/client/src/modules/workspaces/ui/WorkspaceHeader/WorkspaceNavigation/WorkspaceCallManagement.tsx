import { IoIosCall, IoIosCamera } from "react-icons/io";
import styles from "./WorkspaceNavigation.module.css";
export const WorkspaceCallManagement = () => {
  return (
    <ul className={styles.workspaceCallManagement}>
      <li>
        <button>
          <IoIosCall size={32} />
        </button>
      </li>
      <li>
        <button>
          <IoIosCamera size={32} />
        </button>
      </li>
    </ul>
  );
};
