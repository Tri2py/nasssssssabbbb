import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'شجرة عائلية تفاعلية',
            desc: 'عرض مرئي جميل وتفاعلي يوضح العلاقات بين أفراد العائلة عبر الأجيال المختلفة.',
            color: 'from-blue-500 to-indigo-600',
            bgLight: 'bg-blue-50',
            bgDark: 'dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: 'بحث شامل ومتقدم',
            desc: 'ابحث عن أي فرد في العائلة بالاسم أو المهنة أو المدينة أو المؤهل العلمي.',
            color: 'from-emerald-500 to-teal-600',
            bgLight: 'bg-emerald-50',
            bgDark: 'dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'إدارة عائلات متعددة',
            desc: 'أنشئ وأدر عدة شجرات عائلية في مكان واحد. لكل عائلة شجرتها الخاصة.',
            color: 'from-amber-500 to-orange-600',
            bgLight: 'bg-amber-50',
            bgDark: 'dark:bg-amber-900/30',
            textColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            title: 'ملفات شخصية مفصلة',
            desc: 'احفظ معلومات كل فرد: العمر، التعليم، المهنة، الحالة الاجتماعية والمزيد.',
            color: 'from-purple-500 to-pink-600',
            bgLight: 'bg-purple-50',
            bgDark: 'dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

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
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 tracking-tight">
                        نَسَب
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                        title={isDarkMode ? 'المظهر الفاتح' : 'المظهر الداكن'}
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
                    <Link
                        to="/login"
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        تسجيل الدخول
                    </Link>
                    <Link
                        to="/register"
                        className="btn-primary py-2.5 px-6 text-sm shadow-md"
                    >
                        إنشاء حساب
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 sm:px-10 pt-20 pb-28 text-center max-w-5xl mx-auto">
                {/* Decorative tree icon */}
                <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/30 dark:shadow-primary-900/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full rounded-3xl bg-white/10 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 dark:from-primary-400 dark:via-indigo-400 dark:to-purple-400">
                        وثّق تاريخ عائلتك
                    </span>
                    <br />
                    <span className="text-slate-800 dark:text-white">
                        مع منصة نَسَب
                    </span>
                </h1>

                <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
                    أنشئ شجرة عائلتك التفاعلية، نظّم معلومات أفراد العائلة، وشارك تاريخ عائلتك العريق مع الأجيال القادمة.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/register"
                        className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        ابدأ الآن مجاناً
                    </Link>
                    <Link
                        to="/login"
                        className="btn-secondary py-4 px-10 text-lg"
                    >
                        لديك حساب؟ سجل دخولك
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                    {[
                        { num: '∞', label: 'عائلات غير محدودة' },
                        { num: '🔒', label: 'بياناتك محفوظة' },
                        { num: '🌳', label: 'شجرة تفاعلية' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-black text-primary-600 dark:text-primary-400 mb-1">{stat.num}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 sm:px-10 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
                            كل ما تحتاجه لتوثيق نسبك
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                            أدوات متكاملة لبناء شجرة عائلتك وإدارة معلومات أفرادها بسهولة ويسر.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group glass-panel p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                                <div className={`w-14 h-14 rounded-2xl ${feature.bgLight} ${feature.bgDark} ${feature.textColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 sm:px-10 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-panel p-10 sm:p-14 text-center relative overflow-hidden border-t-4 border-t-primary-500 dark:border-t-primary-400">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10 dark:opacity-20 transform translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4 relative z-10">
                            ابدأ بتوثيق تاريخ عائلتك اليوم
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-8 relative z-10">
                            أنشئ حسابك وابدأ ببناء شجرة عائلتك في دقائق. جميع البيانات محفوظة بأمان على جهازك.
                        </p>
                        <Link
                            to="/register"
                            className="btn-primary py-4 px-12 text-lg shadow-xl shadow-primary-500/25 relative z-10"
                        >
                            إنشاء حساب مجاني
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-700/50 px-6 sm:px-10 py-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
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

export default LandingPage;
