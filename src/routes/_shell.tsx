import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { AppShell } from "@/components/predict/app-shell";
import { navGroups } from "@/components/predict/nav-items";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title =
    navGroups.flatMap((g) => g.items).find((i) => i.to === pathname)?.label ?? "Predict360";

  return (
    <AppShell title={title}>
      <Outlet />
    </AppShell>
  );
}
