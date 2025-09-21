import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../providers/AuthProvider";

const HomePage = () => {
  const { signIn, loading, session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-5xl font-bold text-gray-800 mb-6'>
            Club<span className='text-blue-600'>Chain</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            The future of club expense tracking is here. Built on blockchain
            technology for transparency, security, and trust that your members
            deserve.
          </p>

          {/* Features Grid */}
          <div className='grid md:grid-cols-3 gap-8 mb-12'>
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <div className='text-3xl mb-4'>🔗</div>
              <h3 className='text-lg font-semibold mb-2'>Blockchain Powered</h3>
              <p className='text-gray-600 text-sm'>
                Immutable transaction records ensure complete transparency and
                accountability
              </p>
            </div>
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <div className='text-3xl mb-4'>💰</div>
              <h3 className='text-lg font-semibold mb-2'>Expense Tracking</h3>
              <p className='text-gray-600 text-sm'>
                Real-time tracking of all club expenses with detailed
                categorization
              </p>
            </div>
            <div className='bg-white rounded-lg p-6 shadow-md'>
              <div className='text-3xl mb-4'>👥</div>
              <h3 className='text-lg font-semibold mb-2'>Member Management</h3>
              <p className='text-gray-600 text-sm'>
                Easy member onboarding and role-based access control
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className='bg-white rounded-xl p-8 shadow-lg'>
            {!loading ? (
              session ? (
                <div>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    Welcome back!
                  </h2>
                  <p className='text-gray-600 mb-6'>
                    Ready to manage your club expenses?
                  </p>
                  <button
                    className='py-3 px-8 bg-green-500 hover:bg-green-600 rounded-lg mx-auto cursor-pointer text-white font-medium transition-colors shadow-md'
                    onClick={() => navigate({ to: "/myclubs" })}
                  >
                    Go to My Clubs
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                    Get Started Today
                  </h2>
                  <p className='text-gray-600 mb-6'>
                    Join thousands of clubs already using ClubChain
                  </p>
                  <button
                    className='py-3 px-8 bg-blue-500 hover:bg-blue-600 rounded-lg mx-auto cursor-pointer text-white font-medium transition-colors shadow-md'
                    onClick={() => signIn()}
                  >
                    Sign In with Google
                  </button>
                </div>
              )
            ) : (
              <div>
                <div className='animate-pulse'>
                  <div className='h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6'></div>
                </div>
                <button className='py-3 px-8 bg-gray-400 rounded-lg mx-auto text-white font-medium cursor-not-allowed'>
                  Loading...
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose ClubChain Section */}
      <div className='bg-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              Why Choose ClubChain?
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Traditional expense tracking lacks transparency and trust.
              ClubChain solves these problems with cutting-edge blockchain
              technology.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-6'>
                Traditional Problems
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <div className='text-red-500 text-xl mr-3'>❌</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      Lack of Transparency
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Members can't verify how their money is being spent
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='text-red-500 text-xl mr-3'>❌</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      Manual Record Keeping
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Prone to errors and manipulation
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='text-red-500 text-xl mr-3'>❌</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>Trust Issues</h4>
                    <p className='text-gray-600 text-sm'>
                      Members question financial decisions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-2xl font-semibold text-gray-800 mb-6'>
                ClubChain Solutions
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <div className='text-green-500 text-xl mr-3'>✅</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      Complete Transparency
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Every transaction is recorded on blockchain for all to see
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='text-green-500 text-xl mr-3'>✅</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      Immutable Records
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Blockchain ensures data cannot be altered or deleted
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='text-green-500 text-xl mr-3'>✅</div>
                  <div>
                    <h4 className='font-medium text-gray-800'>
                      Built-in Trust
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Cryptographic proof eliminates need for blind trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              How It Works
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Simple steps to get your club started with transparent expense
              tracking
            </p>
          </div>

          <div className='grid md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-blue-600 font-bold text-xl'>1</span>
              </div>
              <h3 className='font-semibold text-gray-800 mb-2'>
                Create Your Club
              </h3>
              <p className='text-gray-600 text-sm'>
                Set up your club profile and add initial members
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-green-600 font-bold text-xl'>2</span>
              </div>
              <h3 className='font-semibold text-gray-800 mb-2'>Add Members</h3>
              <p className='text-gray-600 text-sm'>
                Invite members and assign roles with different permissions
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-purple-600 font-bold text-xl'>3</span>
              </div>
              <h3 className='font-semibold text-gray-800 mb-2'>
                Track Expenses
              </h3>
              <p className='text-gray-600 text-sm'>
                Log all expenses with receipts and automatic blockchain
                recording
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                <span className='text-orange-600 font-bold text-xl'>4</span>
              </div>
              <h3 className='font-semibold text-gray-800 mb-2'>View Reports</h3>
              <p className='text-gray-600 text-sm'>
                Generate transparent reports that all members can verify
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className='bg-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              What Club Leaders Say
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-gray-50 rounded-lg p-6'>
              <div className='text-yellow-400 text-xl mb-4'>⭐⭐⭐⭐⭐</div>
              <p className='text-gray-600 mb-4 italic'>
                "ClubChain has revolutionized how we handle our photography
                club's finances. Complete transparency has eliminated all trust
                issues."
              </p>
              <div className='font-medium text-gray-800'>Sarah Johnson</div>
              <div className='text-sm text-gray-500'>
                Photography Club President
              </div>
            </div>
            <div className='bg-gray-50 rounded-lg p-6'>
              <div className='text-yellow-400 text-xl mb-4'>⭐⭐⭐⭐⭐</div>
              <p className='text-gray-600 mb-4 italic'>
                "The blockchain integration gives our members confidence that
                every dollar is accounted for. Highly recommended!"
              </p>
              <div className='font-medium text-gray-800'>Mike Chen</div>
              <div className='text-sm text-gray-500'>Gaming Club Treasurer</div>
            </div>
            <div className='bg-gray-50 rounded-lg p-6'>
              <div className='text-yellow-400 text-xl mb-4'>⭐⭐⭐⭐⭐</div>
              <p className='text-gray-600 mb-4 italic'>
                "Easy to use interface with powerful blockchain technology. Our
                debate club has never been more organized."
              </p>
              <div className='font-medium text-gray-800'>Emma Davis</div>
              <div className='text-sm text-gray-500'>Debate Club Secretary</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-gray-800 text-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>ClubChain</h3>
              <p className='text-gray-300 text-sm'>
                Transparent, secure, and trustworthy club expense tracking
                powered by blockchain technology.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Features</h4>
              <ul className='space-y-2 text-sm text-gray-300'>
                <li>Expense Tracking</li>
                <li>Member Management</li>
                <li>Blockchain Security</li>
                <li>Real-time Reports</li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <ul className='space-y-2 text-sm text-gray-300'>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Community</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Connect</h4>
              <ul className='space-y-2 text-sm text-gray-300'>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Discord</li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-700 pt-8 text-center'>
            <p className='text-gray-300 text-sm'>
              © 2024 ClubChain. Built with ❤️ for transparent club management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

// export default HomePage;
