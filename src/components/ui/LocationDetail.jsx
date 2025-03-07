import React from 'react';

const LocationDetail = ({ location }) => (
  <div className="space-y-6">
    <header>
      <h3 className="text-lg font-semibold mb-1">{location.location_name}</h3>
      <p className="text-sm text-gray-500">Dikelola oleh {location.use_by}</p>
    </header>

    <section className="space-y-4">
      <h4 className="font-medium">Status Kondisi</h4>
      {location.condition_data.map((condition, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: condition.color }}
              />
              {condition.title}
            </span>
            <span>{condition.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${condition.value}%`,
                backgroundColor: condition.color
              }}
            />
          </div>
        </div>
      ))}
    </section>

    <section className="space-y-2">
      <h4 className="font-medium">Spesifikasi</h4>
      {location.detail_specification.map((spec, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-600">{spec.title}</span>
          <span>{spec.value}</span>
        </div>
      ))}
    </section>

    <section className="grid grid-cols-2 gap-2 text-sm">
      {[
        ['Provinsi', location.province],
        ['Kota', location.city],
        ['Kecamatan', location.district],
        ['Kelurahan', location.subdistrict],
        ['Site', location.site],
        ['Alamat', location.address]
      ].map(([label, value]) => (
        <React.Fragment key={label}>
          <span className="text-gray-600">{label}</span>
          <span>{value}</span>
        </React.Fragment>
      ))}
    </section>
  </div>
);

export default LocationDetail;