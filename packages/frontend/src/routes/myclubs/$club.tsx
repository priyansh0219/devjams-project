import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";

interface Club {
  club_name: string;
  description: string;
  admins: {
    name: string;
    email: string;
  }[];
}

function clubPage() {
  const { club } = useParams({ from: "/myclubs/$club" });
  const navigate = useNavigate();
  let _club = club;
  // _club = club.toUpperCase();

  const clubClient = new APIClient<Club>(`/club/${_club}`, {
    withCredentials: true,
  });

  const {
    data: clubData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["club", club],
    queryFn: clubClient.get,
  });

  if (isLoading) {
    return <div>Loading club data...</div>;
  }

  if (error) {
    return <div>Error loading club: {error.message}</div>;
  }

  if (!clubData) {
    return <div>Club not found</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>
        {clubData.club_name}
      </h1>

      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-semibold text-gray-700 mb-3'>
          Description
        </h2>
        <p className='text-gray-600 leading-relaxed'>{clubData.description}</p>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-700 mb-4'>Admins</h2>
        {clubData.admins && clubData.admins.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {clubData.admins.map((admin, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4'
              >
                <h3 className='font-medium text-gray-800'>{admin.name}</h3>
                <p className='text-sm text-gray-600'>{admin.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 italic'>No admins listed</p>
        )}
      </div>

      <div className='mt-8 flex flex-wrap gap-4 justify-center'>
        <button
          onClick={() => navigate({ to: `/myclubs/${club}/ledger` })}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
        >
          View Ledger
        </button>
        <button
          onClick={() => navigate({ to: `/myclubs/${club}/transactions` })}
          className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
        >
          Log Transactions
        </button>
        <button
          onClick={() => navigate({ to: `/myclubs/${club}/members` })}
          className='bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
        >
          Manage Members
        </button>
        <button
          onClick={() => navigate({ to: `/myclubs/${club}/settings` })}
          className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
        >
          Club Settings
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/myclubs/$club")({
  component: clubPage,
});
