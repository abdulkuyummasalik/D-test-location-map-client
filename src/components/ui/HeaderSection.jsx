import React from 'react';

const HeaderSection = ({
    title,
    color = "text-gray-800",
    onRefresh,
    onExport,
    button1 = "Refresh",
    button2 = "Export Excel"
}) => (
    <div className="w-full bg-white rounded-lg shadow-sm px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-10 lg:py-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
            <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${color}`}>
                {title}
            </h1>
            <div className="flex gap-2">
                <button
                    onClick={onRefresh}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-md transition duration-200 ease-in-out text-xs sm:text-sm md:text-base"
                >
                    {button1}
                </button>
                <button
                    onClick={onExport}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-md transition duration-200 ease-in-out text-xs sm:text-sm md:text-base"
                >
                    {button2}
                </button>
            </div>
        </div>
    </div>
);

export default HeaderSection;
