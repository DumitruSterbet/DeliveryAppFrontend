import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from '@/components';
import { classNames } from '@/lib/utils';

// MapController to handle map updates
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      console.log('MapController: Setting view to:', center, 'zoom:', zoom);
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iIzM5OGZmZiIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iIzM5OGZmZiIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPgo=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Create custom courier icon
const createCourierIcon = (vehicleType, isActive = false) => {
  // Use simple colored markers for now to ensure they render
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
  
  const color = colors[vehicleType?.toLowerCase()] || colors.default;
  
  try {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'courier-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  } catch (error) {
    console.error('Failed to create custom icon:', error);
    // Fallback to default marker
    return new L.Icon.Default();
  }
};

export default function CourierMap({ 
  couriers = [], 
  center = null,
  zoom = 15, // Increased default zoom for better visibility
  height = '400px',
  className,
  onCourierSelect = null
}) {
  const [userLocation, setUserLocation] = useState(null);
  
  // Debug logging
  console.log('CourierMap - couriers data:', couriers);
  console.log('CourierMap - center:', center);
  console.log('CourierMap - couriers length:', couriers.length);
  
  // Calculate map center
  const mapCenter = React.useMemo(() => {
    console.log('Calculating map center...');
    console.log('center prop:', center);
    console.log('userLocation:', userLocation);
    console.log('couriers:', couriers);
    
    if (center) {
      console.log('Using provided center:', center);
      return center;
    }
    if (userLocation) {
      console.log('Using user location:', userLocation);
      return userLocation;
    }
    if (couriers && couriers.length > 0) {
      const firstCourier = couriers[0];
      const lat = parseFloat(firstCourier.lat);
      const lng = parseFloat(firstCourier.lng);
      
      console.log('First courier raw coordinates:', firstCourier.lat, firstCourier.lng);
      console.log('First courier parsed coordinates:', lat, lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log('Using first courier location:', [lat, lng]);
        return [lat, lng];
      }
    }
    // Use Chisinau, Moldova as default (close to your coordinates)
    console.log('Using Moldova default location');
    return [47.0105, 28.8638];
  }, [center, userLocation, couriers]);

  useEffect(() => {
    // Try to get user's current location
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

  return (
    <div className={classNames(
      "courier-map-container rounded-xl overflow-hidden border border-border",
      className
    )}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
        key={`${mapCenter[0]}-${mapCenter[1]}-${zoom}`} // Force re-render when center changes
      >
        <MapController center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Test marker with known coordinates - LARGE AND RED */}
        <Marker 
          position={[47.0105, 28.8638]}
          icon={L.divIcon({
            html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.5);"></div>',
            className: 'test-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })}
        >
          <Popup>
            <div className="text-center">
              <strong>TEST MARKER</strong><br/>
              Coords: 47.0105, 28.8638<br/>
              This should be visible!
            </div>
          </Popup>
        </Marker>
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={L.divIcon({
              html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
              className: 'user-location-marker',
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Courier markers */}
        {Array.isArray(couriers) && couriers.map((courier, index) => {
          console.log(`Rendering courier ${index}:`, courier);
          console.log(`Courier coordinates: lat=${courier.lat}, lng=${courier.lng}`);
          console.log(`Coordinates type: lat=${typeof courier.lat}, lng=${typeof courier.lng}`);
          
          // Validate coordinates
          const lat = parseFloat(courier.lat);
          const lng = parseFloat(courier.lng);
          
          if (isNaN(lat) || isNaN(lng)) {
            console.error(`Invalid coordinates for courier ${courier.id}: lat=${courier.lat}, lng=${courier.lng}`);
            return null;
          }
          
          // Bounds check for reasonable coordinates
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.error(`Out of bounds coordinates for courier ${courier.id}: lat=${lat}, lng=${lng}`);
            return null;
          }
          
          return (
            <Marker
              key={`courier-${courier.id}-${index}`}
              position={[lat, lng]}
              icon={L.divIcon({
                html: `<div style="background-color: blue; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                className: 'courier-marker',
                iconSize: [25, 25],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
              })}
              eventHandlers={{
                click: () => {
                  console.log('Courier marker clicked:', courier);
                  if (onCourierSelect) {
                    onCourierSelect(courier);
                  }
                }
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs">
                        {courier.vehicleType?.charAt(0).toUpperCase() || 'C'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">
                        {courier.vehicleType || 'Courier'}
                      </h4>
                      <span className="text-xs text-green-600 font-medium">
                        {courier.distanceKm ? formatDistance(courier.distanceKm) : 'Distance unknown'}
                      </span>
                    </div>
                  </div>
                  
                  {courier.licensePlate && (
                    <div className="text-xs text-gray-600 mb-1">
                      License: {courier.licensePlate}
                    </div>
                  )}
                  
                  {courier.phoneNumber && (
                    <div className="text-xs text-gray-600 mb-1">
                      Phone: {courier.phoneNumber}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    ID: {courier.id ? courier.id.toString().slice(-8) : 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Coords: {lat.toFixed(4)}, {lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}