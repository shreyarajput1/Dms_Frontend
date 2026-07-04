import React, { useState } from 'react';
import FileSearch from '../components/Search/FileSearch';
import SearchResults from '../components/Search/SearchResults';
import { searchDocumentEntry } from '../api/api';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (payload) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const res = await searchDocumentEntry(payload);
      const rows = res?.data?.data || res?.data?.rows || res?.data || [];
      setResults(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Documents</div>
          <h1>Search documents</h1>
          <p className="sub">Filter by category, tags, and date range to find what you need.</p>
        </div>

        <FileSearch onSearch={handleSearch} loading={loading} />
        {error && <div className="error-banner">{error}</div>}
        <SearchResults results={results} loading={loading} hasSearched={hasSearched} />
      </div>
    </main>
  );
}
