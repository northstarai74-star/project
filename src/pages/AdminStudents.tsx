import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminClient } from '../lib/supabase-client';
import type { Student } from '../lib/types';
import { AdminGate } from './AdminGate';

export function AdminStudents() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setStudents(await adminClient.listStudents(search || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this student record? This cannot be undone.')) return;
    try {
      await adminClient.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  if (authLoading) return <div className="page-loading">Loading…</div>;
  if (!isAdmin) return <AdminGate />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Students</h1>
        <Link to="/admin/students/new" className="cta">
          + Add student
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or reference number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading students…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && students.length === 0 && (
        <div className="empty-state">
          <p>No student records yet.</p>
          <Link to="/admin/students/new" className="cta">
            Add your first student
          </Link>
        </div>
      )}

      <div className="certificate-grid">
        {students.map((s) => (
          <div className="certificate-card" key={s.id}>
            <span className={`status-badge status-${s.status}`}>{s.status}</span>
            <h3>{s.name}</h3>
            <p className="muted">{s.course}</p>
            <p className="muted">Ref: {s.reference_number}</p>
            <div className="card-actions">
              <Link to={`/admin/students/${s.id}/edit`}>Edit</Link>
              <button className="danger" onClick={() => handleDelete(s.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
