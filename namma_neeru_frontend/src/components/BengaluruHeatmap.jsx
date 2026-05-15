import React, { useState, useEffect, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import wardDataUrl from '../data/BBMP_oldWards.geojson?url';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "dummy_token_to_prevent_crash_in_dev";

const emptyMapStyle = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#ffffff'
      }
    }
  ]
};

const BengaluruHeatmap = () => {
  const [geoData, setGeoData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    fetch(wardDataUrl)
      .then((res) => res.json())
      .then((data) => {
        // Augment data with risk values based on longitude to create a west-to-east gradient
        const augmentedFeatures = data.features.map((feature) => {
          let lon = 77.6; // default fallback
          try {
            if (feature.geometry.type === 'MultiPolygon') {
              lon = feature.geometry.coordinates[0][0][0][0];
            } else if (feature.geometry.type === 'Polygon') {
              lon = feature.geometry.coordinates[0][0][0];
            }
          } catch (e) {
            console.error('Error parsing coordinates', e);
          }

          // Map lon roughly from 77.45 (West) to 77.75 (East) to a 0-100 scale
          const normalizedLon = Math.max(0, Math.min(1, (lon - 77.45) / (77.75 - 77.45)));
          
          // Base score + some organic noise to make it look natural
          let riskScore = Math.floor(normalizedLon * 100);
          riskScore = Math.floor(Math.max(0, Math.min(100, riskScore + (Math.random() * 30 - 15))));

          let crisisLevel = 'Good';
          let availability = 'High';

          if (riskScore > 85) {
            crisisLevel = 'Critical';
            availability = 'Very Low';
          } else if (riskScore > 65) {
            crisisLevel = 'Low';
            availability = 'Low';
          } else if (riskScore > 40) {
            crisisLevel = 'Moderate';
            availability = 'Medium';
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              riskScore,
              crisisLevel,
              availability
            }
          };
        });

        setGeoData({ ...data, features: augmentedFeatures });
      });
  }, []);

  const dataLayer = useMemo(() => {
    return {
      id: 'data',
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'riskScore'],
          0, '#3B82F6',    // Good (Deep Blue)
          30, '#93C5FD',   // Good (Light Blue)
          50, '#FEF08A',   // Moderate (Yellow)
          75, '#F97316',   // Low (Orange)
          100, '#EF4444'   // Critical (Red)
        ],
        'fill-opacity': 0.95,
        'fill-outline-color': '#ffffff' // thin white borders
      }
    };
  }, []);

  const onHover = (event) => {
    const {
      features,
      point: { x, y }
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x,
            y
          }
        : null
    );
  };

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "dummy_token_to_prevent_crash_in_dev") {
    return (
      <div className="w-full h-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <p className="font-bold mb-2">Mapbox Token Missing</p>
        <p className="text-sm">Please add VITE_MAPBOX_TOKEN to your .env file to view the maps.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      <Map
        initialViewState={{
          longitude: 77.5946,
          latitude: 13.00, // Shifted slightly north for better view of all wards
          zoom: 10,
          pitch: 0,
          bearing: 0
        }}
        mapStyle={emptyMapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
        attributionControl={false}
      >
        {geoData && (
          <Source type="geojson" data={geoData}>
            <Layer {...dataLayer} />
          </Source>
        )}
      </Map>

      {hoverInfo && (
        <div
          className="absolute z-50 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-premium border border-surface-border pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          <div className="flex flex-col gap-1 min-w-[150px]">
            <h4 className="font-bold text-sm text-content-primary mb-1 border-b border-surface-border pb-1">
              {hoverInfo.feature.properties.WARD_NAME || 'Unknown Ward'}
            </h4>
            <div className="flex justify-between items-center text-xs">
              <span className="text-content-secondary">Risk Score:</span>
              <span className="font-bold text-content-primary">{hoverInfo.feature.properties.riskScore}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-content-secondary">Availability:</span>
              <span className={`font-bold ${
                hoverInfo.feature.properties.availability === 'Very Low' || hoverInfo.feature.properties.availability === 'Low' ? 'text-red-500' : 
                hoverInfo.feature.properties.availability === 'Medium' ? 'text-amber-500' : 'text-blue-500'
              }`}>{hoverInfo.feature.properties.availability}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-content-secondary">Crisis Level:</span>
              <span className={`font-bold ${
                hoverInfo.feature.properties.crisisLevel === 'Critical' ? 'text-red-500' : 
                hoverInfo.feature.properties.crisisLevel === 'Low' ? 'text-orange-500' :
                hoverInfo.feature.properties.crisisLevel === 'Moderate' ? 'text-amber-500' : 'text-blue-500'
              }`}>{hoverInfo.feature.properties.crisisLevel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BengaluruHeatmap;
