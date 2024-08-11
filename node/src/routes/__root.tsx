import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth } from "@/auth";

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const { loading } = useAuth();
  if (loading) {
    return <>Loading...</>;
  }
  return (
    <>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
