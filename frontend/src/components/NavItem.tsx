import { NavLink } from "react-router-dom";
import "../styles/NavItem.css"; // keep your existing styles

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  notificationCount?: number;
}

export function NavItem({ to, icon, label, notificationCount }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}` // use your own CSS class + active class
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
