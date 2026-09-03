import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminClient, supabase } from '../lib/supabase-client';

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await adminClient.signUp(email, password);
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      } else {
        setInfo('Account created! Check your email to confirm before logging in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <p className="muted">
          Anyone can create an account. You'll need the admin invite code afterwards to manage
          student records.
        </p>
        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
