import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { certificateClient } from '../lib/supabase-client';

export function Layout({ children }: { children: ReactNode }) {
  const { session, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await certificateClient.signOut();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          💅 Nail Art Certification
        </Link>
        <nav>
          {session ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/certificates/new">Add Certificate</Link>
              <Link to="/profile">{profile?.name || 'Profile'}</Link>
              <button className="link-button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup" className="cta">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
