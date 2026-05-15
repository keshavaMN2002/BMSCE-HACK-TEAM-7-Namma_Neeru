import React, { useRef, useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTankerStore } from '../../store/tankerStore';
import truckImg from '../../assets/truck.png';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "dummy_token_to_prevent_crash_in_dev";

// Bengaluru center
const INITIAL_VIEW_STATE = {
  longitude: 77.5946,
  latitude: 12.9716,
  zoom: 11,
  pitch: 45, // Slight pitch for 3D/cinematic feel
  bearing: -10
};

// Route Line styling for Mapbox
const routeLayer = {
  id: 'route-line',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#2563EB',
    'line-width': 5,
    'line-opacity': 0.8
  }
};

const MapboxWrapper = ({ children, showRoute = false, routeCoordinates = [] }) => {
  const mapRef = useRef();
  const tankers = useTankerStore(state => state.tankers);

  // Convert route coordinates to GeoJSON for Mapbox
  const routeGeoJSON = useMemo(() => {
    if (!showRoute || routeCoordinates.length === 0) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoordinates.map(coord => [coord.lng, coord.lat])
      }
    };
  }, [showRoute, routeCoordinates]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "dummy_token_to_prevent_crash_in_dev") {
    return (
      <div className="w-full h-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <p className="font-bold mb-2">Mapbox Token Missing</p>
        <p className="text-sm">Please add VITE_MAPBOX_TOKEN to your .env file to view the maps.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        {/* Render Route */}
        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* Render Tankers */}
        {tankers.map((tanker) => (
          <Marker 
            key={tanker.id} 
            longitude={tanker.location.lng} 
            latitude={tanker.location.lat} 
            anchor="bottom"
          >
            {/* Custom Tanker Icon */}
            <div className={`relative flex items-center justify-center transition-transform duration-1000 ${tanker.status === 'On Delivery' ? 'scale-110' : 'scale-100 hover:scale-110 cursor-pointer'}`}>
              <img 
                src={truckImg} 
                alt="Tanker" 
                className={`w-12 h-auto drop-shadow-xl ${tanker.status === 'On Delivery' ? 'brightness-105' : 'opacity-90'}`}
              />
              {tanker.status === 'On Delivery' && (
                <div className="absolute -bottom-1 w-8 h-3 bg-primary-blue/30 blur-sm rounded-[100%] animate-pulse"></div>
              )}
            </div>
          </Marker>
        ))}

        {children}
      </Map>
    </div>
  );
};

export default React.memo(MapboxWrapper);
