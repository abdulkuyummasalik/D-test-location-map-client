import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MapPin, Plus, Save, ArrowLeft, X } from 'lucide-react';
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import LocationProvinces from '../../data/data_province.json';
import markerPeople from '../../assets/marker-people.png';
import LocationData from '../../data/data_dummy_peta.json';

const userLocationIcon = new L.Icon({
    iconUrl: markerPeople,
    iconSize: [35, 35],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
});

const AddLocationPage = ({ setLocations }) => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);
    const defaultCenter = [-2.5489, 118.0149];
    const uniqueSites = [...new Set(LocationData.map(location => location.site))];

    const initialValues = {
        use_by: '',
        location_name: '',
        latitude: '',
        longitude: '',
        site: '',
        province: '',
        city: '',
        district: '',
        subdistrict: '',
        address: '',
        condition_data: [
            { title: 'Working', description: '', color: '#008000', value: '' },
            { title: 'Idle', description: '', color: '#FFFF00', value: '' },
            { title: 'Trouble', description: '', color: '#FF0000', value: '' },
        ],
        detail_specification: [
            { title: 'Progress Building', value: '' },
            { title: 'Long Term Progress', value: '' },
            { title: 'Is Still Progress', value: '' },
        ],
    };

    const validationSchema = Yup.object({
        use_by: Yup.string().required('Use By is required'),
        location_name: Yup.string().required('Location Name is required'),
        latitude: Yup.number().required('Latitude is required').typeError('Latitude must be a number'),
        longitude: Yup.number().required('Longitude is required').typeError('Longitude must be a number'),
        province: Yup.string().required('Province is required'),
        city: Yup.string().required('City is required'),
        district: Yup.string().required('District is required'),
        subdistrict: Yup.string().required('Subdistrict is required'),
        site: Yup.string().required('Site is required'),
        address: Yup.string().required('Address is required'),
        condition_data: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required('Title is required'),
                color: Yup.string().required('Color is required'),
                value: Yup.number().required('Value is required').typeError('Value must be a number'),
            })
        ),
        detail_specification: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required('Title is required'),
                value: Yup.string().required('Value is required'),
            })
        ),
    });

    const getLocation = useCallback((setFieldValue) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setFieldValue('latitude', latitude);
                    setFieldValue('longitude', longitude);
                    toast.success('Lokasi berhasil diperoleh');
                },
                () => toast.error('Gagal mendapatkan lokasi')
            );
        } else {
            toast.error('Geolocation tidak didukung di browser ini');
        }
    }, []);

    const DraggableMarker = ({ setFieldValue, userLocation }) => {
        const [position, setPosition] = useState(userLocation || defaultCenter);

        React.useEffect(() => {
            if (userLocation) setPosition(userLocation);
        }, [userLocation]);

        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                setFieldValue('latitude', lat);
                setFieldValue('longitude', lng);
            },
        });

        return (
            <Marker
                position={position}
                icon={userLocationIcon}
                draggable
                eventHandlers={{
                    dragend(e) {
                        const { lat, lng } = e.target.getLatLng();
                        setPosition([lat, lng]);
                        setFieldValue('latitude', lat);
                        setFieldValue('longitude', lng);
                    },
                }}
            >
                <Popup>Lokasi Terkini</Popup>
            </Marker>
        );
    };

    // Fungsi tambah lokasi
    const handleAddLocation = (newLocation) => {
        setLocations((prevLocations) => [...prevLocations, newLocation]);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-lg border border-gray-100">
            <button onClick={() => navigate('/')} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Kembali ke Beranda
            </button>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">Tambah Lokasi Baru</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    try {
                        const newLocation = {
                            id: Date.now(),
                            ...values,
                            latitude: parseFloat(values.latitude),
                            longitude: parseFloat(values.longitude),
                            condition_data: values.condition_data.map(item => ({
                                ...item,
                                value: parseFloat(item.value)
                            }))
                        };
                        handleAddLocation(newLocation);
                        navigate('/');
                        toast.success('Lokasi berhasil ditambahkan');
                    } catch (error) {
                        toast.error('Gagal menyimpan lokasi');
                        console.error('Submit error:', error);
                    }
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-6">
                        {/* Location Information */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informasi Lokasi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-1.5">Use By</label>
                                    <Field name="use_by" className="w-full border rounded-md p-2.5" placeholder="Use By *" />
                                    <ErrorMessage name="use_by" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-1.5">Nama Lokasi</label>
                                    <Field name="location_name" className="w-full border rounded-md p-2.5" placeholder="Nama Lokasi *" />
                                    <ErrorMessage name="location_name" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-1.5">Latitude</label>
                                    <Field name="latitude" className="w-full border rounded-md p-2.5 bg-gray-100" disabled />
                                    <ErrorMessage name="latitude" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <div className="form-group">
                                    <label className="block text-gray-700 font-medium mb-1.5">Longitude</label>
                                    <Field name="longitude" className="w-full border rounded-md p-2.5 bg-gray-100" disabled />
                                    <ErrorMessage name="longitude" component="div" className="text-red-500 text-sm mt-1" />
                                    <button
                                        type="button"
                                        onClick={() => getLocation(setFieldValue)}
                                        className="mt-2 flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Cari Lokasi Saya
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="block text-gray-700 font-medium mb-1.5">Custom Lokasi</label>
                                <div className="border rounded-lg overflow-hidden" style={{ height: '350px' }}>
                                    <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <DraggableMarker setFieldValue={setFieldValue} userLocation={userLocation} />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Lokasi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1.5">Provinsi</label>
                                    <Select
                                        options={LocationProvinces.map(p => ({ value: p.name, label: p.name }))}
                                        value={values.province ? { value: values.province, label: values.province } : null}
                                        onChange={(option) => setFieldValue('province', option?.value || '')}
                                        className="basic-select"
                                        classNamePrefix="select"
                                        isClearable
                                        placeholder="Pilih Provinsi *"
                                    />
                                    <ErrorMessage name="province" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                
                                {values.province && (
                                    <>
                                        <div className="form-group">
                                            <label className="block text-gray-700 font-medium mb-1.5">Kota</label>
                                            <Field name="city" className="w-full border rounded-md p-2.5" placeholder="Kota *" />
                                            <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-gray-700 font-medium mb-1.5">Kecamatan</label>
                                            <Field name="district" className="w-full border rounded-md p-2.5" placeholder="Kecamatan *" />
                                            <ErrorMessage name="district" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-gray-700 font-medium mb-1.5">Kelurahan</label>
                                            <Field name="subdistrict" className="w-full border rounded-md p-2.5" placeholder="Kelurahan *" />
                                            <ErrorMessage name="subdistrict" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-gray-700 font-medium mb-1.5">Detail Alamat</label>
                                            <Field as="textarea" name="address" className="w-full border rounded-md p-2.5 h-32" placeholder="Address *" />
                                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1.5">Site</label>
                                    <Select
                                        options={uniqueSites.map(site => ({ value: site, label: site }))}
                                        value={values.site ? { value: values.site, label: values.site } : null}
                                        onChange={(option) => setFieldValue('site', option?.value || '')}
                                        className="basic-select"
                                        classNamePrefix="select"
                                        isClearable
                                        placeholder="Pilih Site *"
                                    />
                                    <ErrorMessage name="site" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Condition Data */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Condition Data</h3>
                            {values.condition_data.map((condition, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-4 bg-gray-50 rounded-lg border">
                                    <div className="md:col-span-2 flex justify-between items-center">
                                        <p className="font-medium">Condition {index + 1}</p>
                                        {values.condition_data.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFieldValue(
                                                        "condition_data",
                                                        values.condition_data.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Title</label>
                                        <Field
                                            name={`condition_data.${index}.title`}
                                            className="w-full border rounded-md p-2.5"
                                            placeholder="Title *"
                                        />
                                        <ErrorMessage
                                            name={`condition_data.${index}.title`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Description</label>
                                        <Field
                                            name={`condition_data.${index}.description`}
                                            className="w-full border rounded-md p-2.5"
                                            placeholder="Description (optional)"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Color</label>
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 mr-2 rounded border"
                                                style={{ backgroundColor: condition.color }}
                                            />
                                            <Field
                                                type="color"
                                                name={`condition_data.${index}.color`}
                                                className="w-full h-10 p-0.5 rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Value</label>
                                        <Field
                                            type="number"
                                            name={`condition_data.${index}.value`}
                                            className="w-full border rounded-md p-2.5"
                                            placeholder="Value *"
                                        />
                                        <ErrorMessage
                                            name={`condition_data.${index}.value`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setFieldValue('condition_data', [
                                        ...values.condition_data,
                                        { title: '', description: '', color: '#3b82f6', value: '' }
                                    ]);
                                }}
                                className="w-full flex items-center justify-center bg-blue-500 text-white p-2.5 rounded-md hover:bg-blue-600"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Condition
                            </button>
                        </div>

                        {/* Detail Specification */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Detail Specification</h3>
                            {values.detail_specification.map((spec, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-4 bg-gray-50 rounded-lg border">
                                    <div className="md:col-span-2 flex justify-between items-center">
                                        <p className="font-medium">Specification {index + 1}</p>
                                        {values.detail_specification.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFieldValue(
                                                        "detail_specification",
                                                        values.detail_specification.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Title</label>
                                        <Field
                                            name={`detail_specification.${index}.title`}
                                            className="w-full border rounded-md p-2.5"
                                            placeholder="Title *"
                                        />
                                        <ErrorMessage
                                            name={`detail_specification.${index}.title`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-gray-700 font-medium mb-1.5">Value</label>
                                        <Field
                                            name={`detail_specification.${index}.value`}
                                            className="w-full border rounded-md p-2.5"
                                            placeholder="Value *"
                                        />
                                        <ErrorMessage
                                            name={`detail_specification.${index}.value`}
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setFieldValue('detail_specification', [
                                        ...values.detail_specification,
                                        { title: '', value: '' }
                                    ]);
                                }}
                                className="w-full flex items-center justify-center bg-blue-500 text-white p-2.5 rounded-md hover:bg-blue-600"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Specification
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-medium flex items-center justify-center"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Kirim
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddLocationPage;