// Sidebar.tsx
import { NavItem } from "./NavItem";
import type { SidebarItem } from "./Types";
import '../styles/Leftside.css';

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {items.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          notificationCount={item.notificationCount}
        />
      ))}
    </div>
  );
}
