import React, { useState } from 'react';

const TableMerge = ({ data, columns }) => {
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-500">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-3 py-2 text-left text-[8px] md:text-xs font-medium text-dark uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => {
              const maxRows = Math.max(
                ...columns.map((column) =>
                  Array.isArray(row[column.accessor]) ? row[column.accessor].length : 1
                )
              );
              return Array.from({ length: maxRows }).map((_, detailIndex) => (
                <tr key={`${rowIndex}-${detailIndex}`} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => {
                    const cellData = row[column.accessor];
                    const isArray = Array.isArray(cellData);
                    const cellValue = isArray ? cellData[detailIndex]?.[0] || "-" : cellData;
                    if (cellValue === "-" || cellValue === "") {
                      if (detailIndex > 0) {
                        return null;
                      }
                    }
                    let rowSpan = 1;
                    if (isArray) {
                      for (let i = detailIndex + 1; i < maxRows; i++) {
                        const nextCellValue = cellData[i]?.[0] || "-";
                        if (nextCellValue === "-" || nextCellValue === "") {
                          rowSpan++;
                        } else {
                          break;
                        }
                      }
                    }
                    if (detailIndex === 0 && !isArray) {
                      return (
                        <td
                          key={colIndex}
                          rowSpan={maxRows}
                          className="px-3 py-2 whitespace-nowrap text-[8px] md:text-xs text-gray-900"
                        >
                          {cellValue}
                        </td>
                      );
                    } else if (isArray) {
                      return (
                        <td
                          key={colIndex}
                          rowSpan={rowSpan}
                          className={`px-3 py-2 text-[8px] md:text-xs text-gray-900 ${column.backgroundColor || ''}`}
                        >
                          {cellValue}
                        </td>
                      );
                    }
                    return null;
                  })}
                </tr>
              ));
            })}
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

export default TableMerge;