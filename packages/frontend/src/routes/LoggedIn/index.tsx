import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";

const LoggedIn = () => {
  const { session, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate({ to: "/" });
      return;
    }
  }, [isAuthenticated, navigate, loading, session]);

  if (!isAuthenticated) {
    return null; // Prevent flash while redirecting
  }

  return (
    <div>
      <h1>Logged In - Session Data</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button
        className='mt-4 ml-2 py-2 px-4 bg-red-500 rounded-md font-medium text-white cursor-pointer'
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

export const Route = createFileRoute("/LoggedIn/")({
  component: LoggedIn,
});
