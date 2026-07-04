import React, { useState } from 'react';
import { downloadSingleFile, downloadAllAsZip } from '../../utils/download';

function getFileUrl(doc) {
  return doc.file_url || doc.path || doc.document_url || doc.url || doc.file_path || '';
}

function getFileName(doc) {
  const url = getFileUrl(doc);
  if (doc.file_name) return doc.file_name;
  if (url) return url.split('/').pop();
  return `document_${doc.id || ''}`;
}

function isPdf(nameOrUrl = '') {
  return nameOrUrl.toLowerCase().endsWith('.pdf');
}
function isImage(nameOrUrl = '') {
  return /\.(png|jpe?g|gif|webp)$/i.test(nameOrUrl);
}

export default function SearchResults({ results, loading, hasSearched }) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [zipping, setZipping] = useState(false);

  const handleDownloadAll = async () => {
    if (!results.length) return;
    setZipping(true);
    try {
      await downloadAllAsZip(
        results.map((doc) => ({ url: getFileUrl(doc), filename: getFileName(doc) })),
        'documents.zip'
      );
    } finally {
      setZipping(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <span className="spinner dark" />
      </div>
    );
  }

  if (!hasSearched) return null;

  if (!results.length) {
    return (
      <div className="card empty-state">
        <div className="display">No documents found</div>
        <p>Try widening your date range or removing a filter.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="toolbar">
        <span className="hint">{results.length} document{results.length !== 1 ? 's' : ''} found</span>
        <button className="btn btn-gold btn-sm" onClick={handleDownloadAll} disabled={zipping}>
          {zipping ? <span className="spinner" /> : 'Download all as ZIP'}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="results-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Category</th>
              <th>Date</th>
              <th>Tags</th>
              <th>Remarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((doc, idx) => {
              const name = getFileName(doc);
              const tags = (doc.tags || []).map((t) => (typeof t === 'string' ? t : t.tag_name));
              return (
                <tr key={doc.id || idx}>
                  <td>{name}</td>
                  <td>
                    <span className="pill">{doc.major_head}</span>{' '}
                    <span className="hint">{doc.minor_head}</span>
                  </td>
                  <td>{doc.document_date}</td>
                  <td>
                    {tags.map((t) => (
                      <span key={t} className="pill" style={{ marginRight: 4 }}>{t}</span>
                    ))}
                  </td>
                  <td>{doc.document_remarks || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setPreviewDoc(doc)}>
                        Preview
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => downloadSingleFile(getFileUrl(doc), name)}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewDoc && (
        <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}

function PreviewModal({ doc, onClose }) {
  const url = getFileUrl(doc);
  const name = getFileName(doc);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>{name}</strong>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {isImage(name) && <img src={url} alt={name} />}
          {isPdf(name) && <iframe src={url} title={name} />}
          {!isImage(name) && !isPdf(name) && (
            <div className="modal-unsupported">
              Preview isn't available for this file type. Use Download instead.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
