import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '' }) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div
            className={`relative flex w-16 h-8 p-1 rounded-full cursor-pointer transition-colors duration-300 ${isDarkMode
                    ? 'bg-slate-950 border border-slate-800'
                    : 'bg-white border border-slate-200 shadow-sm'
                } ${className}`}
            onClick={toggleTheme}
            role="button"
            tabIndex={0}
            title={isDarkMode ? 'تفعيل المظهر الفاتح' : 'تفعيل المظهر الداكن'}
        >
            {/* خلفية منزلقة فقط — القمر والشمس ثابتان في مكانيهما */}
            <div
                className={`absolute top-1 w-6 h-6 rounded-full transition-transform duration-300 ease-out ${
                    isDarkMode ? 'left-1 translate-x-7 bg-slate-700' : 'left-1 translate-x-0 bg-slate-200'
                }`}
                aria-hidden
            />
            <div className="relative flex flex-1 items-center justify-center z-10">
                <Moon className="w-4 h-4 text-slate-400 dark:text-slate-300" strokeWidth={1.5} />
            </div>
            <div className="relative flex flex-1 items-center justify-center z-10">
                <Sun className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
            </div>
        </div>
    );
}

export default ThemeToggle;
