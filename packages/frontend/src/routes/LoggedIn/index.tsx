import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";

const LoggedIn = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate({ to: "/wallet" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, navigate, loading]);

  return null; // Empty page while redirecting
};

export const Route = createFileRoute("/LoggedIn/")({
  component: LoggedIn,
});
