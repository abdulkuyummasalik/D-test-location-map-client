import React, {useState, useMemo} from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import TableTabular from "../../components/tables/Tabular";
import tableDataTabular from "../../data/table/data_example_tabular.json";
import ButtonComponent from "../../components/ui/ActionButtons";

const ReportPartRecomendationPage = () => {
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const filteredData = useMemo(() => {
        return tableDataTabular.filter(item => {
            const yearMatch = selectedYear === "all" || String(item.year) === String(selectedYear);
            const monthMatch = selectedMonth === "all" || String(item.month) === String(selectedMonth);
            return yearMatch && monthMatch;
        }).map(item => ({
            ...item,
            Quantity: Number(item.Quantity).toFixed(0),
            HRS: Number(item.HRS).toFixed(0)
        }));
    }, [selectedYear, selectedMonth]);
    

    // Handler untuk filter
    const handleFilterChange = (filters) => {
        setSelectedYear(filters.year);
        setSelectedMonth(filters.month);
    };
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <HeaderSection
                    title="Part Proposal"
                    color="text-yellow-400"
                    button2="Export PDF"
                    onRefresh={() => window.location.reload()}
                    onExport={() => console.log("Exported")}
                />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
                    Site Data
                </h1>

                <FilterSection onFilterChange={handleFilterChange} />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
                    Report <span className="text-yellow-700">Part Recommendation</span>
                </h1>

                {filteredData.length > 0 ? (
                <TableTabular
                    data={filteredData.map(({ year, month, ...rest }) => rest)}
                />
                ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-4">
                    <h2 className="text-xl text-gray-600">Data yang cocok tidak ditemukan</h2>
                    <p className="text-gray-500 mt-2">
                    Tidak ada data untuk {selectedYear === "all" ? "semua tahun" : `tahun ${selectedYear}`}
                    {selectedMonth === "all" ? "" : ` bulan ${selectedMonth}`}
                    </p>
                </div>
                )}

                <ButtonComponent />
            </div>
        </div>
    );
};

export default ReportPartRecomendationPage;
