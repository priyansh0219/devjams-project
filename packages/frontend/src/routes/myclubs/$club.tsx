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
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <div className='text-lg text-gray-700'>Loading club data...</div>
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
            Error Loading Club
          </div>
          <div className='text-gray-600 mb-4'>{error.message}</div>
          <button
            onClick={() => navigate({ to: "/myclubs" })}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Back to My Clubs
          </button>
        </div>
      </div>
    );
  }

  if (!clubData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 text-center max-w-md'>
          <div className='text-gray-400 text-4xl mb-4'>🏛️</div>
          <div className='text-gray-700 text-lg font-semibold mb-2'>
            Club Not Found
          </div>
          <div className='text-gray-600 mb-4'>
            The club you're looking for doesn't exist or you don't have access
            to it.
          </div>
          <button
            onClick={() => navigate({ to: "/myclubs" })}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Back to My Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate({ to: "/myclubs" })}
                className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
              >
                ← Back
              </button>
              <div>
                <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                  {clubData.club_name}
                </h1>
                <p className='text-gray-600'>Club Management Dashboard</p>
              </div>
            </div>
            <div className='bg-blue-100 rounded-lg p-4'>
              <div className='text-3xl'>🏛️</div>
            </div>
          </div>
        </div>

        {/* Club Description */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-blue-100 rounded-lg p-2'>
              <span className='text-xl'>📝</span>
            </div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              About This Club
            </h2>
          </div>
          <p className='text-gray-700 leading-relaxed text-lg'>
            {clubData.description}
          </p>
        </div>

        {/* Admins Section */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-purple-100 rounded-lg p-2'>
              <span className='text-xl'>👑</span>
            </div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Club Administrators
            </h2>
          </div>

          {clubData.admins && clubData.admins.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {clubData.admins.map((admin, index) => (
                <div
                  key={index}
                  className='bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center'>
                      <span className='text-purple-700 font-bold'>
                        {admin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-800'>
                        {admin.name}
                      </h3>
                      <span className='text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full'>
                        Administrator
                      </span>
                    </div>
                  </div>
                  <p className='text-sm text-gray-600 flex items-center gap-1'>
                    <span>📧</span>
                    {admin.email}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-4xl mb-4'>👤</div>
              <p className='text-gray-500 italic text-lg'>
                No administrators listed
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Admins</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {clubData.admins?.length || 0}
                </p>
              </div>
              <div className='bg-purple-100 rounded-lg p-3'>
                <span className='text-2xl'>👑</span>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Active Status</p>
                <p className='text-2xl font-bold text-green-600'>Active</p>
              </div>
              <div className='bg-green-100 rounded-lg p-3'>
                <span className='text-2xl'>✅</span>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Your Role</p>
                <p className='text-2xl font-bold text-blue-600'>Member</p>
              </div>
              <div className='bg-blue-100 rounded-lg p-3'>
                <span className='text-2xl'>👤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
            Club Management
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button
              onClick={() => navigate({ to: `/myclubs/${club}/ledger` })}
              className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg'
            >
              <div className='text-2xl mb-2'>📊</div>
              <div>View Ledger</div>
            </button>
            <button
              onClick={() => navigate({ to: `/myclubs/${club}/transactions` })}
              className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg'
            >
              <div className='text-2xl mb-2'>💰</div>
              <div>Log Transactions</div>
            </button>
            <button
              onClick={() => navigate({ to: `/myclubs/${club}/members` })}
              className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg'
            >
              <div className='text-2xl mb-2'>👥</div>
              <div>Manage Members</div>
            </button>
            <button
              onClick={() => navigate({ to: `/myclubs/${club}/settings` })}
              className='bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg'
            >
              <div className='text-2xl mb-2'>⚙️</div>
              <div>Club Settings</div>
            </button>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Recent Activity
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='text-green-600'>✅</span>
                <div>
                  <p className='text-sm font-medium'>
                    Club created successfully
                  </p>
                  <p className='text-xs text-gray-500'>
                    Welcome to {clubData.club_name}!
                  </p>
                </div>
              </div>
              <div className='text-center py-4'>
                <p className='text-gray-500 text-sm'>
                  More activities will appear here
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Need Help?
            </h3>
            <div className='space-y-3'>
              <button className='w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors'>
                <div className='flex items-center gap-3'>
                  <span className='text-blue-600'>📚</span>
                  <div>
                    <p className='text-sm font-medium text-blue-800'>
                      Getting Started Guide
                    </p>
                    <p className='text-xs text-blue-600'>Learn the basics</p>
                  </div>
                </div>
              </button>
              <button className='w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors'>
                <div className='flex items-center gap-3'>
                  <span className='text-green-600'>💬</span>
                  <div>
                    <p className='text-sm font-medium text-green-800'>
                      Contact Support
                    </p>
                    <p className='text-xs text-green-600'>
                      Get help from our team
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/myclubs/$club")({
  component: clubPage,
});
