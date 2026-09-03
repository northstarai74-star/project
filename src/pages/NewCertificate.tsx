import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { certificateClient } from '../lib/supabase-client';

const AUTHORITIES = [
  'NAILS_BOARD_OF_INDIA',
  'INDIAN_BEAUTY_COUNCIL',
  'NAIL_TECHNICIANS_ASSOCIATION',
  'DEFAULT_API',
];

export function NewCertificate() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [certificateNumber, setCertificateNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState(AUTHORITIES[0]);
  const [certificateType, setCertificateType] = useState('nail_technician');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setSubmitting(true);
    try {
      const cert = await certificateClient.createCertificate(profile.id, {
        certificate_number: certificateNumber,
        issuing_authority: issuingAuthority,
        certificate_type: certificateType,
        issued_date: issuedDate,
        expiry_date: expiryDate,
      });

      if (file) {
        const url = await certificateClient.uploadCertificateFile(cert.id, file);
        await certificateClient.updateCertificate(cert.id, { certificate_file_url: url });
      }

      navigate(`/certificates/${cert.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create certificate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Add a certificate</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Certificate number
          <input
            type="text"
            required
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
          />
        </label>
        <label>
          Issuing authority
          <select value={issuingAuthority} onChange={(e) => setIssuingAuthority(e.target.value)}>
            {AUTHORITIES.map((a) => (
              <option key={a} value={a}>
                {a.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label>
          Certificate type
          <input
            type="text"
            required
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
          />
        </label>
        <label>
          Issued date
          <input
            type="date"
            required
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
          />
        </label>
        <label>
          Expiry date
          <input
            type="date"
            required
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </label>
        <label>
          Certificate file (PDF or image, optional)
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save certificate'}
        </button>
      </form>
    </div>
  );
}
