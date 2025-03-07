import React, { useMemo, useState } from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import ActionButtons from "../../components/ui/ActionButtons";
import UnifiedChartComponent from "../../components/charts/UnifiedChartComponent";
import TablePivot from "../../components/tables/Pivot";
import data from "../../data/table/data.json";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportKPIPA = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const getYearFromTTL = (event) => parseInt(event.slice(-2), 10);

  const filteredData = useMemo(() => {
    let result = data.dataKPIPA.filter(item => {
      const yearMatch = selectedYear === "all" || getYearFromTTL(item.event) === parseInt(selectedYear.slice(-2), 10);
      const monthMatch = selectedMonth === "all" || item.month === selectedMonth;
      return yearMatch && monthMatch;
    });

    result.sort((a, b) => getYearFromTTL(a.event) - getYearFromTTL(b.event));
    return result;
  }, [selectedYear, selectedMonth]);

  const { rowHeaders, columnHeaders, dataMatrix } = useMemo(() => {
    const rowHeaders = [...new Set(filteredData.map(item => item.title))];
    const columnHeaders = [...new Set(filteredData.map(item => item.event))];
    const dataMatrix = rowHeaders.map(() => columnHeaders.map(() => "-"));

    filteredData.forEach(item => {
      const rowIndex = rowHeaders.indexOf(item.title);
      const colIndex = columnHeaders.indexOf(item.event);
      if (rowIndex !== -1 && colIndex !== -1) {
        dataMatrix[rowIndex][colIndex] = typeof item.target === 'number'
          ? `${item.target}%`
          : `${item.target}%`;
      }
    });

    return { rowHeaders, columnHeaders, dataMatrix };
  }, [filteredData]);

  const formattedDataForChart = useMemo(() => {
    return filteredData.map(item => ({
      name: item.title,
      category: item.event,
      value: item.target
    }));
  }, [filteredData]);

  const calculateMinMax = (data, key) => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = data.map((item) => item[key]);
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const { min, max } = calculateMinMax(formattedDataForChart, "value");

  const handleFilterChange = (filters) => {
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
  };

  const exportToPDF = () => {
    try {
      if (filteredData.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      const doc = new jsPDF();

      // Judul PDF
      doc.setFontSize(18);
      doc.text("KPI PA Report", 14, 15);

      // Header tabel
      const headers = [["Title", "Date", "Value"]];

      // Data tabel
      const data = filteredData.map(item => [
        item.title,
        item.event,
        item.target,
      ]);

      // Gunakan autoTable sebagai fungsi terpisah
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [100, 149, 237] },
        margin: { top: 20 }
      });

      const date = new Date().toISOString().split('T')[0];
      doc.save(`KPI_PA_Report_${date}.pdf`);
    } catch (error) {
      toast.error('Gagal mengekspor PDF');
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <HeaderSection
          title="Machanical Availability"
          color="text-yellow-400"
          onRefresh={() => window.location.reload()}
          onExport={exportToPDF}
          button2="Export PDF"
        />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
          Site Data
        </h1>

        <FilterSection onFilterChange={handleFilterChange} />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 my-4 lg:my-6">
          Report <span className="text-yellow-700">KPI - PA% (Yearly)</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <TablePivot
            title="PA"
            rowHeaders={rowHeaders}
            columnHeaders={columnHeaders}
            dataMatrix={dataMatrix}
          />

          {filteredData.length > 0 ? (
            <UnifiedChartComponent
              title="MiningTech X100"
              data={formattedDataForChart}
              config={{
                chartHeight: 400,
                xAxisTitle: "",
                yAxisLeftTitle: "",
                yAxisRightTitle: "",
                series1Name: "",
                series2Name: "MiningTech X100",
                series2Type: "column",
                series2Color: "#B44B32",
                series2LineWidth: "",
                yAxisFormatLeft: "{value}%",
                yAxisFormatRight: "",
                min,
                max,
                formatTooltip: "%",
                dataLabelFormat: "{y}%",
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 text-center">
              <h2 className="text-lg sm:text-xl text-gray-600">Data yang cocok tidak ditemukan</h2>
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

export default ReportKPIPA;