import React from 'react';

function VehicleList({ vehicles, onSelect, onDelete }) {
  return (
    <div className="vehicle-list">
      <h2>Vehicle Inventory</h2>
      {vehicles.map(vehicle => {
        const totalPartsCost = vehicle.parts.reduce((sum, part) => sum + parseFloat(part.cost), 0);
        
        return (
          <div 
            key={vehicle.id} 
            className={`vehicle-item ${vehicle.readyForSale ? 'ready-for-sale' : ''} ${vehicle.sold ? 'sold' : ''}`}
          >
            <div className="vehicle-item-content" onClick={() => onSelect(vehicle)}>
              {vehicle.image ? (
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                  className="vehicle-image"
                />
              ) : (
                <div className="vehicle-image" />
              )}
              <div className="vehicle-details-compact">
                <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <div className="vehicle-info-grid">
                  <span>VIN: {vehicle.vin}</span>
                  <span>Mileage: {vehicle.mileage || 'N/A'}</span>
                  <span>Cost: ${parseFloat(vehicle.cost).toFixed(2)}</span>
                  <span>Location: {vehicle.location || 'N/A'}</span>
                  <span>Parts Total: ${totalPartsCost.toFixed(2)}</span>
                </div>
                <p className="status">Status: {vehicle.sold ? 'Sold' : vehicle.readyForSale ? 'Ready for Sale' : 'In Progress'}</p>
                {vehicle.sold && vehicle.sellingPrice && (
                  <p className="profit">
                    Profit: ${(vehicle.sellingPrice - vehicle.cost - totalPartsCost).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <button 
              className="delete-vehicle-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(vehicle.id);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default VehicleList;