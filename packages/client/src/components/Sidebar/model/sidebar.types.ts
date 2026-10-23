import type { FC, SVGProps } from "react";

export interface ISidebarItem {
  icon: FC<SVGProps<SVGSVGElement>>
  label: string
  to?: string
  type?: "link" | "button"
}
