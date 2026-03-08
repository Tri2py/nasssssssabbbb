import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      setLoading(false);
      return;
    }

    const result = await register(email, password, fullName);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-teal-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

      <div className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 relative z-10 animate-slide-up shadow-2xl shadow-primary-900/10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            إنشاء حساب جديد
          </h2>
          <p className="mt-3 text-sm text-slate-500 font-medium">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors underline decoration-2 underline-offset-4 decoration-primary-200 hover:decoration-primary-500">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50/80 border border-red-100 p-4 animate-fade-in backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="input-label">
                الاسم الكامل
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="input-field pl-4 pr-10 hover:border-primary-300"
                  placeholder="محمد أحمد"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="input-label">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-4 pr-10 hover:border-primary-300"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field pl-4 pr-10 hover:border-primary-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 mr-1">
                يجب أن تتكون من 6 أحرف على الأقل
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-primary-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري إنشاء الحساب...
                </span>
              ) : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
