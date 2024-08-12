import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChakraProvider } from "@chakra-ui/react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "./auth.tsx";

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
    AuthProvider,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ChakraProvider>
        <AuthProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
          >
            <InnerApp />
          </GoogleOAuthProvider>
        </AuthProvider>
      </ChakraProvider>
    </StrictMode>
  );
}
