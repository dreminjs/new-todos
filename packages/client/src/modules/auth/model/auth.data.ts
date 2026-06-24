import ManagmentIcon from "../../../assets/managment-Icon.svg?react";
import PeopleIcon from "../../../assets/people-Icon.svg?react";
import StarIcon from "../../../assets/star-Icon.svg?react";

export const infoItems = [
  {
    title: "Centralize your workflow",
    subtitle:
      "Bring all your tools, data, and communication into one unifiedhub.",
    icon: ManagmentIcon,
  },
  {
    title: "Manage tasks with precision",
    subtitle:
      "Assign, track, and complete work with clear ownership and deadlines.",
    icon: PeopleIcon,
  },
  {
    title: "Collaborate in real-time",
    subtitle: "Work seamlessly with your team, wherever they are in theworld.",
    icon: StarIcon,
  },
] as const;
