import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminClient } from '../lib/supabase-client';

/**
 * Shown at /admin for a signed-in user who isn't an admin yet. Lets them
 * redeem the invite code (verified server-side by the redeem-admin-code
 * Edge Function) to grant themselves admin access.
 */
export function AdminGate() {
  const { refreshAdminStatus } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminClient.redeemAdminCode(code);
      await refreshAdminStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Admin access</h1>
        <p className="muted">Enter the admin invite code to manage student certificates.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Invite code
          <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Checking…' : 'Unlock admin panel'}
        </button>
      </form>
    </div>
  );
}
