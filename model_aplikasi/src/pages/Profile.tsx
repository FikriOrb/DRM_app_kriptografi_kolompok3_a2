import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';
import { User, Settings, LogOut, Shield, Bell, HelpCircle, ChevronRight, Sparkles, Moon, Sun, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { profile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  if (loading) return null;

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-10 pastel-card max-w-sm">
        <User size={60} className="mx-auto mb-6 text-pastel-muted opacity-30" />
        <h2 className="text-2xl font-bold mb-2">Hello there!</h2>
        <p className="text-pastel-muted text-sm mb-8">Sign in to sync your library and history across devices.</p>
        <Link to="/login" className="block bg-pastel-pink text-white py-4 rounded-2xl font-bold shadow-lg shadow-pastel-pink/30">
          Sign In / Sign Up
        </Link>
      </div>
    </div>
  );

  const menuItems = [
    { icon: isDark ? Sun : Moon, label: isDark ? 'Light Mode' : 'Dark Mode', color: 'text-pastel-pink', onClick: toggleTheme },
    { icon: Download, label: 'Downloads', color: 'text-pastel-orange', onClick: () => navigate('/downloads') },
    { icon: Settings, label: 'Preferences', color: 'text-pastel-purple' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-pastel-blue' },
    { icon: Bell, label: 'Notifications', color: 'text-pastel-orange' },
    { icon: HelpCircle, label: 'Help Center', color: 'text-pastel-green' },
  ];

  return (
    <div className="space-y-10">
      <header className="text-center pt-4">
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-pastel-cardbg shadow-xl overflow-hidden bg-pastel-cardbg">
            <img 
              src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} 
              alt={profile.displayName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-pastel-pink p-2 rounded-full border-4 border-pastel-bg text-white shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
        <p className="text-pastel-muted text-sm mt-1">{profile.email}</p>
      </header>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-pastel-muted uppercase tracking-[0.2em] px-4">Settings</p>
        <div className="pastel-card overflow-hidden border border-pastel-border">
          {menuItems.map((item, index) => (
            <button 
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 p-5 hover:bg-pastel-bg transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-pastel-border' : ''
              }`}
            >
              <div className={`p-2 rounded-xl bg-pastel-cardbg shadow-none border border-pastel-border ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-pastel-heading">{item.label}</span>
              <ChevronRight size={18} className="text-pastel-muted opacity-50" />
            </button>
          ))}
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 p-5 rounded-3xl bg-pastel-light text-pastel-heading font-bold text-sm hover:bg-pastel-border transition-colors border border-pastel-border"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>

      <footer className="text-center pb-10">
        <p className="text-[10px] text-pastel-muted opacity-50 uppercase tracking-widest">Pastel Comics v1.0.0</p>
      </footer>
    </div>
  );
}
