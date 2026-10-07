import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },

    // Always let the homepage control its own starting position.
    scrollRestoration: false,
    scrollRestorationBehavior: "instant",

    defaultPreloadStaleTime: 0,
  });

  return router;
};
