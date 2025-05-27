import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const BASE_URL = 'http://localhost:7000/api/products';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setProducts(res.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category) => {
    if (category === 'all') {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/category/${category}`);
      setProducts(res.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products by category');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL, productData);
      setProducts([res.data.data, ...products]);
      setError(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, productData);
      setProducts(products.map(p => p._id === id ? res.data.data : p));
      setError(null);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    fetchProductsByCategory(category);
  };

  const filteredProducts = (products || []).filter(product =>
    product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Skeleton loader for table rows
  const ProductTableSkeleton = ({ rows = 6 }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white/40">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Details</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[...Array(rows)].map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300/80" />
                  <div className="ml-4">
                    <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-28 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-block h-4 w-12 bg-gray-300 rounded mr-2" />
                <div className="inline-block h-4 w-12 bg-gray-200 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="backdrop-blur-lg bg-white/60 rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-white/80 to-gray-100 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your inventory with precision</p>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/70 backdrop-blur text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full text-white font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-6 pt-4 bg-white/30">
          {['all', 'chemical', 'glassware', 'others'].map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2.5 mr-2 rounded-t-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                currentCategory === tab
                  ? 'bg-white text-blue-600 border-t-2 border-blue-400'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => handleCategoryChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {loading ? (
            <ProductTableSkeleton rows={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-700">No products found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filters</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Details</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.unit}</div>
                        <div className="text-sm text-gray-500">Threshold: {product.thresholdValue}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <ProductForm 
              product={editingProduct}
              onCreate={handleCreateProduct}
              onUpdate={handleUpdateProduct}
              onClose={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
