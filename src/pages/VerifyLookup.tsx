import { useState, type FormEvent } from 'react';
import { adminClient } from '../lib/supabase-client';
import type { Student } from '../lib/types';

export function VerifyLookup() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<Student | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(true);
    try {
      setResult(await adminClient.getStudentByReference(reference));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Verify a certificate</h1>
      <p className="muted">Enter the reference number printed on the certificate to check its status.</p>
      <form className="card-form" onSubmit={handleSubmit}>
        <label>
          Reference number
          <input
            type="text"
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. NAC-2026-0001"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Verify'}
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {searched && !loading && !error && !result && (
        <div className="empty-state">
          <p>No certificate found for that reference number.</p>
        </div>
      )}

      {result && (
        <div className="verify-result">
          <div className="detail-header">
            <h2>{result.name}</h2>
            <span className={`status-badge status-${result.status}`}>{result.status}</span>
          </div>
          {result.photo_url && <img src={result.photo_url} alt={result.name} className="preview-thumb" />}
          <div className="detail-grid">
            <div>
              <span className="label">Reference number</span>
              <p>{result.reference_number}</p>
            </div>
            <div>
              <span className="label">Course</span>
              <p>{result.course}</p>
            </div>
            <div>
              <span className="label">Issued</span>
              <p>{result.issued_date}</p>
            </div>
            {result.expiry_date && (
              <div>
                <span className="label">Expires</span>
                <p>{result.expiry_date}</p>
              </div>
            )}
          </div>
          {result.certificate_image_url && (
            <>
              <h3>Certificate</h3>
              <img
                src={result.certificate_image_url}
                alt={`${result.name}'s certificate`}
                className="certificate-preview"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
