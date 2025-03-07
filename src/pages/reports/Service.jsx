import React from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import TableTabularService1 from "../../components/tables/TabularService1";
import TableTabularService2 from "../../components/tables/TabularService2";
import tableDataService1 from "../../data/table/data_example_service.json";
import tableDataService2 from "../../data/table/4data_example_leveling_ver1.json";
import ButtonComponent from "../../components/ui/ActionButtons";

const ReportServicePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <HeaderSection
                    title="Drill Data Details"
                    color="text-yellow-400"
                    button2="Export Excel"
                    onRefresh={() => window.location.reload()}
                    onExport={() => console.log("Exported")}
                />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
                    Site Data
                </h1>

                <FilterSection onFilterChange={() => { }} />

                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
                    Report <span className="text-yellow-700">Service</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <TableTabularService1 data={tableDataService1} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Report Down Report per Drill</h3>
                        <TableTabularService2 data={tableDataService2} />
                    </div>
                </div>

                <ButtonComponent />
            </div>
        </div>
    )
};

export default ReportServicePage;
