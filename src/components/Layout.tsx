import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminClient } from '../lib/supabase-client';

export function Layout({ children }: { children: ReactNode }) {
  const { session, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await adminClient.signOut();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          💅 Nail Art Certification
        </Link>
        <nav>
          <Link to="/verify">Verify a certificate</Link>
          {session ? (
            <>
              {isAdmin && <Link to="/admin">Admin panel</Link>}
              <button className="link-button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Admin log in</Link>
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
