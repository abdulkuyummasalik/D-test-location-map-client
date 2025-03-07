import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

const ActionButtons = ({ buttonColor = "bg-blue-500" }) => {
    const location = useLocation();

    const isReportPage = ["/report/pa", "/report/pareto", "/report/mom"].includes(location.pathname);

    const buttons = [
        { text: "KPI PA% (Yearly)", link: "/report/kpi/pa" },
        { text: "KPI MTBS (Yearly)", link: "/report/kpi/mtbs" },
        { text: "KPI MTTR (Yearly)", link: "/report/kpi/mttr" },
        { text: "Break Down Report", link: "/report/kpi/breakdown" },
        { text: "Service", link: "/report/service" },
        { text: "Part Recommendation", link: "/report/part-recommendation" },
    ];

    const reportButtons = [
        { text: "Home", link: "/", icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" /> },
        { text: "PA% Monthly per Site", link: "/report/pa" },
        { text: "Pareto Down (Top 5)", link: "/report/pareto" },
        { text: "MoM Summary", link: "/report/mom" },
    ];

    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-start">
            {isReportPage ? (
                reportButtons
                    .filter((item) => item.link !== location.pathname)
                    .map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-1 sm:py-2 ${buttonColor} text-white rounded-md hover:bg-blue-600 transition duration-300 text-[10px] sm:text-xs md:text-sm whitespace-nowrap`}
                        >
                            {item.icon || null}
                            {item.text === "Home" ? null : item.text}
                        </Link>
                    ))
            ) : (
                buttons
                    .filter((item) => item.link !== location.pathname)
                    .map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-1 sm:py-2 ${buttonColor} text-white rounded-md hover:bg-blue-600 transition duration-300 text-[10px] sm:text-xs md:text-sm whitespace-nowrap`}
                        >
                            {item.text}
                        </Link>
                    ))
            )}
        </div>
    );
};

export default ActionButtons;