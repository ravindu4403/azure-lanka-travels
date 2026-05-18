'use client';

import { useEffect, useState } from 'react';

function formatDate(value) {
  if (!value) return '—';
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

export function ContactRequestsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  async function loadRows() {
    setLoading(true);
    try {
      const response = await fetch('/api/contact-requests', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.requests);
    } finally { setLoading(false); }
  }

  useEffect(() => { loadRows().catch(() => setLoading(false)); }, []);

  async function updateStatus(id, status) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/contact-requests/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update status.');
      setRows((items) => items.map((item) => item.id === id ? result.request : item));
    } catch (error) { alert(error.message); }
    finally { setSavingId(''); }
  }

  return (
    <section className="admin-panel-card">
      <div className="admin-card-heading"><div><span>Contact CRM</span><h2>Website inquiries</h2></div><p className="admin-note">Messages submitted from the homepage contact form. Reply via email or WhatsApp, then update the status.</p></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Guest</th><th>Subject</th><th>Message</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7">Loading contact requests...</td></tr> : rows.length ? rows.map((row) => (
          <tr key={row.id}><td>{row.id}</td><td><strong>{row.name}</strong><small>{row.email}</small><small>{row.whatsapp || 'No WhatsApp'}</small></td><td>{row.subject}</td><td><small>{row.message}</small></td><td><span className={`admin-status ${String(row.status).toLowerCase().replaceAll(' ', '-')}`}>{row.status}</span></td><td>{formatDate(row.submittedAt)}</td><td><div className="booking-admin-actions"><button disabled={savingId === row.id} onClick={() => updateStatus(row.id, 'Contacted')}>Contacted</button><button disabled={savingId === row.id} onClick={() => updateStatus(row.id, 'Closed')}>Close</button><button disabled={savingId === row.id} className="muted" onClick={() => updateStatus(row.id, 'Spam')}>Spam</button></div></td></tr>
        )) : <tr><td colSpan="7">No contact requests yet.</td></tr>}
      </tbody></table></div>
    </section>
  );
}

export function AccommodationRequestsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  async function loadRows() {
    setLoading(true);
    try {
      const response = await fetch('/api/accommodation-requests', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.requests);
    } finally { setLoading(false); }
  }

  useEffect(() => { loadRows().catch(() => setLoading(false)); }, []);

  async function updateStatus(id, status) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/accommodation-requests/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update status.');
      setRows((items) => items.map((item) => item.id === id ? result.request : item));
    } catch (error) { alert(error.message); }
    finally { setSavingId(''); }
  }

  return (
    <section className="admin-panel-card">
      <div className="admin-card-heading"><div><span>Accommodation CRM</span><h2>Hotel assistance requests</h2></div><p className="admin-note">This follows the requirement: not an online hotel booking engine. Admin manually contacts hotels and sends options to customers.</p></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Guest</th><th>Stay Details</th><th>Budget</th><th>Status</th><th>Note</th><th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7">Loading accommodation requests...</td></tr> : rows.length ? rows.map((row) => (
          <tr key={row.id}><td>{row.id}</td><td><strong>{row.name}</strong><small>{row.email}</small><small>{row.whatsapp}</small></td><td><strong>{row.location}</strong><small>{row.checkIn} → {row.checkOut}</small><small>{row.guests} guests · {row.roomType}</small></td><td>{row.budget}</td><td><span className={`admin-status ${String(row.status).toLowerCase().replaceAll(' ', '-')}`}>{row.status}</span></td><td><small>{row.note || '—'}</small></td><td><div className="booking-admin-actions"><button disabled={savingId === row.id} onClick={() => updateStatus(row.id, 'Searching Hotels')}>Searching</button><button disabled={savingId === row.id} onClick={() => updateStatus(row.id, 'Options Sent')}>Options Sent</button><button disabled={savingId === row.id} onClick={() => updateStatus(row.id, 'Closed')}>Closed</button><button disabled={savingId === row.id} className="muted" onClick={() => updateStatus(row.id, 'Cancelled')}>Cancel</button></div></td></tr>
        )) : <tr><td colSpan="7">No accommodation requests yet.</td></tr>}
      </tbody></table></div>
    </section>
  );
}
