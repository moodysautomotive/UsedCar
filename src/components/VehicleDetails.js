import React, { useState } from 'react';

function VehicleDetails({ vehicle, onUpdate }) {
  const [newPart, setNewPart] = useState({ name: '', cost: '', supplier: '' });
  const [sellingPrice, setSellingPrice] = useState('');
  const [editingPartIndex, setEditingPartIndex] = useState(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const addPart = (e) => {
    e.preventDefault();
    if (newPart.name && newPart.cost && newPart.supplier) {
      const updatedVehicle = {
        ...vehicle,
        parts: [...vehicle.parts, { ...newPart, cost: parseFloat(newPart.cost) }]
      };
      onUpdate(updatedVehicle);
      setNewPart({ name: '', cost: '', supplier: '' });
    }
  };

  const startEditing = (index) => {
    setEditingPartIndex(index);
    setNewPart(vehicle.parts[index]);
  };

  const cancelEditing = () => {
    setEditingPartIndex(null);
    setNewPart({ name: '', cost: '', supplier: '' });
  };

  const updatePart = (e) => {
    e.preventDefault();
    if (editingPartIndex !== null && newPart.name && newPart.cost && newPart.supplier) {
      const updatedParts = [...vehicle.parts];
      updatedParts[editingPartIndex] = { ...newPart, cost: parseFloat(newPart.cost) };
      const updatedVehicle = {
        ...vehicle,
        parts: updatedParts
      };
      onUpdate(updatedVehicle);
      setEditingPartIndex(null);
      setNewPart({ name: '', cost: '', supplier: '' });
    }
  };

  const deletePart = (index) => {
    const updatedParts = vehicle.parts.filter((_, i) => i !== index);
    const updatedVehicle = {
      ...vehicle,
      parts: updatedParts
    };
    onUpdate(updatedVehicle);
  };

  const toggleReadyForSale = () => {
    onUpdate({
      ...vehicle,
      readyForSale: !vehicle.readyForSale
    });
  };

  const markAsSold = (e) => {
    e.preventDefault();
    if (sellingPrice) {
      const updatedVehicle = {
        ...vehicle,
        sold: true,
        sellingPrice: parseFloat(sellingPrice),
        readyForSale: false
      };
      onUpdate(updatedVehicle);
      setSellingPrice('');
    }
  };

  const startEditingPrice = () => {
    setSellingPrice(vehicle.sellingPrice?.toString() || '');
    setIsEditingPrice(true);
  };

  const updateSellingPrice = (e) => {
    e.preventDefault();
    if (sellingPrice) {
      const updatedVehicle = {
        ...vehicle,
        sold: true,
        readyForSale: false,
        parts: [...vehicle.parts],
        sellingPrice: parseFloat(sellingPrice)
      };
      onUpdate(updatedVehicle);
      setIsEditingPrice(false);
    }
  };

  const cancelEditingPrice = () => {
    setIsEditingPrice(false);
    setSellingPrice('');
  };

  const totalCost = parseFloat(vehicle.cost) + 
    vehicle.parts.reduce((sum, part) => sum + parseFloat(part.cost), 0);
  
  const profit = vehicle.sellingPrice ? vehicle.sellingPrice - totalCost : 0;

  return (
    <div className="vehicle-details">
      <h2>Vehicle Details</h2>
      <div className="details-content">
        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p>VIN: {vehicle.vin}</p>
        <p>Initial Cost: ${parseFloat(vehicle.cost).toFixed(2)}</p>
        
        <div className="parts-section">
          <h4>Parts Added</h4>
          <form onSubmit={editingPartIndex !== null ? updatePart : addPart} className="add-part">
            <input
              type="text"
              placeholder="Part name"
              value={newPart.name}
              onChange={(e) => setNewPart({...newPart, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Supplier"
              value={newPart.supplier}
              onChange={(e) => setNewPart({...newPart, supplier: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Cost"
              value={newPart.cost}
              onChange={(e) => setNewPart({...newPart, cost: e.target.value})}
              required
            />
            {editingPartIndex !== null ? (
              <>
                <button type="submit">Update Part</button>
                <button type="button" onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <button type="submit">Add Part</button>
            )}
          </form>
          
          <ul className="parts-list">
            {vehicle.parts.map((part, index) => (
              <li key={index} className="part-item">
                <span>{part.name} - {part.supplier} - ${parseFloat(part.cost).toFixed(2)}</span>
                <div className="part-actions">
                  <button type="button" onClick={() => startEditing(index)}>Edit</button>
                  <button type="button" onClick={() => deletePart(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="financial-summary">
          <p><strong>Total Cost: ${totalCost.toFixed(2)}</strong></p>
          {vehicle.sold ? (
            <>
              {isEditingPrice ? (
                <form onSubmit={updateSellingPrice} className="edit-price-section">
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="New Selling Price"
                    step="0.01"
                    min="0"
                    required
                  />
                  <button type="submit">Update Price</button>
                  <button type="button" onClick={cancelEditingPrice} className="cancel-btn">Cancel</button>
                </form>
              ) : (
                <>
                  <p>
                    Selling Price: ${parseFloat(vehicle.sellingPrice).toFixed(2)}
                    <button type="button" onClick={startEditingPrice} className="edit-price-btn">
                      Edit Price
                    </button>
                  </p>
                  <p>Profit: ${profit.toFixed(2)}</p>
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={toggleReadyForSale}>
                {vehicle.readyForSale ? 'Mark as In Progress' : 'Mark as Ready for Sale'}
              </button>
              {vehicle.readyForSale && (
                <div className="sell-section">
                  <input
                    type="number"
                    placeholder="Selling Price"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    required
                  />
                  <button type="button" onClick={markAsSold}>Mark as Sold</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;