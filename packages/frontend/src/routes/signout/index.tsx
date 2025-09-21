import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

export const Route = createFileRoute("/signout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return <div>Hello "/signout/"!</div>;
}
