import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Filter, Navigation } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import LocationMap from '../../components/ui/LocationMap';
import LocationDetail from '../../components/ui/LocationDetail';
import LocationProvinces from '../../data/data_province.json';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Dialog } from '@headlessui/react';

const MapPage = ({ locations = [] }) => {
  const sidebarRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const selectedId = searchParams.get('selectedId');
    if (selectedId) {
      return locations.find(loc => loc.id.toString() === selectedId);
    }
    return null;
  });
  const [showFilter, setShowFilter] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
  });

  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [filters, locations]);

  const applyFilters = () => {
    let filtered = locations.filter((location) => {
      const matchesSearch = location.location_name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesProvince = !filters.province || location.province === filters.province;
      const matchesCity = !filters.city || location.city === filters.city;
      const matchesDistrict = !filters.district || location.district === filters.district;
      const matchesSubdistrict = !filters.subdistrict || location.subdistrict === filters.subdistrict;
      return matchesSearch && matchesProvince && matchesCity && matchesDistrict && matchesSubdistrict;
    });
    setFilteredLocations(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));

    if (value) {
      let selectedLocation;
      let zoomLevel;

      switch (field) {
        case 'province':
          const selectedProvince = LocationProvinces.find(
            (province) => province.name === value
          );
          if (selectedProvince && mapRef) {
            mapRef.flyTo(
              [selectedProvince.latitude, selectedProvince.longitude],
              8,
              { duration: 1.5 }
            );
          }
          break;

        case 'city':
          selectedLocation = locations.find((loc) =>
            loc.province === filters.province &&
            loc.city === value
          );
          if (selectedLocation && mapRef) {
            mapRef.flyTo(
              [selectedLocation.latitude, selectedLocation.longitude],
              11,
              { duration: 1.5 }
            );
          }
          break;

        case 'district':
          selectedLocation = locations.find((loc) =>
            loc.province === filters.province &&
            loc.city === filters.city &&
            loc.district === value
          );
          if (selectedLocation && mapRef) {
            mapRef.flyTo(
              [selectedLocation.latitude, selectedLocation.longitude],
              13,
              { duration: 1.5 }
            );
          }
          break;

        case 'subdistrict':
          selectedLocation = locations.find((loc) =>
            loc.province === filters.province &&
            loc.city === filters.city &&
            loc.district === filters.district &&
            loc.subdistrict === value
          );
          if (selectedLocation && mapRef) {
            mapRef.flyTo(
              [selectedLocation.latitude, selectedLocation.longitude],
              15,
              { duration: 1.5 }
            );
          }
          break;
      }
    }

    if (field === 'province') {
      setFilters(prev => ({ ...prev, city: '', district: '', subdistrict: '' }));
    } else if (field === 'city') {
      setFilters(prev => ({ ...prev, district: '', subdistrict: '' }));
    } else if (field === 'district') {
      setFilters(prev => ({ ...prev, subdistrict: '' }));
    }
  };

  const handleDeleteLocation = (id) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setFilteredLocations(updatedLocations);
    setSelectedLocation(null);
    toast.success('Lokasi berhasil dihapus!');
  };

  const openDeleteModal = (location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLocationToDelete(null);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      handleDeleteLocation(locationToDelete.id);
      closeDeleteModal();
    }
  };

  const handleMarkerClick = (location) => {
    if (!location) {
      setSelectedLocation(null);
      const params = new URLSearchParams(searchParams);
      params.delete('selectedId');
      setSearchParams(params);
      return;
    }

    setSelectedLocation(location);
    const params = new URLSearchParams(searchParams);
    params.set('selectedId', location.id.toString());
    setSearchParams(params);

    if (mapRef) {
      mapRef.flyTo([location.latitude, location.longitude], 10);
    }

    // Scroll ke sidebar jika layar kecil
    if (window.innerWidth < 768 && sidebarRef.current) {
      sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
    const params = new URLSearchParams(searchParams);
    params.delete('selectedId');
    setSearchParams(params);

    setTimeout(() => {
      if (mapRef) {
        mapRef.invalidateSize();
        mapRef.closePopup();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="bg-white p-4 h-auto rounded-lg shadow-sm flex flex-wrap justify-between items-center w-full gap-2 md:gap-4">
        <h1 className="text-base md:text-2xl font-bold flex items-center gap-2">
          <MapPin className="text-blue-600 w-4 h-4 md:w-6 md:h-6" />
          <span className="text-xl font-bold">Sistem Peta</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <p className="text-sm sm:text-base md:text-xl text-gray-500 flex items-center gap-2">
            Search
          </p>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <Filter className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari lokasi..."
                className="w-full pl-10 p-2 border rounded-lg text-xs md:text-base"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <Select
              options={[{ value: '', label: 'Semua Provinsi' }, ...LocationProvinces.map(province => ({ value: province.name, label: province.name }))]}
              value={{ value: filters.province, label: filters.province || 'Semua Provinsi' }}
              onChange={(selectedOption) => {
                handleFilterChange('province', selectedOption?.value || '');
                handleFilterChange('city', '');
                handleFilterChange('district', '');
                handleFilterChange('subdistrict', '');
              }}
              isClearable
              placeholder="Pilih Provinsi"
              className="text-xs md:text-base"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />

            <Select
              options={[
                { value: '', label: 'Semua Kota/Kabupaten' },
                ...Array.from(new Set(locations.filter(loc => loc.province === filters.province).map(loc => loc.city).filter(Boolean)))
                  .map(city => ({ value: city, label: city }))
              ]}
              value={{ value: filters.city, label: filters.city || 'Semua Kota/Kabupaten' }}
              onChange={(selectedOption) => {
                handleFilterChange('city', selectedOption?.value || '');
                handleFilterChange('district', '');
                handleFilterChange('subdistrict', '');
              }}
              isClearable
              placeholder="Pilih Kota/Kabupaten"
              className="text-xs md:text-base"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              isDisabled={!filters.province}
            />

            <Select
              options={[
                { value: '', label: 'Semua Kecamatan' },
                ...Array.from(new Set(locations.filter(loc => loc.province === filters.province && loc.city === filters.city)
                  .map(loc => loc.district).filter(Boolean)))
                  .map(district => ({ value: district, label: district }))
              ]}
              value={{ value: filters.district, label: filters.district || 'Semua Kecamatan' }}
              onChange={(selectedOption) => {
                handleFilterChange('district', selectedOption?.value || '');
                handleFilterChange('subdistrict', '');
              }}
              isClearable
              placeholder="Pilih Kecamatan"
              className="text-xs md:text-base"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              isDisabled={!filters.city}
            />

            <Select
              options={[
                { value: '', label: 'Semua Kelurahan' },
                ...Array.from(new Set(locations.filter(loc =>
                  loc.province === filters.province &&
                  loc.city === filters.city &&
                  loc.district === filters.district)
                  .map(loc => loc.subdistrict).filter(Boolean)))
                  .map(subdistrict => ({ value: subdistrict, label: subdistrict }))
              ]}
              value={{ value: filters.subdistrict, label: filters.subdistrict || 'Semua Kelurahan' }}
              onChange={(selectedOption) => handleFilterChange('subdistrict', selectedOption?.value || '')}
              isClearable
              placeholder="Pilih Kelurahan"
              className="text-xs md:text-base"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              isDisabled={!filters.district}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className={`col-span-12 ${selectedLocation ? 'md:col-span-9' : 'md:col-span-12'}`}>
          <div className="bg-white rounded-lg shadow-sm">
            <LocationMap
              locations={filteredLocations}
              onMarkerClick={handleMarkerClick}
              setMapRef={setMapRef}
            />
          </div>
        </div>

        {selectedLocation && (
          <div className="col-span-12 md:col-span-3" ref={sidebarRef}> {/* Tambahkan ref di sini */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-xs md:text-base">Detail Lokasi</h2>
                <button
                  onClick={handleCloseDetail}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 max-h-136 overflow-y-auto">
                <LocationDetail location={selectedLocation} />
                <div className="flex gap-2 mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600 transition-colors"
                  >
                    <Navigation size={16} />
                    Buka di Google Maps
                  </a>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/edit-location/${selectedLocation.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDeleteModal(selectedLocation)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal} className="relative z-999">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg p-6 space-y-4 max-w-sm w-full z-999">
            <Dialog.Title className="text-lg font-bold">Hapus Lokasi</Dialog.Title>
            <Dialog.Description>
              Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan.
            </Dialog.Description>
            <div className="flex justify-end gap-2">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MapPage;