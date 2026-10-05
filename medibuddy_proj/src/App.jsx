import React, { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Basic search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedMedicine(null);

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query.trim())}"&limit=20`;
      const response = await fetch(url);

      if (response.status === 404) {
        setMedicines([]);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setMedicines(data.results || []);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Detail View
  if (selectedMedicine) {
    const openfda = selectedMedicine.openfda || {};
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <button onClick={() => setSelectedMedicine(null)}>&larr; Back to Search</button>
        <h2>{openfda.brand_name?.[0] || 'Unknown Brand'}</h2>
        <p><strong>Generic Name:</strong> {openfda.generic_name?.[0] || 'N/A'}</p>
        <p><strong>Manufacturer:</strong> {openfda.manufacturer_name?.[0] || 'N/A'}</p>
        <p><strong>Product Type:</strong> {openfda.product_type?.[0] || 'N/A'}</p>
        <p><strong>Route:</strong> {openfda.route?.[0] || 'N/A'}</p>
        {selectedMedicine.purpose && <p><strong>Purpose:</strong> {selectedMedicine.purpose.join(' ')}</p>}
      </div>
    );
  }

  // Search & List View
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Medicine Search</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brand name (e.g., advil)..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && medicines.length === 0 && query && (
        <p>No results found</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {medicines.map((med, index) => {
          const openfda = med.openfda || {};
          return (
            <div 
              key={index} 
              onClick={() => setSelectedMedicine(med)}
              style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{openfda.brand_name?.[0] || 'Unknown Brand'}</h3>
              <p style={{ margin: 0 }}>Generic: {openfda.generic_name?.[0] || 'N/A'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}