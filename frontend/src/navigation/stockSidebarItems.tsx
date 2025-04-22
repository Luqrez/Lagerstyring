import type { SidebarItem } from "../components/Types"; 

export const stockSidebarItems: SidebarItem[] = [
  {
    to: "/stock/varer",
    label: "Varer",
    icon:
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />
    </span>,
    notificationCount: 1,
  },
  {
    to: "/stock/kategorier",
    label: "Kategorier",
    icon:
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />
    </span>,
    notificationCount: 69,
  },
];