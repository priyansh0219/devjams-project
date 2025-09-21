import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import { useAuth } from "../../providers/AuthProvider";
import { useWallet } from "../../providers/WalletProvider";
import { useEffect } from "react";

interface Club {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // Add other club properties as needed
}

interface ClubMembership {
  club: Club;
  role: string;
  joinedAt: string;
}

interface MyClubsResponse {
  clubs: ClubMembership[];
  total: number;
}

const MyClubs = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const clubsClient = new APIClient<MyClubsResponse>("my-clubs", {
    withCredentials: true,
  });

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-clubs"],
    queryFn: () => clubsClient.get(),
  });

  const clubs = response?.clubs || [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading your clubs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500 text-lg'>
          Error loading clubs:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  if (!clubs || clubs.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>My Clubs</h1>
          <button
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium cursor-pointer'
            onClick={signOut}
          >
            Sign Out here
          </button>
        </div>
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>
            You haven't joined any clubs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>My Clubs</h1>
        <button
          onClick={signOut}
          className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer'
        >
          Sign Out
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {clubs.map((membership) => (
          <div
            key={membership.club.id}
            onClick={() => navigate({ to: `/myclubs/${membership.club.name}` })}
            className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50'
          >
            <h2 className='text-xl font-semibold mb-3'>
              {membership.club.name}
            </h2>
            <p className='text-gray-600 mb-4'>{membership.club.description}</p>
            <div className='text-sm text-gray-500 mb-2'>
              Role:{" "}
              <span className='font-medium'>
                {membership.role
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
            <div className='text-sm text-gray-500'>
              Joined: {new Date(membership.joinedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/myclubs/")({
  component: MyClubs,
});
