import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import LocationJSON from "../../data/data_dummy_peta.json";

const FilterSection = ({ onFilterChange }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const sites = [...new Set(LocationJSON.map(loc => loc.site))];
    const siteOptions = [
        { value: "all", label: "Semua Site" },
        ...sites.map(site => ({
            value: site,
            label: site
        }))
    ];

    const [selectedSite, setSelectedSite] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");

    const customerOptions = LocationJSON
        .filter(loc => selectedSite === "all" || loc.site === selectedSite)
        .map(loc => ({
            value: loc.id,
            label: loc.location_name,
            site: loc.site
        }));

    const yearOptions = [
        { value: "all", label: "All Years" },
        ...Array.from({ length: 6 }, (_, i) => ({
            value: (2025 - i).toString(),
            label: (2025 - i).toString()
        }))
    ];

    const monthOptions = [
        { value: "all", label: "All Months" },
        ...["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ].map(month => ({
            value: month,
            label: month
        }))
    ];

    const hideMonthFilter = [
        "/report/kpi/pa",
        "/report/kpi/mtbs",
        "/report/kpi/mttr",
        "/report/part-recommendation"
    ];

    const handleSiteChange = (selected) => {
        const newSite = selected ? selected.value : "all";
        setSelectedSite(newSite);
        setSelectedCustomer(null);

        onFilterChange({
            site: newSite,
            customer: null,
            year: selectedYear,
            month: selectedMonth
        });
    };

    const handleCustomerChange = (selected) => {
        setSelectedCustomer(selected);
        onFilterChange({
            site: selectedSite,
            customer: selected ? selected.value : null,
            year: selectedYear,
            month: selectedMonth
        });
    };

    const handleYearChange = (selected) => {
        const newYear = selected ? selected.value : "all";
        setSelectedYear(newYear);
        onFilterChange({
            site: selectedSite,
            customer: selectedCustomer ? selectedCustomer.value : null,
            year: newYear,
            month: selectedMonth
        });
    };

    const handleMonthChange = (selected) => {
        const newMonth = selected ? selected.value : "all";
        setSelectedMonth(newMonth);
        onFilterChange({
            site: selectedSite,
            customer: selectedCustomer ? selectedCustomer.value : null,
            year: selectedYear,
            month: newMonth
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-xs sm:text-sm font-medium mb-1">Site:</label>
                        <Select
                            options={siteOptions}
                            value={siteOptions.find(option => option.value === selectedSite)}
                            onChange={handleSiteChange}
                            isClearable
                            placeholder="Pilih site..."
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    fontSize: '0.875rem',
                                    minHeight: '38px'
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-xs sm:text-sm font-medium mb-1">Customer:</label>
                        <Select
                            options={customerOptions}
                            value={selectedCustomer}
                            onChange={handleCustomerChange}
                            isClearable
                            isDisabled={selectedSite === "all"}
                            placeholder={selectedSite === "all" ? "Pilih site terlebih dahulu" : "Semua customer"}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    fontSize: '0.875rem',
                                    minHeight: '38px'
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-xs sm:text-sm font-medium mb-1">by Year:</label>
                        <Select
                            options={yearOptions}
                            value={yearOptions.find(option => option.value === selectedYear)}
                            onChange={handleYearChange}
                            isClearable
                            placeholder="Pilih tahun..."
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    fontSize: '0.875rem',
                                    minHeight: '38px'
                                }),
                                menu: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                        />
                    </div>
                    {!hideMonthFilter.includes(currentPath) && (
                        <div>
                            <label className="block text-gray-600 text-xs sm:text-sm font-medium mb-1">by Month:</label>
                            <Select
                                options={monthOptions}
                                value={monthOptions.find(option => option.value === selectedMonth)}
                                onChange={handleMonthChange}
                                isClearable
                                placeholder="Pilih bulan..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem',
                                        minHeight: '38px'
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999
                                    })
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterSection;