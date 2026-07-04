import React, { useState } from 'react';
import TagInput from '../common/TagInput';

const MAJOR_HEADS = ['', 'Personal', 'Professional'];
const PERSONAL_OPTIONS = ['John', 'Tom', 'Emily', 'Sara', 'Aditi'];
const PROFESSIONAL_OPTIONS = ['Accounts', 'HR', 'IT', 'Finance', 'Operations'];

export default function FileSearch({ onSearch, loading }) {
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tags, setTags] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const minorOptions = majorHead === 'Personal' ? PERSONAL_OPTIONS : majorHead === 'Professional' ? PROFESSIONAL_OPTIONS : [];

  const toApiDate = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      major_head: majorHead,
      minor_head: minorHead,
      from_date: toApiDate(fromDate),
      to_date: toApiDate(toDate),
      tags: tags.map((t) => ({ tag_name: t })),
      uploaded_by: '',
      start: 0,
      length: 10,
      filterId: '',
      search: { value: searchValue },
    });
  };

  const handleReset = () => {
    setMajorHead('');
    setMinorHead('');
    setFromDate('');
    setToDate('');
    setTags([]);
    setSearchValue('');
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div className="grid-3">
        <div className="field">
          <label htmlFor="s-major">Category</label>
          <select
            id="s-major"
            value={majorHead}
            onChange={(e) => { setMajorHead(e.target.value); setMinorHead(''); }}
          >
            {MAJOR_HEADS.map((h) => (
              <option key={h || 'any'} value={h}>{h || 'Any category'}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="s-minor">{majorHead === 'Professional' ? 'Department' : 'Name'}</label>
          <select
            id="s-minor"
            value={minorHead}
            onChange={(e) => setMinorHead(e.target.value)}
            disabled={!majorHead}
          >
            <option value="">Any</option>
            {minorOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="s-search">Keyword</label>
          <input
            id="s-search"
            type="text"
            placeholder="Search remarks, file name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="s-from">From date</label>
          <input id="s-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="s-to">To date</label>
          <input id="s-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Tags</label>
        <TagInput value={tags} onChange={setTags} placeholder="Filter by tag" />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Search documents'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>
          Clear filters
        </button>
      </div>
    </form>
  );
}
