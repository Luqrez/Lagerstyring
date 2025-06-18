import { NavLink } from "react-router-dom";
import "../styles/NavItem.css";

// Defines a standardized navigation menu item used across the warehouse management system
// Supports notification badges for real-time inventory alerts and status updates
interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  notificationCount?: number;
}

// Navigation component that highlights the user's current location in the system
// and displays urgent inventory notifications that require immediate attention
export function NavItem({ to, icon, label, notificationCount }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >
      <div className="nav-item-inner">
        <div className="nav-item-left">
          {icon && <span className="nav-icon">{icon}</span>}
          <span className="nav-label">{label}</span>
        </div>
        {typeof notificationCount === "number" && notificationCount > 0 && (
          <span className="nav-badge">{notificationCount}</span>
        )}
      </div>
    </NavLink>
  );
}