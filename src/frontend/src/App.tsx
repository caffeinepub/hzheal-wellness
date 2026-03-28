import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import EternalBuilderAdmin from "./pages/EternalBuilderAdmin";
import EternalBuilderLanding from "./pages/EternalBuilderLanding";
import EternalBuilderWorkspace from "./pages/EternalBuilderWorkspace";

// Legacy type exports used by old pages still in source tree
export type Page = string;
export type Route = string;

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: EternalBuilderLanding,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: EternalBuilderAdmin,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace",
  component: EternalBuilderWorkspace,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  adminRoute,
  workspaceRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
