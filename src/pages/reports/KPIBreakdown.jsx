import React from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import TableTabular from "../../components/tables/Tabular";
import tableDataTabular from "../../data/table/3data_example.json";
import ButtonComponent from "../../components/ui/ActionButtons";

const ReportKPIBreakdownPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <HeaderSection
                    title="Mean Time To Repair"
                    color="text-yellow-400"
                    button2="Export PDF"
                    onRefresh={() => window.location.reload()}
                    onExport={() => console.log("Exported")}
                />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
                    Site Data
                </h1>

                <FilterSection onFilterChange={() => { }} />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
                    Report <span className="text-yellow-700">Breakdown Report</span>
                </h1>
        
                <TableTabular data={tableDataTabular} />

                <ButtonComponent />
            </div>
        </div>
    );
};

export default ReportKPIBreakdownPage;
