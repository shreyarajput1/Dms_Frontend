import React, { useRef, useState } from 'react';
import { saveDocumentEntry } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import TagInput from '../common/TagInput';

const MAJOR_HEADS = ['Personal', 'Professional'];
const PERSONAL_OPTIONS = ['John', 'Tom', 'Emily', 'Sara', 'Aditi'];
const PROFESSIONAL_OPTIONS = ['Accounts', 'HR', 'IT', 'Finance', 'Operations'];

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];

export default function FileUpload() {
  const { mobileNumber } = useAuth();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const [tags, setTags] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const minorOptions = majorHead === 'Personal' ? PERSONAL_OPTIONS : PROFESSIONAL_OPTIONS;

  const toApiDate = (isoDate) => {
    // Convert yyyy-mm-dd (from <input type="date">) to dd-mm-yyyy expected by the API sample.
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  const validateAndSetFile = (candidate) => {
    setError('');
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError('Only image files (PNG/JPG/GIF) and PDF documents are allowed.');
      return;
    }
    setFile(candidate);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setFile(null);
    setMajorHead('');
    setMinorHead('');
    setDocumentDate('');
    setTags([]);
    setRemarks('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) return setError('Please choose a file to upload.');
    if (!majorHead) return setError('Please select a category.');
    if (!minorHead) return setError(`Please select a ${majorHead === 'Personal' ? 'name' : 'department'}.`);
    if (!documentDate) return setError('Please select a document date.');

    const payload = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: toApiDate(documentDate),
      document_remarks: remarks,
      tags: tags.map((t) => ({ tag_name: t })),
      user_id: mobileNumber || 'guest',
    };

    setLoading(true);
    try {
      await saveDocumentEntry(file, payload);
      setSuccess('Document uploaded successfully.');
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Documents</div>
        <h1>Upload a document</h1>
        <p className="sub">Tag and categorize files so they're easy to find later.</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>File</label>
            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              {file ? (
                <span className="file-picked">{file.name}</span>
              ) : (
                <span>Drag & drop a PDF or image here, or click to browse</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf,image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => validateAndSetFile(e.target.files?.[0])}
              />
            </div>
            <div className="hint">Only image and PDF files are allowed.</div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="documentDate">Document date</label>
              <input
                id="documentDate"
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="majorHead">Category</label>
              <select
                id="majorHead"
                value={majorHead}
                onChange={(e) => {
                  setMajorHead(e.target.value);
                  setMinorHead('');
                }}
              >
                <option value="">Select category</option>
                {MAJOR_HEADS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="minorHead">{majorHead === 'Professional' ? 'Department' : 'Name'}</label>
            <select
              id="minorHead"
              value={minorHead}
              onChange={(e) => setMinorHead(e.target.value)}
              disabled={!majorHead}
            >
              <option value="">
                {majorHead ? `Select ${majorHead === 'Professional' ? 'department' : 'name'}` : 'Select a category first'}
              </option>
              {minorOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Tags</label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          <div className="field">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional notes about this document"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Upload document'}
          </button>
        </form>
      </div>
    </div>
  );
}
