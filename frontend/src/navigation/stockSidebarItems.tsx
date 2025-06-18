import type { SidebarItem } from "../components/Types"; 

// Definerer sidebarens navigationspunkter, så medarbejdere hurtigt kan tilgå centrale funktioner relateret til lagerstyring.
export const stockSidebarItems: SidebarItem[] = [
  {
    to: "/stock/varer",
    label: "Varer",
    // Link til oversigt over alle lagerførte varer, så medarbejdere nemt kan administrere og overvåge beholdningen.
    icon:
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />
      </span>,
    // Angiver antal nye hændelser eller opdateringer relateret til varer, hvilket hurtigt giver overblik over aktivitet på lageret.
    notificationCount: 1,
  },
  {
    to: "/stock/kategorier",
    label: "Kategorier",
    // Link til administration af produktkategorier, så medarbejderne let kan organisere og strukturere lagerbeholdningen.
    icon:
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }} />
      </span>,
    // Antallet af opdateringer i kategorier, som giver medarbejderne en tydelig indikator for eventuelle ændringer eller nye elementer.
    notificationCount: 69,
  },
];
