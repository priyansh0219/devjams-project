import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const LoggedOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null; // Empty page while redirecting
};

export const Route = createFileRoute("/LoggedOut/")({
  component: LoggedOut,
});
