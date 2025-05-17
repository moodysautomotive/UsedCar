import React, { useState } from 'react';

function VehicleForm({ onSave }) {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    vin: '',
    mileage: '',
    cost: '',
    location: '',  // Add this line
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image before storing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxSize = 800;
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG format
          const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
          setImagePreview(compressedImage);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, image: imagePreview });
    setFormData({ year: '', make: '', model: '', vin: '', mileage: '', cost: '' });
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <h2>Add New Vehicle</h2>
      <input
        type="text"
        name="year"
        placeholder="Year"
        value={formData.year}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="make"
        placeholder="Make"
        value={formData.make}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={formData.model}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="vin"
        placeholder="VIN"
        value={formData.vin}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Vehicle Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="mileage"
        placeholder="Mileage"
        value={formData.mileage}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="cost"
        placeholder="Cost"
        value={formData.cost}
        onChange={handleChange}
        required
      />
      <div className="vehicle-image-upload">
        <input
          type="file"
          id="vehicle-image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="vehicle-image">Upload Vehicle Image</label>
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Vehicle preview" 
            className="vehicle-image-preview"
          />
        )}
      </div>
      <button type="submit">Add Vehicle</button>
    </form>
  );
}

export default VehicleForm;