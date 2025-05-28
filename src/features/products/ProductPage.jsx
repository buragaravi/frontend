import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import ProductForm from './ProductForm';


const BASE_URL = 'https://pharmacy-stocks-backend.onrender.com/api/products';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setProducts(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeTab === 'all' || product.category === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Create product
  const handleCreate = async (productData) => {
    setLoading(true);
    try {
      const res = await axios.post(BASE_URL, productData);
      setProducts([res.data.data, ...products]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const handleUpdate = async (id, productData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, productData);
      setProducts(products.map(p => p._id === id ? res.data.data : p));
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-sea-900 to-deep-sea-700 p-6">
      <button
        className="mb-6 px-4 py-2 bg-[#0B3861] text-white rounded-lg hover:bg-[#1E88E5] transition-colors flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <span className="material-icons" style={{ fontSize: 18 }}></span>
        Back
      </button>

      {/* Glassmorphism Container */}
      <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-deep-sea-800/80 to-deep-sea-600/80 border-b border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">Product Portal</h1>
          <p className="text-blue-100/80">Manage your inventory with ease</p>
        </div>

        {/* Controls Section */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-deep-sea-700/30">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-blue-100/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-blue-100/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-6 pt-4 bg-deep-sea-800/20">
          {['all', 'chemical', 'glassware', 'others'].map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2.5 mr-2 rounded-t-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white/20 text-white border-t-2 border-cyan-300'
                  : 'text-blue-100/70 hover:bg-white/10'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-400/20 backdrop-blur-sm rounded-lg border border-red-400/30 text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
            <ProductList 
              products={filteredProducts} 
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="w-full max-w-md bg-gradient-to-br from-deep-sea-800 to-deep-sea-900 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <ProductForm 
              product={editingProduct}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
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

export default ProductPage;