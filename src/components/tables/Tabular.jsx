import React, { useState } from "react";

const TableTabular = ({ data }) => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="min-w-full text-[10px] sm:text-xs md:text-sm border border-[#C4B5A5]">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-800 uppercase tracking-wider bg-[#E6D5B8] border border-[#C4B5A5]"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={
                                    rowIndex % 2 === 0
                                        ? "bg-[#F5EEE6]"
                                        : "bg-[#F9F5F0] hover:bg-[#E6D5B8]"
                                }
                            >
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-4 sm:px-6 py-2 sm:py-3 text-gray-800 border border-[#E6D5B8]"
                                    >
                                        {header === "what" ? (
                                            <div dangerouslySetInnerHTML={{ __html: row[header] }} />
                                        ) : typeof row[header] === "number" ? (
                                            row[header].toFixed(2)
                                        ) : (
                                            row[header]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-[10px] sm:text-xs md:text-sm"
                    >
                        Previous
                    </button>
                    <span className="text-[10px] sm:text-xs md:text-sm">Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-[10px] sm:text-xs md:text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TableTabular;