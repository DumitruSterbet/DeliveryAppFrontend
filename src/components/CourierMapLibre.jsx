import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { classNames } from '@/lib/utils';

export default function CourierMapLibre({ 
  couriers = [], 
  center = null,
  zoom = 15,
  height = '400px',
  className,
  onCourierSelect = null
}) {
  const hasAutoCentered = useRef(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState("https://tiles.openfreemap.org/styles/liberty");
  const [viewState, setViewState] = useState({
    longitude: 28.8638,
    latitude: 47.0105,
    zoom: 15
  });

  // Available map styles with street-level detail
  const mapStyles = {
    "liberty": "https://tiles.openfreemap.org/styles/liberty", // OpenStreetMap style with buildings
    "osm-bright": "https://tiles.openfreemap.org/styles/bright", // Bright daylight style  
    "positron": "https://tiles.openfreemap.org/styles/positron", // Light style
    "basic": "https://demotiles.maplibre.org/style.json" // Fallback basic style
  };

  // Debug logging
  console.log('CourierMapLibre - couriers data:', couriers);
  console.log('CourierMapLibre - center:', center);
  console.log('CourierMapLibre - couriers length:', couriers.length);

  // Calculate map center and update viewState
  // Rules:
  // 1) If explicit center is passed, always honor it.
  // 2) Otherwise, prefer courier location over user/store location.
  // 3) Auto-center only once to avoid map jumping on every SignalR update.
  useEffect(() => {
    let newCenter = null;
    
    if (center) {
      newCenter = { longitude: center[1], latitude: center[0] };
    } else if (couriers && couriers.length > 0) {
      const firstCourier = couriers[0];
      const lat = parseFloat(firstCourier.lat);
      const lng = parseFloat(firstCourier.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        newCenter = { longitude: lng, latitude: lat };
      }
    } else if (userLocation) {
      newCenter = { longitude: userLocation[1], latitude: userLocation[0] };
    }
    
    if (newCenter) {
      const shouldForceCenter = Boolean(center);
      const shouldAutoCenterOnce = !hasAutoCentered.current;

      if (shouldForceCenter || shouldAutoCenterOnce) {
        console.log('MapLibre: Setting center to:', newCenter);
        setViewState(prev => ({
          ...prev,
          longitude: newCenter.longitude,
          latitude: newCenter.latitude,
          zoom: zoom
        }));
        hasAutoCentered.current = true;
      }
    }
  }, [center, userLocation, couriers, zoom]);

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation && !center) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.warn('Could not get user location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, [center]);

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const getMarkerColor = (vehicleType) => {
    const colors = {
      'motorcycle': '#ff4444',
      'bike': '#ff4444', 
      'motorbike': '#ff4444',
      'bicycle': '#44ff44',
      'cycle': '#44ff44',
      'car': '#4444ff',
      'vehicle': '#4444ff',
      'truck': '#ff8844',
      'van': '#8844ff',
      'default': '#44ffff'
    };
    return colors[vehicleType?.toLowerCase()] || colors.default;
  };

  const getVehicleEmoji = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'motorcycle':
      case 'bike':
      case 'motorbike':
        return '🏍️';
      case 'bicycle':
      case 'cycle':
        return '🚲';
      case 'car':
      case 'vehicle':
        return '🚗';
      case 'truck':
        return '🚚';
      case 'van':
        return '🚐';
      default:
        return '📦';
    }
  };

  return (
    <div className={classNames(
      "courier-map-container rounded-xl overflow-hidden border border-border",
      className
    )}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height}}
        mapStyle={mapStyle}
        attributionControl={false}
        onError={(evt) => {
          console.warn('Map style failed to load:', evt, 'Trying fallback...');
          // Try fallback style if main one fails
          if (mapStyle !== mapStyles.basic) {
            setMapStyle(mapStyles.basic);
          }
        }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        
        {/* Map Style Selector */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'white',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '8px',
          zIndex: 1000
        }}>
          <select 
            value={Object.keys(mapStyles).find(key => mapStyles[key] === mapStyle) || 'liberty'}
            onChange={(e) => setMapStyle(mapStyles[e.target.value])}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="liberty">🏢 Streets & Buildings</option>
            <option value="osm-bright">☀️ Bright Style</option>
            <option value="positron">🌙 Light Style</option>
            <option value="basic">🗺️ Basic Style</option>
          </select>
        </div>

        {/* Test marker with known coordinates */}
        <Marker 
          longitude={28.8638} 
          latitude={47.0105}
          color="red"
        >
          <div 
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'red',
              border: '3px solid white',
              boxShadow: '0 3px 6px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCourier('test');
            }}
          >
            🎯
          </div>
        </Marker>

        {/* User location marker */}
        {userLocation && (
          <Marker 
            longitude={userLocation[1]} 
            latitude={userLocation[0]}
            color="blue"
          >
            <div 
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  animation: 'pulse 2s infinite'
                }}
              />
            </div>
          </Marker>
        )}
        
        {/* Courier markers */}
        {Array.isArray(couriers) && couriers.map((courier, index) => {
          console.log(`MapLibre rendering courier ${index}:`, courier);
          
          // Validate coordinates
          const lat = parseFloat(courier.lat);
          const lng = parseFloat(courier.lng);
          
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinates for courier ${courier.id}: lat=${courier.lat}, lng=${courier.lng}`);
            return null;
          }
          
          // Bounds check
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.error(`Out of bounds coordinates for courier ${courier.id}: lat=${lat}, lng=${lng}`);
            return null;
          }
          
          const markerColor = getMarkerColor(courier.vehicleType);
          const emoji = getVehicleEmoji(courier.vehicleType);
          
          return (
            <React.Fragment key={`courier-${courier.id}-${index}`}>
              <Marker 
                longitude={lng} 
                latitude={lat}
                color={markerColor}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: markerColor,
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourier(courier);
                    if (onCourierSelect) {
                      onCourierSelect(courier);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </div>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Popups */}
        {selectedCourier && selectedCourier !== 'test' && (
          <Popup
            longitude={parseFloat(selectedCourier.lng)}
            latitude={parseFloat(selectedCourier.lat)}
            onClose={() => setSelectedCourier(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="300px"
          >
            <div className="p-3 bg-white text-black">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {getVehicleEmoji(selectedCourier.vehicleType)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {selectedCourier.vehicleType || 'Courier'}
                  </h4>
                  <span className="text-xs text-green-600 font-medium">
                    {selectedCourier.distanceKm ? formatDistance(selectedCourier.distanceKm) : 'Distance unknown'}
                  </span>
                </div>
              </div>
              
              {selectedCourier.licensePlate && (
                <div className="text-xs text-gray-600 mb-1">
                  <strong>License:</strong> {selectedCourier.licensePlate}
                </div>
              )}
              
              {selectedCourier.phoneNumber && (
                <div className="text-xs text-gray-600 mb-1">
                  <strong>Phone:</strong> {selectedCourier.phoneNumber}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mb-1">
                <strong>ID:</strong> {selectedCourier.id ? selectedCourier.id.toString().slice(-8) : 'Unknown'}
              </div>
              <div className="text-xs text-gray-500">
                <strong>Location:</strong> {parseFloat(selectedCourier.lat).toFixed(4)}, {parseFloat(selectedCourier.lng).toFixed(4)}
              </div>
            </div>
          </Popup>
        )}

        {selectedCourier === 'test' && (
          <Popup
            longitude={28.8638}
            latitude={47.0105}
            onClose={() => setSelectedCourier(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-3 bg-white text-black text-center">
              <strong>🎯 TEST MARKER</strong><br/>
              <small>Coords: 47.0105, 28.8638</small><br/>
              <small>MapLibre GL JS Working!</small>
            </div>
          </Popup>
        )}
      </Map>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}