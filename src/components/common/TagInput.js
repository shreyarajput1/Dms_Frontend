import React, { useEffect, useRef, useState } from 'react';
import { fetchDocumentTags } from '../../api/api';

/**
 * Token-style tag input. Fetches matching existing tags from the
 * documentTags endpoint as the user types, and allows creating new
 * tags on the fly (they get saved automatically by saveDocumentEntry).
 */
export default function TagInput({ value, onChange, placeholder = 'Add a tag and press Enter' }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetchDocumentTags(inputValue);
        const raw = res?.data?.data || res?.data || [];
        const names = Array.isArray(raw)
          ? raw.map((t) => (typeof t === 'string' ? t : t.tag_name || t.label)).filter(Boolean)
          : [];
        setSuggestions(names.filter((n) => !value.includes(n)));
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // eslint-disable-next-line no-console
          console.warn(
            '[TagInput] documentTags request was rejected as unauthorized (status ' +
              status +
              "). This endpoint requires the 'token' header from a successful OTP login " +
              '(see Postman collection) — log in first, or check that a valid token is in ' +
              "localStorage under 'dms_token'."
          );
        } else {
          // eslint-disable-next-line no-console
          console.warn('[TagInput] Failed to fetch document tags:', err?.message || err);
        }
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="tag-suggestions" ref={wrapRef}>
      <div className="tag-input-box">
        {value.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          placeholder={value.length === 0 ? placeholder : ''}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="tag-suggestion-list">
          {suggestions.slice(0, 8).map((s) => (
            <button type="button" key={s} onClick={() => addTag(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
