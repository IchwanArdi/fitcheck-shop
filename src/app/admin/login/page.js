'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock login for now - will implement proper auth next
    if (email === 'admin@fitcheck.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">FITCHECK ADMIN</h1>
          <p className="text-gray-500 text-sm">Please enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@fitcheck.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
