import { useState } from "react";
import { Icon, Button, CourierMap } from "@/components";
import { CourierCard } from "@/components/cards";
import { classNames } from "@/lib/utils";

export default function CourierSection({ 
  couriers = [], 
  isLoading = false, 
  error = null, 
  className,
  onRefresh = null,
  showRefreshButton = true 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayedCouriers = isExpanded ? couriers : couriers.slice(0, 3);
  const hasMoreCouriers = couriers.length > 3;

  if (isLoading) {
    return (
      <div className={classNames("bg-card rounded-xl p-6 shadow-sm", className)}>
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-pulse bg-primary/20 rounded-lg w-8 h-8"></div>
          <div className="animate-pulse bg-primary/20 rounded h-6 w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-primary/10 rounded w-16"></div>
                      <div className="h-3 bg-primary/10 rounded w-12"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-green-100 dark:bg-green-900/20 rounded w-12"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-primary/10 rounded w-24"></div>
                  <div className="h-4 bg-primary/10 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classNames("bg-card rounded-xl p-6 shadow-sm", className)}>
        <div className="flex items-center gap-3 mb-4">
          <Icon name="MdLocalShipping" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-onNeutralBg">Nearest Couriers</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8">
          <Icon name="MdError" size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-onNeutralBg mb-2">Unable to Load Couriers</h3>
          <p className="text-secondary text-center max-w-md mb-4">
            We couldn't fetch the nearest couriers. Please check your location settings or try again.
          </p>
          {onRefresh && (
            <Button
              label="Try Again"
              variant="contained"
              className="px-4 py-2"
              onClick={onRefresh}
            />
          )}
        </div>
      </div>
    );
  }

  if (!couriers || couriers.length === 0) {
    return (
      <div className={classNames("bg-card rounded-xl p-6 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="MdLocalShipping" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-onNeutralBg">Nearest Couriers</h2>
          </div>
          {onRefresh && showRefreshButton && (
            <Button
              label="Refresh"
              variant="outlined"
              size="sm"
              className="px-3 py-2"
              onClick={onRefresh}
              icon="MdRefresh"
            />
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center py-8">
          <Icon name="MdLocationSearching" size={48} className="text-secondary mb-4" />
          <h3 className="text-lg font-semibold text-onNeutralBg mb-2">No Couriers Found</h3>
          <p className="text-secondary text-center max-w-md">
            There are no couriers available in your area at the moment. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("bg-card rounded-xl p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="MdLocalShipping" size={24} className="text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-onNeutralBg">Nearest Couriers</h2>
            <p className="text-secondary text-sm">
              {couriers.length} courier{couriers.length !== 1 ? 's' : ''} available in your area
            </p>
          </div>
        </div>

        {onRefresh && showRefreshButton && (
          <Button
            label="Refresh"
            variant="outlined"
            size="sm"
            className="px-3 py-2"
            onClick={onRefresh}
            icon="MdRefresh"
          />
        )}
      </div>

      <div className="space-y-6">
        <CourierMap 
          couriers={couriers}
          height="680px"
          zoom={16}
          onCourierSelect={(courier) => {
            console.log('Selected courier:', courier);
          }}
        />

        <div className="flex gap-4 overflow-x-auto pb-2">
          {displayedCouriers.map((courier) => (
            <CourierCard 
              key={courier.id} 
              courier={courier}
              className="h-full min-w-[320px] flex-shrink-0"
            />
          ))}
        </div>

        {hasMoreCouriers && (
          <div className="text-center">
            <Button
              label={isExpanded ? "Show Less" : `Show ${couriers.length - 3} More`}
              variant="outlined"
              className="px-6 py-2"
              onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? "MdKeyboardArrowUp" : "MdKeyboardArrowDown"}
            />
          </div>
        )}
      </div>
    </div>
  );
}