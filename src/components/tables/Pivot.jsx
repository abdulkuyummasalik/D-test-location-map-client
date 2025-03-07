import React, { useState } from "react";

const TablePivot = ({ rowHeaders, columnHeaders, dataMatrix, title }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(rowHeaders.length / itemsPerPage);
  const paginatedRowHeaders = rowHeaders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const paginatedDataMatrix = dataMatrix.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-gray-100 text-left font-bold sticky left-0">
                {title || ""}
              </th>
              {columnHeaders.map((header, index) => (
                <th
                  key={index}
                  className="py-2 px-3 bg-gray-100 text-center whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRowHeaders.map((rowHeader, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="py-2 px-3 bg-gray-50 text-left font-medium sticky left-0 z-1">
                  {rowHeader}
                </td>
                {columnHeaders.map((_, colIndex) => (
                  <td key={colIndex} className="py-2 px-3 text-center">
                    {paginatedDataMatrix[rowIndex][colIndex]}
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
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage + 1} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePivot;