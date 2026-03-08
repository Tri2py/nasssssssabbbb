import React from 'react';

const PageLoader = ({ fullScreen = false }) => {
    const containerClass = fullScreen
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm'
        : 'flex items-center justify-center p-8 w-full h-full min-h-[200px]';

    return (
        <div className={containerClass}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
                {/* Inner Spinning Ring */}
                <div className="absolute w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                {/* Center Pulse Dot */}
                <div className="w-4 h-4 bg-primary-600 rounded-full animate-pulse-slow"></div>
            </div>
        </div>
    );
};

export default PageLoader;
