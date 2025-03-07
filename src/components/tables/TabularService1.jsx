import React from 'react';

const TableTabularService1 = ({ data }) => {
    if (!data) return null;
    // destructuring assignment
    const { title, headers, data: tableData } = data;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th 
                            colSpan="2"
                            className="px-4 py-2 text-left font-medium text-gray-800 border border-gray-300"
                        >
                            {title}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Baris untuk setiap header */}
                    {headers.map((header, index) => {
                        // Mendapatkan key yang sesuai dari tableData berdasarkan header
                        const dataKey = Object.keys(tableData[0])[index];
                        return (
                            <tr key={index}>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 border border-gray-300 w-1/3">
                                    {header}
                                </th>
                                <td className="px-4 py-2 text-sm border border-gray-300 bg-[#FFFF00]">
                                    {tableData[0][dataKey] || ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TableTabularService1;
