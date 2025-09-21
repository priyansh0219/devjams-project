import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../providers/AuthProvider";

const HomePage = () => {
  const { signIn, loading, session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='flex items-center py-8'>
      {!loading ? (
        session ? (
          <button
            className='py-2 px-4 bg-green-500 rounded-md mx-auto cursor-pointer text-white font-medium'
            onClick={() => navigate({ to: "/myclubs" })}
          >
            Go to my clubs
          </button>
        ) : (
          <button
            className='py-2 px-4 bg-blue-500 rounded-md mx-auto cursor-pointer text-white font-medium'
            onClick={() => signIn()}
          >
            Sign In with Google
          </button>
        )
      ) : (
        <button className='py-2 px-4 bg-red-500 rounded-md mx-auto text-white font-medium'>
          Loading...
        </button>
      )}
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

// export default HomePage;
