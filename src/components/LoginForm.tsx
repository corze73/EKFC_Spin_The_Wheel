import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (isAdmin: boolean) => void;
}

// Fixed admin password
const ADMIN_PASSWORD = 'K7M9P2X8';

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'corze73' && password === ADMIN_PASSWORD) {
      onLogin(true); // Admin login
    } else {
      setError('Invalid credentials');
    }
  };

  const handleGuestAccess = () => {
    onLogin(false); // User/guest access
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/Screenshot 2025-01-23 at 07.38.49.png" 
              alt="E&KFC Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-[#2D5A27]">E&KFC</h1>
          </div>
          <h2 className="text-xl text-gray-600">Spin the Wheel</h2>
          <p className="text-sm text-gray-500 mt-2">Login to access admin features</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2D5A27] focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2D5A27] focus:outline-none pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#2D5A27] text-white py-3 rounded-lg hover:bg-[#1a3318] transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Lock size={20} />
            <span>Login as Admin</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleGuestAccess}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Continue as User
          </button>
        </div>
      </div>
    </div>
  );
}