import { createFileRoute, useNavigate } from "@tanstack/react-router";

const LoggedOut = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: "/",
    });
  };

  return (
    <>
      <p>You have successfully logged out.</p>
      <button
        className='mt-4 ml-2 py-2 px-4 bg-blue-500 rounded-md text-white font-medium cursor-pointer'
        onClick={handleClick}
      >
        Go Home
      </button>
    </>
  );
};

export const Route = createFileRoute("/LoggedOut/")({
  component: LoggedOut,
});
