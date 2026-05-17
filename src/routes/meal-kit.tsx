import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/meal-kit")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});
