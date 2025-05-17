import React, { useState } from 'react';

function VehicleDetails({ vehicle, onUpdate }) {
  const [newPart, setNewPart] = useState({ name: '', cost: '' });
  const [sellingPrice, setSellingPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddPart = (e) => {
    e.preventDefault();
    if (!newPart.name || !newPart.cost) return;

    const updatedVehicle = {
      ...vehicle,
      parts: [...vehicle.parts, { ...newPart, id: Date.now() }]
    };
    onUpdate(updatedVehicle);
    setNewPart({ name: '', cost: '' });
  };

  const handleDeletePart = (partId) => {
    const updatedVehicle = {
      ...vehicle,
      parts: vehicle.parts.filter(part => part.id !== partId)
    };
    onUpdate(updatedVehicle);
  };

  const handleMarkReady = () => {
    onUpdate({ ...vehicle, readyForSale: true });
  };

  const handleSell = () => {
    if (!sellingPrice) return;
    onUpdate({ 
      ...vehicle, 
      sold: true, 
      sellingPrice: parseFloat(sellingPrice)
    });
  };

  const totalPartsCost = vehicle.parts.reduce((sum, part) => sum + parseFloat(part.cost), 0);
  const totalCost = parseFloat(vehicle.cost) + totalPartsCost;

  return (
    <div className="vehicle-details">
      <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
      <div className="vehicle-info">
        <p><strong>VIN:</strong> {vehicle.vin}</p>
        <p><strong>Mileage:</strong> {vehicle.mileage}</p>
        <p><strong>Purchase Cost:</strong> ${parseFloat(vehicle.cost).toFixed(2)}</p>
        <p><strong>Location:</strong> {vehicle.location || 'N/A'}</p>
      </div>

      <div className="parts-section">
        <h4>Parts Added</h4>
        <form onSubmit={handleAddPart} className="add-part">
          <input
            type="text"
            placeholder="Part Name"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cost"
            value={newPart.cost}
            onChange={(e) => setNewPart({ ...newPart, cost: e.target.value })}
          />
          <button type="submit">Add Part</button>
        </form>

        <div className="parts-list">
          {vehicle.parts.map(part => (
            <div key={part.id} className="part-item">
              <span>{part.name} - ${parseFloat(part.cost).toFixed(2)}</span>
              <div className="part-actions">
                <button onClick={() => handleDeletePart(part.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="financial-summary">
        <p><strong>Total Parts Cost:</strong> ${totalPartsCost.toFixed(2)}</p>
        <p><strong>Total Investment:</strong> ${totalCost.toFixed(2)}</p>
        
        {!vehicle.sold && (
          <>
            {!vehicle.readyForSale ? (
              <button onClick={handleMarkReady}>Mark as Ready for Sale</button>
            ) : (
              <div className="sell-section">
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
                <button onClick={handleSell}>Complete Sale</button>
              </div>
            )}
          </>
        )}
        
        {vehicle.sold && (
          <p>
            <strong>Sold for:</strong> ${parseFloat(vehicle.sellingPrice).toFixed(2)}
            <br />
            <strong>Profit:</strong> ${(vehicle.sellingPrice - totalCost).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

export default VehicleDetails;