
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-emerald-500"></div>
        <h2 className="text-xl font-semibold text-slate-300 mt-4">Generating Players...</h2>
        <p className="text-slate-400">Please wait while our AI creates a pool of cricket stars.</p>
    </div>
  );
};

export default Loader;
