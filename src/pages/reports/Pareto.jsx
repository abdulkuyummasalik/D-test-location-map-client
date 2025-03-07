import React, { useMemo, useState } from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import ActionButtons from "../../components/ui/ActionButtons";
import UnifiedChartComponent from "../../components/charts/UnifiedChartComponent";
import TableMerge from "../../components/tables/Merge";
import data from "../../data/table/data.json";
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';

const ReportPareto = () => {
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const getTitle = () => {
    let title = "PARETO SMARTROC t45 10 LF";
    if (selectedSite !== "all") {
      title += ` - ${selectedSite}`;
    }
    if (selectedMonth !== "all") {
      title += ` ${selectedMonth}`;
    }
    if (selectedYear !== "all") {
      title += ` ${selectedYear}`;
    }
    return title;
  };

  const filteredData = useMemo(() => {
    return data.data.filter(item => {
      const yearMatch = selectedYear === "all" || item.years === selectedYear;
      const monthMatch = selectedMonth === "all" || item.month === selectedMonth;
      return yearMatch && monthMatch;
    }).map((no, index) => ({
      ...no,
      no: (index + 1).toString()
    }));
  }, [selectedYear, selectedMonth]);

  const formattedDataForChart = useMemo(() => {
    return filteredData.map(item => ({
      name: item.category,
      category: item.value,
      value: item.hour
    }));
  }, [filteredData]);

  const calculateMinMax = (data, key) => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = data.map((item) => item[key]);
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const { max } = calculateMinMax(formattedDataForChart, "category");
  const { min } = calculateMinMax(formattedDataForChart, "value");

  const handleFilterChange = (filters) => {
    setSelectedSite(filters.site);
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const formattedData = filteredData.map(item => ({
      no: item.no,
      category: item.category,
      value: item.value,
      hour: item.hour,
      years: item.years,
      month: item.month,
      suspectedRootCause: item.suspectedRootCause.map(cause => cause.join(", ")).join("; "),
      breakdownDetail: item.breakdownDetail.map(detail => detail.join(", ")).join("; "),
      correctiveAction: item.correctiveAction.map(action => action.join(", ")).join("; "),
      preventiveAction: item.preventiveAction.map(action => action.join(", ")).join("; ")
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `PA_Report_${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <HeaderSection
          title="Site Summary Data"
          color="text-yellow-400"
          onRefresh={() => window.location.reload()}
          onExport={exportToExcel}
          button2="Export Excel"
        />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
          Site Data
        </h1>

        <FilterSection onFilterChange={handleFilterChange} />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
          Report <span className="text-yellow-700">Pareto Down (Top 5)</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {filteredData.length > 0 ? (
            <UnifiedChartComponent
              title={getTitle()}
              data={formattedDataForChart}
              config={{
                chartHeight: 400,
                xAxisTitle: "",
                yAxisLeftTitle: "",
                yAxisRightTitle: "",
                series1Name: "Number of Events",
                series2Name: "Hours",
                series1Type: "column",
                series2Type: "line",
                series1Color: "#2C3E50",
                series2Color: "#FFD700",
                series2LineWidth: 1,
                yAxisFormatLeft: "{value}",
                yAxisFormatRight: "{value}",
                min,
                max,
                formatTooltip: "",
                dataLabelFormat: "{y}%",
                markerLineWidth: 3,
                markerFillColor: "black",
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 text-center">
              <h2 className="text-lg sm:text-xl text-gray-600">Grafik yang cocok tidak ditemukan</h2>
              <p className="text-gray-500 mt-2">
                Tidak ada data untuk {selectedYear === "all" ? "semua tahun" : `tahun ${selectedYear}`}
                {selectedMonth === "all" ? "" : ` bulan ${selectedMonth}`}
              </p>
            </div>
          )}

          {filteredData.length > 0 ? (
            <TableMerge data={filteredData} columns={data.columns} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 text-center">
              <h2 className="text-lg sm:text-xl text-gray-600">Table yang cocok tidak ditemukan</h2>
              <p className="text-gray-500 mt-2">
                Tidak ada data untuk {selectedYear === "all" ? "semua tahun" : `tahun ${selectedYear}`}
                {selectedMonth === "all" ? "" : ` bulan ${selectedMonth}`}
              </p>
            </div>
          )}
        </div>

        <ActionButtons />
      </div>
    </div>
  );  
};

export default ReportPareto;