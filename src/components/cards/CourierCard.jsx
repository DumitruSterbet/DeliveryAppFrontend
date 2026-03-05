import { Icon } from "@/components";
import { classNames } from "@/lib/utils";

export default function CourierCard({ courier, className }) {
  const {
    id,
    phoneNumber,
    vehicleType,
    licensePlate,
    lat,
    lng,
    distanceKm
  } = courier;

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'motorcycle':
      case 'bike':
      case 'motorbike':
        return 'FaMotorcycle';
      case 'bicycle':
      case 'cycle':
        return 'FaBicycle';
      case 'car':
      case 'vehicle':
        return 'FaCar';
      case 'truck':
        return 'FaTruck';
      case 'van':
        return 'FaShuttleVan';
      default:
        return 'FaShippingFast';
    }
  };

  return (
    <div className={classNames(
      "bg-card rounded-xl p-4 border border-border hover:border-primary transition-colors duration-200",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon 
              name={getVehicleIcon(vehicleType)} 
              size={20} 
              className="text-primary" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-onNeutralBg">
              {vehicleType || 'Courier'}
            </h3>
            {licensePlate && (
              <p className="text-sm text-secondary">
                {licensePlate}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">
          <Icon name="MdLocationOn" size={14} />
          <span className="text-xs font-medium">
            {formatDistance(distanceKm)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {phoneNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Icon name="MdPhone" size={16} className="text-secondary" />
            <span className="text-onNeutralBg">{phoneNumber}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Icon name="MdLocationPin" size={16} className="text-secondary" />
          <span className="text-secondary">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary">Courier ID</span>
          <span className="text-xs font-mono text-onNeutralBg">
            {id.toString().slice(-8)}
          </span>
        </div>
      </div>
    </div>
  );
}