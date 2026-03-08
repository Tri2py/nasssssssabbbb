import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { familyAPI, personAPI } from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [families, setFamilies] = useState([]);
  const [personProfile, setPersonProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [familiesRes, profileRes] = await Promise.all([
        familyAPI.getAll(),
        personAPI.getProfile().catch(() => ({ data: { person: null } })),
      ]);

      setFamilies(familiesRes.data.families || []);
      setPersonProfile(profileRes.data.person || null);
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 dark:border-t-indigo-400 animate-spin animation-delay-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Header Section */}
        <div className="glass-panel p-8 sm:p-10 relative overflow-hidden group border-t-4 border-t-transparent dark:border-t-slate-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>

          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
            لوحة التحكم
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl relative z-10">
            مرحباً بك في منصة نسب. يمكنك إدارة شجرات العائلة الخاصة بك، متابعة الطلبات، وتعديل ملفك الشخصي من هنا.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50/80 dark:bg-red-900/40 border border-red-100 dark:border-red-800/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area (Families) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="card glass-panel h-full border-t-4 border-t-primary-500 dark:border-t-primary-400 overflow-visible">
              <div className="p-6 border-b border-slate-100/50 dark:border-slate-700/50 flex flex-wrap gap-4 justify-between items-center bg-white/40 dark:bg-slate-800/40 rounded-t-3xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                  <span className="p-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  عائلاتي
                </h2>
                <Link
                  to="/family/create"
                  className="btn-primary py-2 px-4 shadow-none hover:shadow-lg text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  إنشاء عائلة جديدة
                </Link>
              </div>

              <div className="p-6">
                {families.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    {families.map((family) => (
                      <Link
                        to={`/family/${family.id}`}
                        key={family.id}
                        className="group flex flex-col p-5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-900/20 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-50 dark:group-hover:from-primary-900 dark:group-hover:to-primary-800 transition-colors">
                            <svg className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${family.role === 'admin'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                            : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50'
                            }`}>
                            {family.role === 'admin' ? 'مدير' : 'عضو'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-1">{family.family_name}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50">
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{family.origin_city || 'غير محدد'}</span>
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700">
                    <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-200">لا توجد عائلات</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      لم تنضم لأي عائلة بعد. يمكنك إنشاء عائلة جديدة للبدء.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Content (Profile & Quick Actions) */}
          <div className="lg:col-span-4 space-y-8">

            {/* Person Profile Card */}
            <div className="card glass-panel border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
              <div className="p-5 border-b border-slate-100/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 rounded-t-3xl">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                  <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  ملفك الشخصي
                </h2>
              </div>
              <div className="p-5">
                {personProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {personProfile.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{personProfile.full_name}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{personProfile.job || 'بدون مهنة'}</p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      {personProfile.birth_date && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">تاريخ الميلاد</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(personProfile.birth_date).toLocaleDateString('ar-EG')}</span>
                        </div>
                      )}
                      {personProfile.city && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">المدينة</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{personProfile.city}</span>
                        </div>
                      )}
                      <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                        <Link
                          to={`/family/${personProfile.family_id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold text-sm block text-center transition-colors"
                        >
                          عرض مكانك في الشجرة ←
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      ملفك غير مرتبط بأي شخص في شجرة. اطلب من مدير العائلة إضافتك ثم ربط حسابك.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card glass-panel border-t-4 border-t-amber-500 dark:border-t-amber-400">
              <div className="p-5 border-b border-slate-100/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 rounded-t-3xl">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                  <span className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  إجراءات سريعة
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <Link
                  to="/search"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Бحث المتقدم</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:-translate-x-1 transition-all">←</span>
                </Link>

                <Link
                  to="/edit-requests"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">طلبات التعديل الخاصة بك</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:-translate-x-1 transition-all">←</span>
                </Link>

                {families.some(f => f.role === 'admin') && (
                  <Link
                    to="/edit-requests/admin"
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-amber-100 dark:border-amber-900/40 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-amber-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </span>
                      <span className="text-sm font-bold text-amber-800 dark:text-amber-400">إدارة الطلبات (صلاحية المدير)</span>
                    </div>
                    <span className="text-amber-300 dark:text-amber-700 group-hover:text-amber-600 dark:group-hover:text-amber-500 group-hover:-translate-x-1 transition-all">←</span>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
