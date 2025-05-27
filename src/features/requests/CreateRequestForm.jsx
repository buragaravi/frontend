import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ExperimentSelector from './ExperimentSelector';
import { toast } from 'react-toastify';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:7000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Constants for theming
const THEME = {
  background: 'bg-gradient-to-br from-[#F5F9FD] to-[#E1F1FF]',
  card: 'bg-white',
  border: 'border-[#0B3861]',
  primaryText: 'text-[#0B3861]',
  secondaryText: 'text-[#0B3861 ]',
  primaryBg: 'bg-[#0B3861]',
  secondaryBg: 'bg-[#0B3861 ]',
  hoverBg: 'hover:bg-[#1E88E5]',
  inputFocus: 'focus:ring-[#0B3861] focus:border-[#0B3861]'
};

// Lab IDs array
const LAB_IDS = [
  'LAB01',
  'LAB02',
  'LAB03',
  'LAB04',
  'LAB05',
  'LAB06',
  'LAB07',
  'LAB08'
];

// SVG Icons
const ExperimentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ChemicalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const CreateRequestForm = () => {
  const queryClient = useQueryClient();
  const [labId, setLabId] = useState('');
  const [experiments, setExperiments] = useState([
    {
      experimentId: '',
      experimentName: '',
      date: '',
      session: 'morning',
      chemicals: [
        {
          chemicalName: '',
          quantity: '',
          unit: '',
          chemicalMasterId: '',
          suggestions: [],
          showSuggestions: false,
          availableQuantity: null,
        },
      ],
    },
  ]);

  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (requestData) => {
      const response = await api.post('/requests', requestData);
      return response.data;
    },
    onSuccess: (data) => {
      const msg = data?.message || data?.msg || 'Request created successfully!';
      setTimeout(() => toast.success(msg, { autoClose: 4000 }), 100); // Ensure toast renders after state update
      setTimeout(() => {
        setLabId('');
        setExperiments([{
          experimentId: '',
          experimentName: '',
          date: '',
          session: 'morning',
          chemicals: [{
            chemicalName: '',
            quantity: '',
            unit: '',
            chemicalMasterId: '',
            suggestions: [],
            showSuggestions: false,
            availableQuantity: null,
          }],
        }]);
      }, 200);
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.response?.data?.msg || error?.message || 'Failed to create request';
      setTimeout(() => toast.error(`Request unsuccessful: ${msg}`, { autoClose: 5000 }), 100);
    },
  });

  const handleExperimentSelect = (index, experiment) => {
    const newExperiments = [...experiments];
    newExperiments[index] = {
      ...newExperiments[index],
      experimentId: experiment.experimentId,
      experimentName: experiment.experimentName,
      // Pre-fill chemicals from default chemicals if available
      chemicals: experiment.defaultChemicals.map(chem => ({
        chemicalName: chem.chemicalName,
        quantity: chem.quantity,
        unit: chem.unit,
        chemicalMasterId: '',
        suggestions: [],
        showSuggestions: false,
        availableQuantity: null,
      })) || [{
        chemicalName: '',
        quantity: '',
        unit: '',
        chemicalMasterId: '',
        suggestions: [],
        showSuggestions: false,
        availableQuantity: null,
      }],
    };
    setExperiments(newExperiments);
  };

  const handleExperimentChange = (index, field, value) => {
    const newExperiments = [...experiments];
    newExperiments[index][field] = value;
    setExperiments(newExperiments);
  };

  const handleChemicalChange = (expIndex, chemIndex, field, value) => {
    const newExperiments = [...experiments];
    newExperiments[expIndex].chemicals[chemIndex][field] = value;
    setExperiments(newExperiments);
  };

  const handleChemicalSearch = async (expIndex, chemIndex, searchTerm) => {
    handleChemicalChange(expIndex, chemIndex, 'chemicalName', searchTerm);
    
    if (!searchTerm.trim()) {
      const updated = [...experiments];
      updated[expIndex].chemicals[chemIndex] = {
        ...updated[expIndex].chemicals[chemIndex],
        suggestions: [],
        showSuggestions: false,
        availableQuantity: null
      };
      setExperiments(updated);
      return;
    }

    try {
      const response = await api.get(`/chemicals/central/available?search=${searchTerm}`);
      const suggestions = response.data.map(item => ({
        name: item.chemicalName,
        unit: item.unit,
        id: item._id,
        availableQuantity: item.quantity,
      }));

      const updated = [...experiments];
      updated[expIndex].chemicals[chemIndex] = {
        ...updated[expIndex].chemicals[chemIndex],
        suggestions,
        showSuggestions: true,
      };
      setExperiments(updated);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to search chemicals');
    }
  };

  const handleChemicalSelect = (expIndex, chemIndex, suggestion) => {
    const updated = [...experiments];
    updated[expIndex].chemicals[chemIndex] = {
      chemicalName: suggestion.name,
      unit: suggestion.unit,
      chemicalMasterId: suggestion.id,
      quantity: '',
      suggestions: [],
      showSuggestions: false,
      availableQuantity: suggestion.availableQuantity,
    };
    setExperiments(updated);
  };

  const handleFocus = (expIndex, chemIndex) => {
    const updated = [...experiments];
    const chemical = updated[expIndex].chemicals[chemIndex];
    if (chemical.chemicalName.trim() && chemical.suggestions.length > 0) {
      chemical.showSuggestions = true;
      setExperiments(updated);
    }
  };

  const handleBlur = (expIndex, chemIndex) => {
    setTimeout(() => {
      const updated = [...experiments];
      updated[expIndex].chemicals[chemIndex].showSuggestions = false;
      setExperiments(updated);
    }, 200);
  };

  const addExperiment = () => {
    setExperiments([
      ...experiments,
      {
        experimentId: '',
        experimentName: '',
        date: '',
        session: 'morning',
        chemicals: [
          {
            chemicalName: '',
            quantity: '',
            unit: '',
            chemicalMasterId: '',
            suggestions: [],
            showSuggestions: false,
            availableQuantity: null,
          },
        ],
      },
    ]);
  };

  const addChemical = (expIndex) => {
    const newExperiments = [...experiments];
    newExperiments[expIndex].chemicals.push({
      chemicalName: '',
      quantity: '',
      unit: '',
      chemicalMasterId: '',
      suggestions: [],
      showSuggestions: false,
      availableQuantity: null,
    });
    setExperiments(newExperiments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate lab selection
    if (!labId) {
      toast.error('Please select a lab');
      return;
    }

    // Validate experiments
    if (experiments.length === 0) {
      toast.error('Please add at least one experiment');
      return;
    }

    // Validate each experiment
    for (const exp of experiments) {
      if (!exp.experimentId || !exp.date || !exp.session) {
        toast.error('Please fill in all experiment details');
        return;
      }

      // Validate chemicals
      if (exp.chemicals.length === 0) {
        toast.error('Please add at least one chemical for each experiment');
        return;
      }

      for (const chem of exp.chemicals) {
        if (!chem.chemicalName || !chem.quantity || !chem.unit) {
          toast.error('Please fill in all chemical details');
          return;
        }

        if (isNaN(chem.quantity) || Number(chem.quantity) <= 0) {
          toast.error('Please enter a valid quantity for chemicals');
          return;
        }
      }
    }

    const formatted = {
      labId,
      experiments: experiments.map(exp => ({
        experimentId: exp.experimentId,
        experimentName: exp.experimentName,
        date: exp.date,
        session: exp.session,
        chemicals: exp.chemicals.map(chem => ({
          chemicalMasterId: chem.chemicalMasterId,
          quantity: Number(chem.quantity),
          chemicalName: chem.chemicalName,
          unit: chem.unit,
        })),
      })),
    };

    createRequestMutation.mutate(formatted);
  };

  const renderChemicalInput = (expIndex, chemIndex) => {
    const chemical = experiments[expIndex].chemicals[chemIndex];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="relative">
          <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>Chemical Name</label>
          <input
            type="text"
            placeholder="Search chemical"
            value={chemical.chemicalName}
            onChange={(e) => handleChemicalSearch(expIndex, chemIndex, e.target.value)}
            onFocus={() => handleFocus(expIndex, chemIndex)}
            onBlur={() => handleBlur(expIndex, chemIndex)}
            required
            className={`w-full px-3 py-2 text-sm md:text-base border ${THEME.border} rounded-lg ${THEME.inputFocus} transition-colors`}
          />
          {chemical.showSuggestions && chemical.suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border border-[#E8D8E1] rounded-lg bg-white shadow-lg max-h-60 overflow-auto">
              {chemical.suggestions.map((sug, idx) => (
                <li
                  key={`suggestion-${expIndex}-${chemIndex}-${idx}`}
                  className="px-3 py-2 text-sm hover:bg-[#F9F3F7] cursor-pointer border-b border-[#E8D8E1] last:border-b-0"
                  onClick={() => handleChemicalSelect(expIndex, chemIndex, sug)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{sug.name}</span>
                    <span className="text-xs bg-[#F0E6EC] text-[#6D123F] px-2 py-1 rounded">
                      Available: {sug.availableQuantity} {sug.unit}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={chemical.quantity}
            onChange={(e) => handleChemicalChange(expIndex, chemIndex, 'quantity', e.target.value)}
            required
            className={`w-full px-3 py-2 text-sm md:text-base border ${THEME.border} rounded-lg ${THEME.inputFocus} transition-colors`}
            max={chemical.availableQuantity || undefined}
          />
          {chemical.availableQuantity !== null && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span>Available: {chemical.availableQuantity} {chemical.unit}</span>
              {chemical.quantity > chemical.availableQuantity && (
                <span className="ml-2 text-red-500 font-medium">
                  (Exceeds available quantity)
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>Unit</label>
          <input
            type="text"
            placeholder="Unit"
            value={chemical.unit}
            readOnly
            className="w-full px-3 py-2 text-sm md:text-base border border-[#E8D8E1] rounded-lg bg-gray-100"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen ${THEME.background}`}>
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 ${THEME.card} border ${THEME.border}`}>
          <div className="flex items-center mb-6">
            <div className={`${THEME.primaryBg} p-2 rounded-lg mr-2`}>
              <ExperimentIcon />
            </div>
            <h2 className={`text-xl md:text-2xl font-bold ${THEME.secondaryText}`}>Create New Request</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>Lab ID</label>
              <select
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                required
                className={`w-full px-3 py-2 text-sm md:text-base border ${THEME.border} rounded-lg ${THEME.inputFocus} transition-colors`}
              >
                <option value="">Select Lab</option>
                {LAB_IDS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            {experiments.map((experiment, expIndex) => (
              <div key={`experiment-${expIndex}`} className={`p-4 border rounded-lg mb-4 ${THEME.card} ${THEME.border}`}> 
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ExperimentIcon />
                    <h3 className={`ml-2 text-lg font-medium ${THEME.secondaryText}`}>
                      Experiment {expIndex + 1}
                    </h3>
                  </div>
                  {expIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newExperiments = [...experiments];
                        newExperiments.splice(expIndex, 1);
                        setExperiments(newExperiments);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <ExperimentSelector
                  key={`selector-${expIndex}`}
                  onExperimentSelect={(experiment) => handleExperimentSelect(expIndex, experiment)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={experiment.date}
                      onChange={(e) => handleExperimentChange(expIndex, 'date', e.target.value)}
                      required
                      className={`w-full px-3 py-2 text-sm md:text-base border ${THEME.border} rounded-lg ${THEME.inputFocus} transition-colors`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${THEME.secondaryText} mb-1`}>
                      Session
                    </label>
                    <select
                      value={experiment.session}
                      onChange={(e) => handleExperimentChange(expIndex, 'session', e.target.value)}
                      className={`w-full px-3 py-2 text-sm md:text-base border ${THEME.border} rounded-lg ${THEME.inputFocus} transition-colors`}
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChemicalIcon />
                      <h4 className={`ml-2 text-md font-medium ${THEME.secondaryText}`}>
                        Chemicals
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => addChemical(expIndex)}
                      className={`${THEME.secondaryText} ${THEME.hoverBg.replace('bg', 'text')}`}
                    >
                      + Add Chemical
                    </button>
                  </div>

                  {experiment.chemicals.map((_, chemIndex) => (
                    <div key={`chemical-${expIndex}-${chemIndex}`}>
                      {renderChemicalInput(expIndex, chemIndex)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperiment}
              className={`w-full py-2 ${THEME.primaryText} border-2 border-[#1E88E5] rounded-lg hover:bg-[#F5F9FD] transition-colors`}
            >
              + Add Another Experiment
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createRequestMutation.isLoading}
                className={`px-4 py-2 md:px-6 md:py-2 ${THEME.primaryBg} text-white rounded-lg text-sm md:text-base font-medium ${THEME.hoverBg} transition-colors disabled:opacity-50`}
              >
                {createRequestMutation.isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestForm;