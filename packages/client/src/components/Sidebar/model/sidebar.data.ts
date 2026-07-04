import SunIcon from "../../../assets/SunIcon.svg?react";
import StarIcon from "../../../assets/ImportantIcon.svg?react";
import PlannedIcon from "../../../assets/Calendar.svg?react";
import AssignedMeIcon from "../../../assets/AssignedMeIcon.svg?react";
import AllTasksIcon from "../../../assets/AllTasksIcon.svg?react";
import ProfileIcon from "../../../assets/ProfileIcon.svg?react";
import LogoutIcon from "../../../assets/LogoutIcon.svg?react";

export const sidebarMenuData = [
  {
    icon: SunIcon,
    label: "My day",
    to: "/todos/my-day",
  },
  {
    icon: StarIcon,
    label: "Important",
    to: "/todos/important",
  },
  {
    icon: PlannedIcon,
    label: "Planned",
    to: "/todos/planned",
  },
  {
    icon: AssignedMeIcon,
    label: "Assigned to me",
    to: "/todos/assigned-to-me",
  },
  {
    icon: AllTasksIcon,
    label: "All tasks",
    to: "/todos/all",
  },
] as const;

export const sidebarMenuBottomData = [
  {
    label: "Profile",
    icon: ProfileIcon,
  },
  {
    label: "Logout",
    icon: LogoutIcon,
  },
];
