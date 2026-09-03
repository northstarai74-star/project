import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { certificateClient } from '../lib/supabase-client';
import type { Certificate } from '../lib/types';

const STATUS_LABEL: Record<Certificate['status'], string> = {
  pending: 'Pending verification',
  verified: 'Verified',
  expired: 'Expired',
  revoked: 'Revoked',
  invalid: 'Invalid',
};

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function Dashboard() {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const certs = await certificateClient.getCertificatesForArtist(profile.id);
      setCertificates(certs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  if (!profile) {
    return (
      <div className="empty-state">
        <p>Finish setting up your profile to start adding certificates.</p>
        <Link to="/profile" className="cta">
          Complete profile
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your certificates</h1>
        <Link to="/certificates/new" className="cta">
          + Add certificate
        </Link>
      </div>

      {loading && <p>Loading certificates…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && certificates.length === 0 && (
        <div className="empty-state">
          <p>You haven't added any certificates yet.</p>
          <Link to="/certificates/new" className="cta">
            Add your first certificate
          </Link>
        </div>
      )}

      <div className="certificate-grid">
        {certificates.map((cert) => {
          const days = daysUntil(cert.expiry_date);
          return (
            <Link to={`/certificates/${cert.id}`} key={cert.id} className="certificate-card">
              <div className={`status-badge status-${cert.status}`}>{STATUS_LABEL[cert.status]}</div>
              <h3>{cert.certificate_number}</h3>
              <p className="muted">{cert.issuing_authority.replaceAll('_', ' ')}</p>
              <p className="muted">{cert.certificate_type.replaceAll('_', ' ')}</p>
              <p className={days < 0 ? 'expiry-danger' : days <= 30 ? 'expiry-warning' : 'expiry-ok'}>
                {days < 0
                  ? `Expired ${Math.abs(days)} day(s) ago`
                  : `Expires in ${days} day(s) (${cert.expiry_date})`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
