import React, { useState, useEffect } from 'react';
import VehicleForm from './components/VehicleForm';
import VehicleList from './components/VehicleList';
import VehicleDetails from './components/VehicleDetails';
import './App.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  }, []);

  const saveVehicle = (vehicle) => {
    const newVehicles = [...vehicles, { ...vehicle, id: Date.now(), parts: [], readyForSale: false }];
    setVehicles(newVehicles);
    localStorage.setItem('vehicles', JSON.stringify(newVehicles));
  };

  const updateVehicle = (updatedVehicle) => {
    const updatedVehicles = vehicles.map(v => 
      v.id === updatedVehicle.id ? updatedVehicle : v
    );
    setVehicles(updatedVehicles);
    setSelectedVehicle(updatedVehicle); // Update the selected vehicle as well
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
  };

  const deleteVehicle = (vehicleId) => {
    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    if (selectedVehicle && selectedVehicle.id === vehicleId) {
      setSelectedVehicle(null);
    }
  };

  return (
    <div className="App">
      <h1>Used Car Inventory Management</h1>
      <div className="container">
        <VehicleForm onSave={saveVehicle} />
        <VehicleList 
          vehicles={vehicles} 
          onSelect={setSelectedVehicle}
          onDelete={deleteVehicle}
        />
        {selectedVehicle && (
          <VehicleDetails 
            vehicle={selectedVehicle} 
            onUpdate={updateVehicle}
          />
        )}
      </div>
    </div>
  );
}

export default App;
