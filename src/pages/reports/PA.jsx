import { useMemo, useState } from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import ActionButtons from "../../components/ui/ActionButtons";
import UnifiedChartComponent from "../../components/charts/UnifiedChartComponent";
import data from "../../data/table/data.json";
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';
import LocationJSON from "../../data/data_dummy_peta.json";

const ReportPA = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredData = useMemo(() => {
    // Filter berdasarkan tahun dan bulan
    let filtered = data.dataPA.filter(item => {
      const yearMatch = selectedYear === "all" || item.years === selectedYear;
      const monthMatch = selectedMonth === "all" || item.month === selectedMonth;
      return yearMatch && monthMatch;
    });

    // Filter berdasarkan customer
    if (selectedCustomer) {
      // Cari customer berdasarkan ID
      const customerInfo = LocationJSON.find(loc => loc.id === selectedCustomer);
      if (customerInfo) {
        filtered = filtered.filter(item => item.customer === customerInfo.location_name);
      }
    }

    return filtered;
  }, [selectedYear, selectedMonth, selectedCustomer]);

  const calculateMinMax = (data, keys) => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = keys.flatMap(key => data.map(item => item[key]));
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const { min, max } = calculateMinMax(filteredData, ["value", "category"]);

  const handleFilterChange = (filters) => {
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
    setSelectedSite(filters.site);
    setSelectedCustomer(filters.customer);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PA Report');
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `PA_Report_${date}.xlsx`);
  };

  // Fungsi untuk membuat judul dinamis dengan urutan: site - customer - bulan - tahun
  const getDynamicTitle = () => {
    let title = "Report PA% Monthly per Site";

    if (selectedSite !== "all") {
      title += ` - ${selectedSite}`;
    }

    if (selectedCustomer) {
      const customerInfo = LocationJSON.find(loc => loc.id === selectedCustomer);
      if (customerInfo) {
        title += ` - ${customerInfo.location_name}`;
      }
    }

    if (selectedMonth !== "all") {
      title += ` - ${selectedMonth}`;
    }

    if (selectedYear !== "all") {
      title += ` - ${selectedYear}`;
    }

    return title;
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

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
          Site Data
        </h1>

        <FilterSection onFilterChange={handleFilterChange} />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 my-4 lg:my-6">
          {getDynamicTitle()}
        </h1>

        {filteredData.length > 0 ? (
          <UnifiedChartComponent
            title="Physical Availability"
            data={filteredData}
            config={{
              chartHeight: 400,
              xAxisTitle: "",
              yAxisLeftTitle: "In %",
              yAxisRightTitle: "",
              series1Name: "PA",
              series2Name: "Target",
              series1Type: "column",
              series2Type: "line",
              series1Color: "#2C3E50",
              series2Color: "#FFD700",
              series3Color: "#ff0505",
              series2LineWidth: 3,
              yAxisFormatLeft: "{value}%",
              yAxisFormatRight: "",
              min: 0,
              max: 100,
              formatTooltip: "%",
              dataLabelFormat: "{y}%",
              markerLineWidth: 2,
              markerFillColor: "white",
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10 text-center mt-4">
            <h2 className="text-lg sm:text-xl text-gray-600">Grafik yang cocok tidak ditemukan</h2>
            <p className="text-gray-500 mt-2">
              Tidak ada data untuk {selectedYear === "all" ? "semua tahun" : `tahun ${selectedYear}`}
              {selectedMonth === "all" ? "" : ` bulan ${selectedMonth}`}
              {selectedCustomer ? ` dengan customer ${LocationJSON.find(loc => loc.id === selectedCustomer)?.location_name || ""}` : ""}
            </p>
          </div>
        )}

        <ActionButtons />
      </div>
    </div>
  );
};

export default ReportPA;