import { WorkspaceInfo } from "./WorkspaceInfo";
import { WorkspaceNavigation } from "./WorkspaceNavigation/WorkspaceNavigation";
import { Skeleton } from "@chakra-ui/react";
import { useCurrentWorkspace } from "../../model/hooks/useCurrentWorkspace";
import styles from "./WorkspaceHeader.module.css";

export const WorkspaceHeader = () => {
  const { workspaceInfo, isPending, isError } = useCurrentWorkspace();

  if (isPending) return <Skeleton width={"100%"} height={50} />;

  if (isError) return <div>Error</div>;

  return (
    <header className={styles.workspaceHeader}>
      <WorkspaceInfo
        name={workspaceInfo.name}
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
