import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { session, isAdmin } = useAuth();

  return (
    <div className="landing">
      <h1>Nail art certificate authentication</h1>
      <p>
        Look up any nail technician's certification by its reference number, or sign in as an
        admin to add, update, and remove student certificate records.
      </p>
      <div className="landing-actions">
        <Link to="/verify" className="cta">
          Verify a certificate
        </Link>
        {session ? (
          <Link to="/admin">{isAdmin ? 'Admin panel' : 'Continue to admin panel'}</Link>
        ) : (
          <Link to="/login">Admin log in</Link>
        )}
      </div>
    </div>
  );
}
