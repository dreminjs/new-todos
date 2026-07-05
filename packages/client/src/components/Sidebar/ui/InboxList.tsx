import { CustomAccordion } from "../../../shared";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const InboxList = () => {
  return (
    <>
      <CustomAccordion
        defaultOpen={true}
        header={
          <h3 className={styles.sidebarMenuTitle}>
            <span>Inbox</span>
          </h3>
        }
      >
        <ul>
          <SidebarMenuItem
            label={"Workspace invitations"}
            to={`workspaces/invitations`}
          />
        </ul>
      </CustomAccordion>
    </>
  );
};
