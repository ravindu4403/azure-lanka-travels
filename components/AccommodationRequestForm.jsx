'use client';

import { useState } from 'react';

const initialForm = {
  name: '', email: '', whatsapp: '', location: 'Yala / Tissamaharama', checkIn: '', checkOut: '', guests: 2,
  budget: '$50 - $100 per night', roomType: 'Double room', note: '',
};

export default function AccommodationRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Saving accommodation request...' });
    try {
      const response = await fetch('/api/accommodation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save request.');
      setStatus({ type: 'success', message: `Accommodation request saved. Reference: ${result.request.id}` });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="booking-form mobile-card accommodation-form" onSubmit={submitRequest}>
      <div className="booking-form-head"><span>Accommodation Request</span><strong>We manually find suitable options</strong></div>
      <div className="form-row"><label><span>Name</span><input name="name" value={form.name} onChange={updateField} required /></label><label><span>Email</span><input name="email" type="email" value={form.email} onChange={updateField} required /></label></div>
      <div className="form-row"><label><span>WhatsApp</span><input name="whatsapp" value={form.whatsapp} onChange={updateField} required /></label><label><span>Location</span><select name="location" value={form.location} onChange={updateField}><option>Yala / Tissamaharama</option><option>Kataragama</option><option>Kirinda</option><option>Ella</option><option>Mirissa</option><option>Other Sri Lanka location</option></select></label></div>
      <div className="form-row"><label><span>Check-in</span><input name="checkIn" type="date" value={form.checkIn} onChange={updateField} required /></label><label><span>Check-out</span><input name="checkOut" type="date" value={form.checkOut} onChange={updateField} required /></label></div>
      <div className="form-row"><label><span>Guests</span><input name="guests" type="number" min="1" value={form.guests} onChange={updateField} required /></label><label><span>Budget</span><select name="budget" value={form.budget} onChange={updateField}><option>$30 - $50 per night</option><option>$50 - $100 per night</option><option>$100 - $200 per night</option><option>$200+ luxury stay</option><option>Flexible</option></select></label></div>
      <label><span>Room Type</span><select name="roomType" value={form.roomType} onChange={updateField}><option>Double room</option><option>Twin room</option><option>Family room</option><option>Villa / bungalow</option><option>Safari camp</option></select></label>
      <label><span>Special Requests</span><textarea name="note" value={form.note} onChange={updateField} rows="4" placeholder="Near park entrance, breakfast, pool, driver accommodation, etc." /></label>
      <button className="booking-submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Saving...' : 'Submit Accommodation Request'}</button>
      {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
      <small>This is not an instant hotel booking engine. Admin will contact hotels manually and send options to the guest.</small>
    </form>
  );
}
