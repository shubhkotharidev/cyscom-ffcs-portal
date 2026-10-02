export const BRAND = "CYSCOM";
export const SUBTITLE = "FFCS Portal";

export const DEPARTMENTS = [
  { id: "webdev",   name: "Web Dev",          glyph: "</>", icon: "/webdev.png",  desc: "Build and ship the club's sites, portals, and internal tools." },
  { id: "tech",     name: "Tech",             glyph: "{}",  icon: "/tech.png",    desc: "CTF infra, bots, and the technical backbone behind the events." },
  { id: "design",   name: "Design",           glyph: "◈",   icon: "/design.png",  desc: "Brand system, posters, and visual identity across every touchpoint." },
  { id: "social",   name: "Social Media",     glyph: "@",   icon: "/social.png",  desc: "Campaigns, content calendars, and community growth online." },
  { id: "events",   name: "Event Management", glyph: "▣",   icon: "/events.png",  desc: "Logistics, run-sheets, and on-ground execution for events." },
  { id: "outreach", name: "Outreach",         glyph: "⚑",   icon: "/outreach.png", desc: "Sponsorships, external relations, and expanding the club's footprint." },
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
