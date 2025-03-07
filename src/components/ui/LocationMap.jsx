import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, LayersControl, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerPeople from '../../assets/marker-people.png';
import markerKompas from '../../assets/kompas-icon.png';
import markerLokasi from '../../assets/marker.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const { BaseLayer } = LayersControl;

const userLocationIcon = new L.Icon({
  iconUrl: markerPeople,
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const locationIcon = new L.Icon({
  iconUrl: markerLokasi,
  iconSize: [30, 30],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const MapEventHandler = ({ setMapPosition }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();

      const params = new URLSearchParams(window.location.search);
      params.set('lat', center.lat.toFixed(6));
      params.set('lng', center.lng.toFixed(6));
      params.set('zoom', zoom.toString());

      window.history.replaceState({}, '', `?${params.toString()}`);

      setMapPosition({
        center: [center.lat, center.lng],
        zoom: zoom,
      });
    },
  });

  return null;
};

const LocationMap = ({ locations, onMarkerClick, setMapRef }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const initialLat = parseFloat(searchParams.get('lat')) || -2.5489;
  const initialLng = parseFloat(searchParams.get('lng')) || 118.0149;
  const initialZoom = parseInt(searchParams.get('zoom')) || 5;

  const [mapPosition, setMapPosition] = useState({
    center: [initialLat, initialLng],
    zoom: initialZoom,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Cari Lokasi Saya');

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapPosition.center, mapPosition.zoom);
    }
  }, [mapRef.current]);

  const goToAddLocation = () => {
    navigate('/add-location');
  };

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          toast.success('Lokasi berhasil ditemukan!');
        },
        (error) => {
          toast.error(`Gagal mendapatkan lokasi: ${error.message}`);
        }
      );
    } else {
      toast.error('Geolocation tidak didukung di browser ini');
    }
  };

  const handleDragEnd = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setUserLocation([lat, lng]);
    setButtonText('Lokasi Terkini');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMapRef = (map) => {
    if (map) {
      mapRef.current = map;
      setMapRef(map);
    }
  };

  return (
    <div className="h-[600px] w-full relative">
      <MapContainer
        center={mapPosition.center}
        zoom={mapPosition.zoom}
        minZoom={3}
        style={{ height: '100%', width: '100%' }}
        ref={handleMapRef}
      >
        <MapEventHandler setMapPosition={setMapPosition} />
        <LayersControl position="topleft">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </BaseLayer>
          <BaseLayer name="Google Satelite">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />
          </BaseLayer>
          <BaseLayer name="Google Terrain">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            />
          </BaseLayer>
        </LayersControl>

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={locationIcon}
            eventHandlers={{
              click: () => onMarkerClick(location),
            }}
          >
            <Popup
              onClose={() => onMarkerClick(null)}
            >
              <p><strong>{location.location_name}</strong></p>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            position={userLocation}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
            icon={userLocationIcon}
          >
            <Popup>
              <p><strong>Lokasi Anda Terkini</strong></p>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <button
        onClick={goToAddLocation}
        className="absolute bottom-29 left-4 bg-green-500 text-white px-3 py-2 z-999 rounded-md shadow-md hover:bg-green-600"
      >
        Tambah Lokasi
      </button>

      <button
        onClick={toggleModal}
        className="absolute bottom-16 left-4 bg-green-600 text-white px-3 py-2 z-999 rounded-md shadow-md hover:bg-green-700"
      >
        Legenda
      </button>

      <button
        onClick={findMyLocation}
        className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-2 z-999 rounded-md shadow-md hover:bg-blue-700"
      >
        {buttonText}
      </button>

      {userLocation && (
        <div className="absolute bottom-4 right-4 z-999 bg-white p-2 text-sm shadow-md rounded-md">
          <p><strong>Lokasi Saya:</strong></p>
          <p>Latitude: {userLocation[0]}</p>
          <p>Longitude: {userLocation[1]}</p>
        </div>
      )}

      <img
        className="absolute top-4 right-4 z-999 w-[50px] md:w-[70px] lg:w-[90px] cursor-pointer"
        src={markerKompas}
        alt="kompas img"
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-1000">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Legenda</h3>
            <p className="flex items-center mb-2">
              <img src={markerLokasi} alt="Marker Lokasi" className="w-6 h-6 mr-2" />
              Menandakan lokasi pabrik.
            </p>
            <p className="flex items-center mb-2">
              <img src={markerPeople} alt="Marker Pengguna" className="w-6 h-6 mr-2" />
              Menandakan lokasi pengguna terkini.
            </p>
            <button
              onClick={toggleModal}
              className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;