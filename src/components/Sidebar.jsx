import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({
  families = [],
  personProfile = null,
  sidebarOpen,
  onCloseSidebar,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Theme Toggle Logic from Context
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const hasAdminFamily = families.some((f) => f.role === 'admin');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onCloseSidebar?.();
    } else {
      navigate('/search');
      onCloseSidebar?.();
    }
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative group overflow-hidden ${isActive(path)
      ? 'text-primary-700 dark:text-primary-400 bg-white/80 dark:bg-slate-800/80 shadow-md shadow-primary-500/10 dark:shadow-none border border-white dark:border-slate-700'
      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm border border-transparent hover:border-white/50 dark:hover:border-slate-700/50'
    }`;

  const iconClass = (path) =>
    `w-5 h-5 transition-transform duration-300 ${isActive(path) ? 'text-primary-600 dark:text-primary-400 scale-110' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:scale-110'
    }`;

  return (
    <>
      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-[280px] glass border-l border-white/50 dark:border-slate-700/50 flex flex-col shadow-2xl shadow-primary-900/5 dark:shadow-black/50
          transform transition-transform duration-400 cubic-bezier(0.4, 0, 0.2, 1)
          lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:border-none lg:backdrop-blur-none
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
        dir="rtl"
      >
        <div className="flex flex-col h-full lg:p-4" dir="rtl">
          {/* Header Inside Sidebar */}
          <div className="flex items-center justify-between p-6 lg:px-4 lg:py-6 lg:glass-panel lg:mb-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 group"
              onClick={onCloseSidebar}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-300 tracking-tight">
                نَسَب
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm"
                title={isDarkMode ? 'تفعيل المظهر الفاتح' : 'تفعيل المظهر الداكن'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={onCloseSidebar}
                className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors lg:hidden shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links inside Glass Panel on Desktop */}
          <nav className="flex-1 overflow-y-auto px-4 lg:glass-panel lg:p-4 custom-scrollbar space-y-8 pb-8">

            {/* Main Navigation */}
            <section className="space-y-2 mt-4">
              {personProfile?.family_id ? (
                <Link
                  to={`/family/${personProfile.family_id}`}
                  className={linkClass(`/family/${personProfile.family_id}`)}
                  onClick={onCloseSidebar}
                >
                  <svg className={iconClass(`/family/${personProfile.family_id}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>شجرة عائلتي</span>
                  {isActive(`/family/${personProfile.family_id}`) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={linkClass('/dashboard')}
                  onClick={onCloseSidebar}
                >
                  <svg className={iconClass('/dashboard')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>لوحة التحكم</span>
                  {isActive('/dashboard') && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
                </Link>
              )}
            </section>

            {/* Families Section */}
            <section>
              <h3 className="px-4 mb-3 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                إدارة العائلات
              </h3>
              <Link
                to="/family/create"
                className={`${linkClass('/family/create')} mb-3 bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-50 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-400`}
                onClick={onCloseSidebar}
              >
                <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>إنشاء عائلة جديدة</span>
              </Link>

              {families.length > 0 ? (
                <ul className="space-y-1 mt-2">
                  {families.map((family) => (
                    <li key={family.id}>
                      <Link
                        to={`/family/${family.id}`}
                        className={`${linkClass(`/family/${family.id}`)} py-2`}
                        onClick={onCloseSidebar}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                          <svg className={iconClass(`/family/${family.id}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="flex-1 truncate">{family.family_name}</span>
                        {family.role === 'admin' && (
                          <span className="shrink-0 flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" title="مدير"></span>
                          </span>
                        )}
                        {isActive(`/family/${family.id}`) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mx-2 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-500">لا تنتمي لأي عائلة حالياً</p>
                </div>
              )}
            </section>

            {/* Quick Actions Search */}
            <section className="px-1">
              <h3 className="px-3 mb-3 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                بحث عام
              </h3>

              <Link
                to="/search"
                className={`${linkClass('/search')} mb-3`}
                onClick={onCloseSidebar}
              >
                <svg className={iconClass('/search')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>صفحة البحث الشامل</span>
                {isActive('/search') && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
              </Link>

              <form onSubmit={handleSearchSubmit} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث سريع عن شخص..."
                  className="w-full pl-4 pr-11 py-3.5 bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/80 rounded-2xl text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white dark:focus:bg-slate-800 shadow-sm transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </section>

            {/* Edit Requests */}
            <section>
              <h3 className="px-4 mb-3 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                المراجعات
              </h3>
              <div className="space-y-1">
                <Link
                  to="/edit-requests"
                  className={linkClass('/edit-requests')}
                  onClick={onCloseSidebar}
                >
                  <svg className={iconClass('/edit-requests')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>طلباتي</span>
                  {isActive('/edit-requests') && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
                </Link>
                {hasAdminFamily && (
                  <Link
                    to="/edit-requests/admin"
                    className={linkClass('/edit-requests/admin')}
                    onClick={onCloseSidebar}
                  >
                    <svg className={iconClass('/edit-requests/admin')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>إدارة الطلبات (أدمن)</span>
                    {isActive('/edit-requests/admin') && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-500 rounded-r-full"></span>}
                  </Link>
                )}
              </div>
            </section>

          </nav>

          {/* User Profile & Logout - Fixed at bottom */}
          <div className="mt-auto p-4 lg:glass-panel lg:mt-4 lg:mx-4">
            <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.user_metadata?.full_name || 'مستخدم'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-white/60 dark:bg-slate-800/60 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300 shadow-sm border border-red-100 dark:border-red-900/50 hover:border-red-500 dark:hover:border-red-500 hover:shadow-red-500/30 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
