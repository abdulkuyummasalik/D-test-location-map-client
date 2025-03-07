import React from 'react';

const TableTabularService2 = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <tbody>
                    {data.map((row, index) => (
                        <tr 
                            key={index}
                            style={{
                                backgroundColor: row.background_color || 'white',
                                color: row.text_color || 'black'
                            }}
                        >
                            <td className="px-4 py-2 text-sm border border-gray-300">
                                {row.title}
                            </td>
                            <td className="px-4 py-2 text-sm border border-gray-300">
                                {row.model}
                            </td>
                            <td className="px-4 py-2 text-sm border border-gray-300">
                                {row.description}
                            </td>
                            <td className="px-4 py-2 text-sm border border-gray-300">
                                {row.value}
                            </td>
                            <td className="px-4 py-2 text-sm border border-gray-300">
                                {row.duration}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableTabularService2;
