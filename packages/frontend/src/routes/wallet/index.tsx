import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useWallet } from "../../providers/WalletProvider";
import * as nanocurrency from "nanocurrency";
import { useState } from "react";

// TODO: check if entered password is correct.
function Wallet() {
  const { wallet, isLoading, setPassword, createWallet, refetch } = useWallet();
  const navigate = useNavigate();
  const [password, setPasswordInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    try {
      setIsCreating(true);
      console.log("button clicked");
      const pwd = (document.getElementById("pwd") as HTMLInputElement)?.value;
      if (!pwd) {
        alert("Please enter a password");
        setIsCreating(false);
        return;
      }
      setPassword(pwd);

      if (!wallet) {
        const newWallet = await createWallet(await nanocurrency.generateSeed());
        console.log(newWallet);
        refetch();
      }

      navigate({ to: "/myclubs" });
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Failed to create wallet. Please try again.");
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <div className='text-lg text-gray-700'>Setting up your wallet...</div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>💼</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Create Your Wallet
            </h2>
            <p className='text-gray-600'>
              Set up your blockchain wallet to start managing club expenses
              securely
            </p>
          </div>

          {/* Security Info */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start gap-3'>
              <span className='text-yellow-600 text-xl'>🔒</span>
              <div>
                <h3 className='font-semibold text-yellow-800 mb-1'>
                  Security Notice
                </h3>
                <p className='text-sm text-yellow-700'>
                  Your password encrypts your wallet. Keep it safe - we cannot
                  recover it if lost.
                </p>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className='mb-6'>
            <label
              htmlFor='pwd'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Wallet Password
            </label>
            <input
              type='password'
              name='pwd'
              id='pwd'
              placeholder='Enter a strong password'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Use at least 8 characters with letters, numbers, and symbols
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={handleClick}
            disabled={isCreating}
            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg'
          >
            {isCreating ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Creating Wallet...
              </div>
            ) : (
              "Create Wallet"
            )}
          </button>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <button
              onClick={() => navigate({ to: "/" })}
              className='text-gray-500 hover:text-gray-700 text-sm transition-colors'
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>✅</span>
            </div>
            <h2 className='text-2xl font-bold text-green-600 mb-2'>
              Wallet Ready!
            </h2>
            <p className='text-gray-600'>
              Your blockchain wallet is set up. Enter your password to access
              your clubs.
            </p>
          </div>

          {/* Wallet Info */}
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-3'>
              <span className='text-green-600 text-xl'>🔐</span>
              <div>
                <h3 className='font-semibold text-green-800 mb-1'>
                  Secure Access
                </h3>
                <p className='text-sm text-green-700'>
                  Enter your password to unlock wallet features
                </p>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className='mb-6'>
            <label
              htmlFor='pwd'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Wallet Password
            </label>
            <input
              type='password'
              name='pwd'
              id='pwd'
              placeholder='Enter your wallet password'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors'
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleClick}
            disabled={isCreating}
            className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg'
          >
            {isCreating ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Accessing...
              </div>
            ) : (
              "Continue to Clubs"
            )}
          </button>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <button
              onClick={() => navigate({ to: "/" })}
              className='text-gray-500 hover:text-gray-700 text-sm transition-colors'
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const Route = createFileRoute("/wallet/")({
  component: Wallet,
});
