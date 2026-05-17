import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, displayName || 'Reader');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pastel-card p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-pastel-heading">Welcome Back!</h1>
          <p className="text-sm text-pastel-muted">Sign in through the PHP manga API</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-400 text-xs text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-pastel-light text-sm text-pastel-text outline-none focus:ring-1 ring-pastel-pink"
            />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full px-4 py-3 rounded-xl bg-pastel-light text-sm text-pastel-text outline-none focus:ring-1 ring-pastel-pink"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-pastel-cardbg border-2 border-pastel-border text-pastel-text py-4 rounded-2xl font-bold shadow-sm hover:border-pastel-pink hover:text-pastel-pink transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Continue'}
          </motion.button>
        </form>

        <p className="text-center text-xs mt-8 text-pastel-muted">
          This replaces Firebase Auth with the local PHP API identity.
        </p>
      </motion.div>
    </div>
  );
}
