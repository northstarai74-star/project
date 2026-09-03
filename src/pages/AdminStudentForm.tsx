import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminClient } from '../lib/supabase-client';
import type { CertificateStatus } from '../lib/types';
import { AdminGate } from './AdminGate';

export function AdminStudentForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [referenceNumber, setReferenceNumber] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<CertificateStatus>('active');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [existingCertUrl, setExistingCertUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing || !id || !isAdmin) return;
    adminClient
      .getStudent(id)
      .then((s) => {
        setReferenceNumber(s.reference_number);
        setName(s.name);
        setCourse(s.course);
        setIssuedDate(s.issued_date);
        setExpiryDate(s.expiry_date ?? '');
        setStatus(s.status);
        setNotes(s.notes ?? '');
        setExistingPhotoUrl(s.photo_url ?? null);
        setExistingCertUrl(s.certificate_image_url ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load student'))
      .finally(() => setLoading(false));
  }, [id, isEditing, isAdmin]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const input = {
        reference_number: referenceNumber,
        name,
        course,
        issued_date: issuedDate,
        expiry_date: expiryDate || null,
        status,
        notes: notes || null,
      };

      const student = isEditing && id
        ? await adminClient.updateStudent(id, input)
        : await adminClient.createStudent(input);

      if (photoFile) {
        const url = await adminClient.uploadStudentFile(student.id, photoFile, 'photo');
        await adminClient.updateStudent(student.id, { photo_url: url });
      }
      if (certificateFile) {
        const url = await adminClient.uploadStudentFile(student.id, certificateFile, 'certificate');
        await adminClient.updateStudent(student.id, { certificate_image_url: url });
      }

      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="page-loading">Loading…</div>;
  if (!isAdmin) return <AdminGate />;
  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="form-page">
      <h1>{isEditing ? 'Edit student' : 'Add student'}</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Reference number
          <input
            type="text"
            required
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
        </label>
        <label>
          Student name
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Course / certificate type
          <input type="text" required value={course} onChange={(e) => setCourse(e.target.value)} />
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
          Expiry date (optional)
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as CertificateStatus)}>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
        <label>
          Notes (optional)
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label>
          Student photo {existingPhotoUrl && '(replace existing)'}
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
        </label>
        {existingPhotoUrl && (
          <img src={existingPhotoUrl} alt="Current student" className="preview-thumb" />
        )}
        <label>
          Certificate image {existingCertUrl && '(replace existing)'}
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setCertificateFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {existingCertUrl && (
          <img src={existingCertUrl} alt="Current certificate" className="preview-thumb" />
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save student'}
        </button>
      </form>
    </div>
  );
}
