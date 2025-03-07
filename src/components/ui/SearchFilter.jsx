import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari lokasi..."
          className="w-full pl-10 p-2 border rounded-lg"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      {['province', 'city', 'district', 'subdistrict'].map((field) => (
        <select
          key={field}
          className="w-full p-2 border rounded-lg"
          value={filters[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          <option value="">{`Semua ${field}`}</option>
          {[...new Set(INITIAL_LOCATIONS.map(loc => loc[field]))].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default SearchFilter;