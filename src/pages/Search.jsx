import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import Layout from '../components/Layout';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ persons: [], families: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await searchAPI.search(searchQuery);
      setResults(response.data.results);
      setSearched(true);
      setSearchParams({ q: searchQuery });
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">

        {/* Search Banner Header */}
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden group border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 dark:from-indigo-400/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/40 mb-6 transform -rotate-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
              البحث الشامل
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-8">
              ابحث عن الأشخاص، العائلات، والأصول في شبكة نسب بكل سهولة ويسر.
            </p>

            <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل اسم الشخص أو العائلة للبحث..."
                required
                className="w-full pl-4 pr-14 py-4 md:py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white dark:border-slate-700 rounded-2xl md:rounded-full text-base md:text-lg font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:bg-white dark:focus:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-slate-900/50 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl md:rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:hover:bg-indigo-600"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50/80 dark:bg-red-900/40 border border-red-100 dark:border-red-800/50 p-4 animate-fade-in backdrop-blur-sm max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {searched && !loading && (
          <div className="space-y-10">
            {/* Persons Results */}
            <section className="animate-slide-up animation-delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  نتائج الأشخاص
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mr-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{results.persons.length}</span>
                </h2>
              </div>

              {results.persons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.persons.map((person) => (
                    <div key={person.id} className="card glass-panel group hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 p-0 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xl font-black text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                            {person.full_name?.charAt(0) || 'ش'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-1">{person.full_name}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                              عائلة: {person.families?.family_name || 'غير متوفر'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                          {person.city ? `🌍 ${person.city}` : 'الموقع غير متوفر'}
                        </span>
                        <Link
                          to={`/family/${person.family_id}`}
                          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          عرض الشجرة ←
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على أشخاص بهذا الاسم</p>
                </div>
              )}
            </section>

            {/* Families Results */}
            <section className="animate-slide-up animation-delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  نتائج العائلات
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mr-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{results.families.length}</span>
                </h2>
              </div>

              {results.families.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.families.map((family) => (
                    <div key={family.id} className="card glass-panel group hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 p-0 overflow-hidden transform hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">{family.family_name}</h3>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                          <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          الأصل: {family.origin_city || 'غير محدد'}
                        </div>
                      </div>
                      <div className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end items-center group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20 transition-colors">
                        <Link
                          to={`/family/${family.id}`}
                          className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
                        >
                          عرض تفاصيل العائلة
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على عائلات بهذا الاسم</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
