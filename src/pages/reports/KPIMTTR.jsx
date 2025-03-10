import React, { useMemo, useState } from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import ActionButtons from "../../components/ui/ActionButtons";
import UnifiedChartComponent from "../../components/charts/UnifiedChartComponent";
import TablePivot from "../../components/tables/Pivot";
import data from "../../data/table/data.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import LocationJSON from "../../data/data_dummy_peta.json";

const ReportKPIMTTR = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getYearFromTTL = (date) => parseInt(date.slice(-2), 10);

  const filteredData = useMemo(() => {
    let result = data.dataKPIMTTR.filter((item) => {
      const yearMatch = selectedYear === "all" || getYearFromTTL(item.date) === parseInt(selectedYear.slice(-2), 10);
      const monthMatch = selectedMonth === "all" || item.month === selectedMonth;
      let customerMatch = true;
      if (selectedCustomer) {
        const customerInfo = LocationJSON.find(loc => loc.id === selectedCustomer);
        if (customerInfo) {
          customerMatch = item.customer === customerInfo.location_name;
        }
      }
      return yearMatch && monthMatch && customerMatch;
    });

    result.sort((a, b) => getYearFromTTL(a.date) - getYearFromTTL(b.date));
    return result;
  }, [selectedYear, selectedMonth, selectedCustomer]);

  const { rowHeaders, columnHeaders, dataMatrix } = useMemo(() => {
    const rowHeaders = [...new Set(filteredData.map((item) => item.name))];
    const columnHeaders = [...new Set(filteredData.map((item) => item.date))];
    const dataMatrix = rowHeaders.map(() => columnHeaders.map(() => "-"));

    filteredData.forEach((item) => {
      const rowIndex = rowHeaders.indexOf(item.name);
      const colIndex = columnHeaders.indexOf(item.date);
      if (rowIndex !== -1 && colIndex !== -1) {
        dataMatrix[rowIndex][colIndex] = typeof item.value === "number" ? item.value.toFixed(2) : item.value;
      }
    });

    return { rowHeaders, columnHeaders, dataMatrix };
  }, [filteredData]);

  const formattedDataForChart = useMemo(() => {
    return filteredData.map((item) => ({
      name: item.name,
      category: item.date,
      value: item.value,
    }));
  }, [filteredData]);

  const calculateMinMax = (data, key) => {
    if (data.length === 0) return { min: 0, max: 10 };
    const values = data.map((item) => item[key]);
    return { min: Math.min(...values) - 1, max: Math.max(...values) + 1 };
  };

  const { min, max } = calculateMinMax(formattedDataForChart, "value");

  const handleFilterChange = (filters) => {
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
    setSelectedSite(filters.site);
    setSelectedCustomer(filters.customer);
  };

  const exportToPDF = () => {
    try {
      if (filteredData.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("KPI MTTR Report", 14, 15);

      const headers = [["Name", "Date", "Value", "Month"]];

      const data = filteredData.map(item => [
        item.name,
        item.date,
        item.value,
        item.month
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [100, 149, 237] },
        margin: { top: 20 }
      });

      const date = new Date().toISOString().split('T')[0];
      doc.save(`KPI_MTTR_Report_${date}.pdf`);
    } catch (error) {
      toast.error('Gagal mengekspor PDF');
      console.error('Error exporting PDF:', error);
    }
  };

  const getDynamicTitle = () => {
    let title = "Report KPI - MTTR";

    if (selectedCustomer) {
      const customerInfo = LocationJSON.find(loc => loc.id === selectedCustomer);
      if (customerInfo) {
        title += ` - ${customerInfo.location_name}`;
      }
    }

    if (selectedSite !== "all") {
      title += ` - ${selectedSite}`;
    }

    if (selectedYear !== "all") {
      title += ` - ${selectedYear}`;
    }

    if (selectedMonth !== "all") {
      title += ` - ${selectedMonth}`;
    }

    return title;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <HeaderSection
          title="Mean Time To Repair"
          color="text-yellow-400"
          button2="Export PDF"
          onRefresh={() => window.location.reload()}
          onExport={exportToPDF}
        />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
          Site Data
        </h1>

        <FilterSection onFilterChange={handleFilterChange} />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
          {getDynamicTitle()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <TablePivot
            title="MTTR"
            rowHeaders={rowHeaders}
            columnHeaders={columnHeaders}
            dataMatrix={dataMatrix}
          />

          {filteredData.length > 0 ? (
            <UnifiedChartComponent
              title="4x Drilling"
              data={formattedDataForChart}
              categories={categories}
              config={{
                chartHeight: 400,
                xAxisTitle: "",
                yAxisLeftTitle: "",
                yAxisRightTitle: "",
                series1Name: "",
                series2Name: "4x Drilling",
                series2Type: "column",
                series2Color: "#B44B32",
                series2LineWidth: "",
                yAxisFormatLeft: "{value}.00%",
                yAxisFormatRight: "",
                min,
                max,
                formatTooltip: "%",
                dataLabelFormat: "{y}"
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 text-center">
              <h2 className="text-lg sm:text-xl text-gray-600">Data yang cocok tidak ditemukan</h2>
              <p className="text-gray-500 mt-2">
                Tidak ada data untuk {selectedYear === "all" ? "semua tahun" : `tahun ${selectedYear}`}
                {selectedMonth === "all" ? "" : ` bulan ${selectedMonth}`}
                {selectedCustomer ? ` dengan customer ${LocationJSON.find(loc => loc.id === selectedCustomer)?.location_name || ""}` : ""}
              </p>
            </div>
          )}
        </div>

        <ActionButtons />
      </div>
    </div>
  );
};

export default ReportKPIMTTR;