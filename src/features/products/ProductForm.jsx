import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onCreate, onUpdate, onClose, initialName }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    thresholdValue: 0,
    category: 'chemical',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        unit: product.unit,
        thresholdValue: product.thresholdValue,
        category: product.category,
      });
    } else if (initialName) {
      setFormData((prev) => ({ ...prev, name: initialName }));
    }
  }, [product, initialName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'thresholdValue' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      onUpdate(product._id, formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Threshold Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Threshold Value</label>
          <input
            type="number"
            name="thresholdValue"
            value={formData.thresholdValue}
            onChange={handleChange}
            min="0"
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          >
            <option value="chemical">Chemical</option>
            <option value="glassware">Glassware</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition"
          >
            {product ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2 rounded-full transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
