import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { certificateClient } from '../lib/supabase-client';

export function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setPhone(profile.phone ?? '');
      setBio(profile.bio ?? '');
      setLocation(profile.location ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      if (profile) {
        await certificateClient.updateArtistProfile({ name, phone, bio, location });
      } else {
        await certificateClient.createArtistProfile({ name, phone, bio, location });
      }
      await refreshProfile();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h1>{profile ? 'Your profile' : 'Complete your profile'}</h1>
      <form className="card-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        {saved && <p className="form-info">Profile saved.</p>}
        <label>
          Name
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Phone
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Location
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Bio
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save profile'}
        </button>
      </form>
      {profile && (
        <p className="muted">
          Verification status:{' '}
          <strong>{profile.is_verified ? 'Verified artist' : 'Not yet verified'}</strong>
        </p>
      )}
    </div>
  );
}
