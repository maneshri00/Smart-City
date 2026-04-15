import React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import useStore from '../../store/useStore';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHVtbXkiLCJhIjoiY2x4eXh5eHl6eHl6eHl6eHl6In0.dummy'; // Mock token placeholder

export default function MapboxView() {
  const sensorData = useStore(state => state.sensorData);
  const [selectedZone, setSelectedZone] = React.useState(null);

  // Mock markers
  const zones = [
    { id: 'Z1', lat: 40.7128, lng: -74.0060, name: 'Downtown Sector' },
    { id: 'Z2', lat: 40.7200, lng: -73.9900, name: 'Industrial Park' },
    { id: 'Z3', lat: 40.7000, lng: -74.0200, name: 'Residential Blocks' },
  ];

  return (
    <div className="w-full h-full relative">
      {!MAPBOX_TOKEN.includes('dummy') ? (
          <Map
            initialViewState={{
              longitude: -74.0060,
              latitude: 40.7128,
              zoom: 12
            }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {zones.map(z => (
              <Marker key={z.id} longitude={z.lng} latitude={z.lat} anchor="bottom">
                 <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer" onClick={() => setSelectedZone(z)} />
              </Marker>
            ))}

            {selectedZone && (
              <Popup longitude={selectedZone.lng} latitude={selectedZone.lat} onClose={() => setSelectedZone(null)}>
                <div className="text-slate-900 font-sans p-1">
                   <h4 className="font-bold">{selectedZone.name}</h4>
                   <p className="text-xs">Live AQI: <span className="font-semibold text-blue-600">85</span></p>
                </div>
              </Popup>
            )}
          </Map>
      ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-slate-700">
             <div className="text-center p-8 bg-slate-800 rounded-xl shadow-xl">
                 <p className="font-medium text-lg text-slate-300">Mapbox Setup Required</p>
                 <p className="text-slate-500 text-sm mt-2 max-w-sm">Please set a valid MAPBOX_TOKEN in MapboxView.jsx to view the geospatial map layer.</p>
             </div>
          </div>
      )}
    </div>
  );
}
