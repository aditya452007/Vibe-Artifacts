import React from 'react';

export const LoadingScreen = () => {
    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center text-green-500 font-mono">
            <span className="text-xl animate-pulse">
                &gt; Generating your GitHub journey..._
            </span>
        </div>
    );
};
