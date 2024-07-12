import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
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
  console.log("debugs", loading);
  if(loading) {
    return <>Loading...</>;
  }
  console.log("debuge", loading);
  return (
    <>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
