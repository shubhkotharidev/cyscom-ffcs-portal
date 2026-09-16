export const BRAND = "Cyscom";
export const SUBTITLE = "FFCS Portal";

export const DEPARTMENTS = [
  { id: "webdev", name: "Web Dev", glyph: "</>", desc: "Build and ship the club's sites, portals, and internal tools." },
  { id: "tech", name: "Tech", glyph: "{}", desc: "CTF infra, bots, and the technical backbone behind every event." },
  { id: "design", name: "Design", glyph: "◈", desc: "Brand system, posters, and visual identity across every touchpoint." },
  { id: "social", name: "Social Media", glyph: "@", desc: "Campaigns, content calendars, and community growth online." },
  { id: "events", name: "Event Management", glyph: "▣", desc: "Logistics, run-sheets, and on-ground execution for every event." },
];

export const SUPER_ADMIN_EMAILS = ["admin@vitstudent.ac.in", "root@vitstudent.ac.in"];
export const ADMIN_EMAILS = ["staff@vitstudent.ac.in"];

export const SEED_PROJECTS = [];
export const SEED_USERS = [];
export const SEED_PENDING = [];

export function deptName(id) {
  const d = DEPARTMENTS.find((d) => d.id === id);
  return d ? d.name : id;
}
