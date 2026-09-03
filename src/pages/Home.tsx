import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { session } = useAuth();

  return (
    <div className="landing">
      <h1>Nail art certificate authentication</h1>
      <p>
        Manage your nail technician certifications in one place. Upload your certificates,
        verify them against issuing authorities, and get alerted before they expire.
      </p>
      <div className="landing-actions">
        {session ? (
          <Link to="/dashboard" className="cta">
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="cta">
              Get started
            </Link>
            <Link to="/login">Log in</Link>
          </>
        )}
      </div>
    </div>
  );
}
