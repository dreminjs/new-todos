import { useParams } from "react-router";
import { useGetWorkspaceInfo } from "../..";
import styles from "./WorkspaceHeader.module.css";
import { WorkspaceInfo } from "./WorkspaceInfo";
import { WorkspaceNavigation } from "./WorkspaceNavigation/WorkspaceNavigation";
import { Skeleton } from "@chakra-ui/react";
import { WorkspaceSettingsButton } from "./WorkspaceSettings/WorkspaceSettingsButton";

export const WorkspaceHeader = () => {
  const { workspaceId } = useParams();

  const {
    data: workspaceInfo,
    isPending,
    isError,
  } = useGetWorkspaceInfo(workspaceId);

  if (isPending) return <Skeleton width={"100%"} height={50} />;

  if (isError) return <div>Error</div>;

  return (
    <header className={styles.workspaceHeader}>
      <WorkspaceInfo
        title={workspaceInfo.title}
        description={workspaceInfo.description}
        todo={workspaceInfo.todo}
        countOfMembers={workspaceInfo.countOfMembers}
      />
      <>
        <WorkspaceNavigation countOfMembers={workspaceInfo.countOfMembers} />

      </>
    </header>
  );
};
