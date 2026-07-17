import { useNavigate } from "react-router";
import styles from "./WorkspaceHeader.module.css";
import { LuArrowLeft } from "react-icons/lu";
import type { TWorkspaceInfo } from "types";
import type { FC } from "react";
import { WorkspaceSettingsButton } from "./WorkspaceSettings/WorkspaceSettingsButton";

type TWorkspaceInfoProps = TWorkspaceInfo;

export const WorkspaceInfo: FC<TWorkspaceInfoProps> = ({
  title,
  description,
  todo,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.workspaceHeaderInfo}>
      <button
        onClick={() => navigate(-1)}
        className={styles.workspaceHeaderBackButton}
      >
        <LuArrowLeft />
        <span>Back</span>
      </button>
      <div className={styles.workspaceHeaderInfoInner}>
        <div>
          <h3 className={styles.workspaceHeaderInfoTitle}>{title}</h3>
          <h6 className={styles.workspaceHeaderInfoDescription}>
            {description}
          </h6>
        </div>
        <div className={styles.workspaceHeaderInfoInnerRight}>
          <h6>
            {
              <span>
                {`${todo.countOfCompletedTodos} / ${todo.countAllTodos} Tasks Completed`}
              </span>
            }
          </h6>
          <WorkspaceSettingsButton />
        </div>
      </div>
    </div>
  );
};
