import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/api-client";
import { useAuth } from "../../providers/AuthProvider";
import { useWallet } from "../../providers/WalletProvider";
import { useEffect } from "react";

interface Club {
  slug: string;
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
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <div className='text-lg text-gray-700'>Loading your clubs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center max-w-md'>
          <div className='text-red-500 text-4xl mb-4'>⚠️</div>
          <div className='text-red-500 text-lg font-semibold mb-2'>
            Error Loading Clubs
          </div>
          <div className='text-gray-600'>
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  if (!clubs || clubs.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='container mx-auto px-4 py-8'>
          <div className='bg-white rounded-xl shadow-lg p-8'>
            <div className='flex justify-between items-center mb-8'>
              <h1 className='text-4xl font-bold text-gray-800'>My Clubs</h1>
              <button
                className='px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium cursor-pointer transition-colors shadow-md'
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>

            <div className='text-center py-16'>
              <div className='text-6xl mb-6'>🏛️</div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                No Clubs Yet
              </h2>
              <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                You haven't joined any clubs yet. Start by creating a new club
                or ask an admin to invite you!
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => navigate({ to: "/admin/clubcreate" })}
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md'
                >
                  Create New Club
                </button>
                <button
                  onClick={() => navigate({ to: "/" })}
                  className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors'
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                My Clubs
              </h1>
              <p className='text-gray-600'>
                Manage your club memberships and expenses
              </p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => navigate({ to: "/admin/clubcreate" })}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md'
              >
                Create Club
              </button>
              <button
                onClick={signOut}
                className='px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md'
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Statistics Section */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-100 text-sm'>Total Clubs</p>
                  <p className='text-2xl font-bold'>{clubs.length}</p>
                </div>
                <div className='text-3xl opacity-80'>🏛️</div>
              </div>
            </div>
            <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-green-100 text-sm'>Admin Roles</p>
                  <p className='text-2xl font-bold'>
                    {
                      clubs.filter((m) =>
                        m.role.toLowerCase().includes("admin")
                      ).length
                    }
                  </p>
                </div>
                <div className='text-3xl opacity-80'>👑</div>
              </div>
            </div>
            <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-purple-100 text-sm'>Member Since</p>
                  <p className='text-2xl font-bold'>
                    {clubs.length > 0
                      ? new Date(
                          Math.min(
                            ...clubs.map((c) => new Date(c.joinedAt).getTime())
                          )
                        ).getFullYear()
                      : "2024"}
                  </p>
                </div>
                <div className='text-3xl opacity-80'>📅</div>
              </div>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {clubs.map((membership) => (
            <div
              key={membership.club.slug}
              onClick={() =>
                navigate({ to: `/myclubs/${membership.club.slug}` })
              }
              className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors'>
                  <div className='text-2xl'>🏛️</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    membership.role.toLowerCase().includes("admin")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {membership.role
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </div>

              <h2 className='text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors'>
                {membership.club.name}
              </h2>

              <p className='text-gray-600 mb-4 line-clamp-2'>
                {membership.club.description}
              </p>

              <div className='flex items-center justify-between text-sm text-gray-500'>
                <div className='flex items-center'>
                  <span className='mr-1'>📅</span>
                  Joined {new Date(membership.joinedAt).toLocaleDateString()}
                </div>
                <div className='text-blue-600 group-hover:text-blue-700 font-medium'>
                  View Details →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='mt-12 bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button
              onClick={() => navigate({ to: "/admin/clubcreate" })}
              className='p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group'
            >
              <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>
                ➕
              </div>
              <div className='font-medium text-gray-700 group-hover:text-blue-600'>
                Create New Club
              </div>
            </button>
            <button
              onClick={() => navigate({ to: "/wallet" })}
              className='p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group'
            >
              <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>
                💰
              </div>
              <div className='font-medium text-gray-700 group-hover:text-green-600'>
                Manage Wallet
              </div>
            </button>
            <button className='p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group'>
              <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>
                📊
              </div>
              <div className='font-medium text-gray-700 group-hover:text-purple-600'>
                View Reports
              </div>
            </button>
            <button className='p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group'>
              <div className='text-3xl mb-2 group-hover:scale-110 transition-transform'>
                ⚙️
              </div>
              <div className='font-medium text-gray-700 group-hover:text-orange-600'>
                Settings
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/myclubs/")({
  component: MyClubs,
});
