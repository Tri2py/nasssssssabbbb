import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Search, Users, TreePine, UserPlus, ArrowLeft } from 'lucide-react';
import * as db from '../services/localStorageDB';

const HomeSearch = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const searchResults = db.searchAll(query.trim());
    // Also get all families if searching for general terms
    setResults(searchResults);
    setLoading(false);
  };

  // Get all families for browsing
  const allFamilies = db.getFamilies();

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`} dir="rtl">

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary-400 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-[30%] right-[-15%] w-[600px] h-[600px] bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-30 dark:opacity-15 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[140px] opacity-30 dark:opacity-15 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 backdrop-blur-md bg-white/50 dark:bg-slate-900/60 border-b border-white/30 dark:border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Users className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 tracking-tight">
            نَسَب
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="btn-primary py-2.5 px-6 text-sm shadow-md">
              <ArrowLeft className="w-4 h-4" />
              لوحة التحكم
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors hidden sm:inline-block"
              >
                تسجيل الدخول
              </Link>
              <Link to="/register" className="btn-primary py-2.5 px-6 text-sm shadow-md">
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero / Search Section */}
      <section className="relative z-10 px-6 sm:px-10 pt-16 pb-12 text-center max-w-5xl mx-auto">
        {/* Decorative icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/30 dark:shadow-primary-900/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="w-full h-full rounded-3xl bg-white/10 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <TreePine className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 dark:from-primary-400 dark:via-indigo-400 dark:to-purple-400">
            ابحث عن عائلتك
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          ابحث في قاعدة بيانات العائلات عن أشخاص بالاسم أو المهنة أو المدينة. تصفّح شجرات العائلات المسجلة.
        </p>

        {/* Search Form — الزر برى البوكس */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن شخص أو عائلة بالاسم، المهنة، أو المدينة ..."
            className="flex-1 w-full px-4 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 rounded-2xl text-base md:text-lg font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 focus:bg-white dark:focus:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-slate-900/50 transition-all duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-5 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold hover:from-primary-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-70"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <Search className="w-6 h-6" strokeWidth={2} />
                <span className="hidden sm:inline">بحث</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Search Results */}
      {results && (
        <section className="relative z-10 px-6 sm:px-10 pb-12 max-w-6xl mx-auto space-y-10 animate-slide-up">

          {/* Persons Results */}
          {results.persons.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Users className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  نتائج الأشخاص
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mr-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{results.persons.length}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.persons.map((person) => (
                  <div key={person.id} className="glass-panel group hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 p-0 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-110 transition-transform ${person.gender === 'female'
                            ? 'bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/40 dark:to-rose-800/40 text-pink-600 dark:text-pink-400'
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-indigo-600 dark:text-indigo-400'
                          }`}>
                          {person.full_name?.charAt(0) || 'ش'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{person.full_name}</h3>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {person.families?.family_name || 'غير متوفر'}
                          </p>
                        </div>
                      </div>
                      {(person.job || person.city) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {person.job && (
                            <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                              💼 {person.job}
                            </span>
                          )}
                          {person.city && (
                            <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                              🌍 {person.city}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Families Results */}
          {results.families.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TreePine className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  نتائج العائلات
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mr-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{results.families.length}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.families.map((family) => (
                  <div key={family.id} className="glass-panel group hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 p-6 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <TreePine className="w-7 h-7" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">{family.family_name}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          🌍 الأصل: {family.origin_city || 'غير محدد'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.persons.length === 0 && results.families.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                <Search className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">لا توجد نتائج</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">جرّب البحث باسم مختلف أو مهنة أو مدينة</p>
            </div>
          )}
        </section>
      )}

      {/* Browse All Families (shown when no search active) */}
      {!results && allFamilies.length > 0 && (
        <section className="relative z-10 px-6 sm:px-10 pb-16 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-3">
              العائلات المسجلة
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              تصفّح شجرات العائلات المسجلة في المنصة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFamilies.map((family) => {
              const memberCount = db.getPersonsByFamily(family.id).length;
              return (
                <div key={family.id} className="glass-panel group hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-500 p-6 transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-indigo-500 opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-800/40 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <TreePine className="w-7 h-7" strokeWidth={1.5} />
                      </div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50">
                        {memberCount} فرد
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">{family.family_name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      🌍 الأصل: {family.origin_city || 'غير محدد'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA for non-logged-in users */}
      {!user && (
        <section className="relative z-10 px-6 sm:px-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel p-10 sm:p-14 text-center relative overflow-hidden border-t-4 border-t-primary-500 dark:border-t-primary-400">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4 relative z-10">
                ابدأ بتوثيق تاريخ عائلتك اليوم
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-8 relative z-10">
                أنشئ حسابك وابدأ ببناء شجرة عائلتك في دقائق. جميع البيانات محفوظة بأمان.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link to="/register" className="btn-primary py-4 px-12 text-lg shadow-xl shadow-primary-500/25">
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب مجاني
                </Link>
                <Link to="/login" className="btn-secondary py-4 px-12 text-lg">
                  لديك حساب؟ سجل دخولك
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-700/50 px-6 sm:px-10 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              نَسَب — منصة شجرة العائلة
            </span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} نَسَب. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeSearch;
