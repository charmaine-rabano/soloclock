// Central definition of the app's URL routes. Import from here instead of
// hardcoding path strings, so a route rename is a single-line change.
export const ROUTES = {
  login: "/login",
  signup: "/signup",

  dashboard: "/dashboard",
  timesheet: "/timesheet",
  clients: "/clients",
  projects: "/projects",
  invoices: "/invoices",
  reports: "/reports",
  account: "/account",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type Route = (typeof ROUTES)[RouteKey];

export const clientPath = (id: string) => `${ROUTES.clients}/${id}`;
export const projectPath = (id: string) => `${ROUTES.projects}/${id}`;
