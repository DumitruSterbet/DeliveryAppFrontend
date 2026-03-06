import React from 'react';
import CourierMap from '../components/CourierMap';
import { CourierSection } from '../components/sections';

// Sample courier data for testing
const sampleCouriers = [
  {
    id: 'f9394554',
    phoneNumber: '+1234567890',
    vehicleType: 'motorcycle',
    licensePlate: 'ABC123',
    lat: 47.0105,
    lng: 28.8638,
    distanceKm: 0.0
  },
  {
    id: 'a1234567',
    phoneNumber: '+1987654321',
    vehicleType: 'bicycle',
    licensePlate: 'BIC789',
    lat: 47.0125,
    lng: 28.8658,
    distanceKm: 0.2
  },
  {
    id: 'b9876543',
    phoneNumber: '+1555666777',
    vehicleType: 'car',
    licensePlate: 'CAR456',
    lat: 47.0085,
    lng: 28.8618,
    distanceKm: 0.15
  },
  {
    id: 'c1112233',
    phoneNumber: '+1444555666',
    vehicleType: 'van',
    licensePlate: 'VAN321',
    lat: 47.0145,
    lng: 28.8678,
    distanceKm: 0.35
  }
];

export default function CourierMapDemo() {
  const handleRefresh = () => {
    console.log('Refreshing courier data...');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-onNeutralBg mb-4">
            Courier Location Demo
          </h1>
          <p className="text-secondary max-w-2xl mx-auto">
            This demo shows the courier tracking interface with an interactive map. 
            You can switch between List and Map views using the toggle buttons.
            The map shows courier locations with custom markers based on vehicle type.
          </p>
        </div>

        <CourierSection 
          couriers={sampleCouriers}
          isLoading={false}
          error={null}
          onRefresh={handleRefresh}
          showRefreshButton={true}
        />

        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-onNeutralBg mb-4">
            Sample Map View Only
          </h3>
          <CourierMap 
            couriers={sampleCouriers}
            center={[47.0105, 28.8638]}
            zoom={15}
            height="400px"
            onCourierSelect={(courier) => {
              alert(`Selected courier: ${courier.vehicleType} - ${courier.id}`);
            }}
          />
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-onNeutralBg mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-onNeutralBg mb-2">Map Features:</h4>
              <ul className="space-y-1 text-secondary">
                <li>• Interactive courier markers</li>
                <li>• Vehicle type icons (🏍️ 🚲 🚗 🚐)</li>
                <li>• User location detection</li>
                <li>• Popup with courier details</li>
                <li>• Distance calculations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-onNeutralBg mb-2">List Features:</h4>
              <ul className="space-y-1 text-secondary">
                <li>• Courier cards with details</li>
                <li>• Distance display</li>
                <li>• Phone numbers</li>
                <li>• License plates</li>
                <li>• Expand/collapse view</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}