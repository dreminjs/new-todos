import { useGetTodoGroups } from "../../../modules/todo-groups";
import styles from "./Sidebar.module.css";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const GroupTodosList = () => {
  const { data } = useGetTodoGroups();

  if (!data?.length) {
    return null;
  }

  return (
    <div>
      <h3 className={styles.sidebarMenuTitle}>
        <span>my groups todos</span>
        <button>+</button>
      </h3>
      <ul>
        {data.map((el) => (
          <SidebarMenuItem label={el.name} />
        ))}
      </ul>
    </div>
  );
};
