import React, { useState, useMemo } from "react";

const TablePivot = ({ rowHeaders, columnHeaders, dataMatrix, title, additionalTitle }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(rowHeaders.length / itemsPerPage);
  const paginatedRowHeaders = useMemo(() => 
    rowHeaders.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage),
    [rowHeaders, currentPage, itemsPerPage]
  );
  const paginatedDataMatrix = useMemo(() => 
    dataMatrix.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage),
    [dataMatrix, currentPage, itemsPerPage]
  );

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      {additionalTitle && (
        <div className="sticky top-0 bg-white py-2 px-3 text-lg font-bold bg-gray-100 z-30 shadow-sm">
          {additionalTitle}
        </div>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 z-20">
            <tr>
              <th className="py-2 px-3 text-left font-bold sticky left-0 bg-gray-100 z-20">
                {title || ""}
              </th>
              {columnHeaders.map((header, index) => (
                <th
                  key={index}
                  className="py-2 px-3 text-center whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRowHeaders.map((rowHeader, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="py-2 px-3 bg-gray-50 text-left font-medium sticky left-0 z-10">
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

      {rowHeaders.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePivot;