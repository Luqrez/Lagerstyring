import { NavItem } from "./NavItem";
import type { SidebarItem } from "./Types";
import '../styles/Leftside.css';

// Primary navigation menu for warehouse staff to access different operational areas
// Includes real-time notification system for inventory alerts and task management
interface SidebarProps {
  items: SidebarItem[];
}

// Main navigation hub that connects warehouse personnel to key management modules:
// - Inventory tracking
// - Stock alerts
// - Order processing
// - Location management
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