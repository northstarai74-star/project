import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { certificateClient } from '../lib/supabase-client';
import type { Certificate } from '../lib/types';

export function CertificateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [certData, logData] = await Promise.all([
        certificateClient.getCertificate(id),
        certificateClient.getVerificationLogs(id),
      ]);
      setCert(certData);
      setLogs(logData ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVerify = async () => {
    if (!id) return;
    setVerifying(true);
    setMessage(null);
    setError(null);
    try {
      const result = await certificateClient.verifyCertificate(id, true);
      setMessage(result.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this certificate? This cannot be undone.')) return;
    try {
      await certificateClient.deleteCertificate(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certificate');
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;
  if (error && !cert) return <p className="form-error">{error}</p>;
  if (!cert) return null;

  return (
    <div className="detail-page">
      <Link to="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="detail-header">
        <div>
          <h1>{cert.certificate_number}</h1>
          <p className="muted">{cert.issuing_authority.replaceAll('_', ' ')}</p>
        </div>
        <span className={`status-badge status-${cert.status}`}>{cert.status}</span>
      </div>

      {message && <p className="form-info">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="detail-grid">
        <div>
          <span className="label">Type</span>
          <p>{cert.certificate_type.replaceAll('_', ' ')}</p>
        </div>
        <div>
          <span className="label">Issued</span>
          <p>{cert.issued_date}</p>
        </div>
        <div>
          <span className="label">Expires</span>
          <p>{cert.expiry_date}</p>
        </div>
        <div>
          <span className="label">Last verified</span>
          <p>{cert.last_verified_at ? new Date(cert.last_verified_at).toLocaleString() : 'Never'}</p>
        </div>
        <div>
          <span className="label">Verification attempts</span>
          <p>{cert.verification_attempts}</p>
        </div>
      </div>

      {cert.verification_error && <p className="form-error">Last error: {cert.verification_error}</p>}

      {cert.certificate_file_url && (
        <p>
          <a href={cert.certificate_file_url} target="_blank" rel="noreferrer">
            View uploaded certificate file
          </a>
        </p>
      )}

      <div className="detail-actions">
        <button onClick={handleVerify} disabled={verifying}>
          {verifying ? 'Verifying…' : 'Verify now'}
        </button>
        <button className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <h2>Verification history</h2>
      {logs.length === 0 ? (
        <p className="muted">No verification attempts yet.</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log.id as string}>
              <span className={`status-badge status-${log.verification_status}`}>
                {log.verification_status as string}
              </span>
              <span className="muted">{new Date(log.verified_at as string).toLocaleString()}</span>
              {log.error_message ? <span className="form-error">{log.error_message as string}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
