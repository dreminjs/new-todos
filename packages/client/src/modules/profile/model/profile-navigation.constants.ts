import type { INavigationItem } from "./types/navigation.types";

export const PROFILE_NAVIGATION_ITEMS: INavigationItem[] = [
  {
    to: "/profile",
    label: "General Profile",
  },
  {
    to: "/profile/security",
    label: "Security & Auth",
  },
];
