
import type { ReactNode } from "react";

export interface SidebarItem {
  to: string;
  label: string;
  icon?: ReactNode;
  notificationCount?: number;
}
