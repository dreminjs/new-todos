import { GlobalLoadingSpinner } from "../../../shared";
import { useGetMyWorkspaceInvitations } from "../api/queries";
import { WorkspaceInvitationHeader } from "../ui/WorkspaceInvitationHeader/WorkspaceInvitationHeader";
import { WorkspaceInvitationsList } from "../ui/WorkspaceInvitationsList/WorkspaceInvitationsList";

export const WorkspaceInvitationsPage = () => {
  const { data, isPending } = useGetMyWorkspaceInvitations();

  if (isPending && !data) {
    return <GlobalLoadingSpinner />;
  }

  return (
    <>
      <WorkspaceInvitationHeader count={data.length} />
      <WorkspaceInvitationsList invitations={data} />
    </>
  );
};
