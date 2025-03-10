import React, { useMemo, useState } from "react";
import HeaderSection from "../../components/ui/HeaderSection";
import FilterSection from "../../components/ui/FilterSection";
import ActionButtons from "../../components/ui/ActionButtons";
import TableTabular from "../../components/tables/Tabular";
import data from "../../data/table/data.json"
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';


const ReportMOM = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Filter data berdasarkan year dan month
  const filteredData = useMemo(() => {
    return data.dataMOM.filter(item => {
      const yearMatch = selectedYear === "all" || item.year === selectedYear;
      const monthMatch = selectedMonth === "all" || item.month === selectedMonth;
      return yearMatch && monthMatch;
    }).map((item, index) => ({  // Tambahkan index untuk penomoran baru
      ...item,
      item: (index + 1).toString() // Nomor item dimulai dari 1
    }));
  }, [selectedYear, selectedMonth]);

  // Handler untuk filter
  const handleFilterChange = (filters) => {
    setSelectedYear(filters.year);
    setSelectedMonth(filters.month);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    // Fungsi untuk membersihkan HTML tags
    const stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };

    // Transformasi data untuk Excel
    const formattedData = filteredData.map(item => ({
      No: item.item,
      What: stripHtml(item.what),
      Who: item.who,
      When: item.when
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MOM Report");

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `MOM_Report_${date}.xlsx`);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <HeaderSection
          title="Site Summary Data"
          color="text-yellow-400"
          button2="Export Excel"
          onRefresh={() => window.location.reload()}
          onExport={exportToExcel}
        />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 my-4 lg:my-6">
          Site Data
        </h1>

        <FilterSection onFilterChange={handleFilterChange} />

        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 my-4 lg:my-6">
          Report <span className="text-yellow-700">MOM Summary (Main Issue and Progress Initiative / Activity)</span>
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

        <ActionButtons />
      </div>
    </div>
  );
};

export default ReportMOM;