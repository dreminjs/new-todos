
import styles from './WorkspaceInvitation.module.css';
import { WorkspaceInvitationForm } from './WorkspaceInvitationForm';

export const WorkspaceInvitation = () => {
  return (
    <div className={styles.workspaceInvitation}>
      <h3 className={styles.workspaceInvitationTitle}>
        Invite Member
      </h3>
      <h4 className={styles.workspaceInvitationSubtitle}>
        The invitation will be sent by email
      </h4>
      <WorkspaceInvitationForm />
    </div>
  );
};
