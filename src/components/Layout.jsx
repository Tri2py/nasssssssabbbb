import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { familyAPI, personAPI } from '../services/api';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [families, setFamilies] = useState([]);
  const [personProfile, setPersonProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [familiesRes, profileRes] = await Promise.all([
          familyAPI.getAll(),
          personAPI.getProfile().catch(() => ({ data: { person: null } })),
        ]);
        setFamilies(familiesRes.data.families || []);
        setPersonProfile(profileRes.data.person || null);
      } catch {
        setFamilies([]);
        setPersonProfile(null);
      }
    };
    load();
  }, []);

  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 flex relative overflow-hidden font-sans ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`} dir="rtl">
      {/* Animated Background Blobs for Premium Feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 dark:opacity-20 animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

      {/* Sidebar */}
      <Sidebar
        families={families}
        personProfile={personProfile}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 glass border-b border-white/40 dark:border-slate-700/50 lg:hidden shadow-sm backdrop-blur-md transition-colors duration-500">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors shadow-sm bg-white/40 dark:bg-slate-800/40"
              aria-label="فتح القائمة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              نسب
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in custom-scrollbar overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
