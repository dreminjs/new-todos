import {
  useGetParticipantsByWorkspaceId,
  usePatchTransferOwnership,
} from "../../api/queries";
import type { FC } from "react";
import { WorkspaceMembersListItem } from "./WorkspaceMembersListItem";
import styles from "./WorkspaceMembers.module.css";
import { useCurrentWorkspace } from "../../model/hooks/useCurrentWorkspace";
import { useGetMe } from "../../../users";
import { useKickParticipant } from "../../api/queries";
import { GlobalLoadingSpinner } from "../../../../shared";
interface IWorkspaceMembersListProps {
  workspaceId: string;
}

export const WorkspaceMembersList: FC<IWorkspaceMembersListProps> = ({
  workspaceId,
}) => {
  const { data, isPending, isError } =
    useGetParticipantsByWorkspaceId(workspaceId);
  const { workspaceInfo } = useCurrentWorkspace();
  const { data: me } = useGetMe();
  const { mutate: kickParticipant } = useKickParticipant(workspaceId);
  const { mutate: patchTransferOwnership } =
    usePatchTransferOwnership(workspaceId);

  if (isPending) return <GlobalLoadingSpinner />;

  if (!data && isError) return <h3>error...</h3>;

  return (
    <>
      <h3 className={styles.workspaceMembersListTitle}>Members List</h3>
      <ul className={styles.workspaceMembersList}>
        {data?.map((el) => (
          <WorkspaceMembersListItem
            key={el.id}
            user={el.user}
            role={el.role}
            id={el.id}
            idDropdownShown={
              me.id !== el.user.id && workspaceInfo.role === "OWNER"
            }
            onKickUser={kickParticipant}
            onTransferOwnership={patchTransferOwnership}
          />
        ))}
      </ul>
    </>
  );
};
