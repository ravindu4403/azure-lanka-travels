'use client';

import { useState } from 'react';

const initialForm = { name: '', email: '', whatsapp: '', subject: 'Safari planning inquiry', message: '' };

export default function ContactRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitContact(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sending your inquiry...' });
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to send inquiry.');
      setStatus({ type: 'success', message: `Inquiry received. Admin can view it as ${result.request.id}.` });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="contact-request-form mobile-card" onSubmit={submitContact}>
      <div className="booking-form-head">
        <span>Travel Inquiry</span>
        <strong>Ask Before You Book</strong>
      </div>
      <label><span>Name</span><input name="name" value={form.name} onChange={updateField} placeholder="Your name" required /></label>
      <label><span>Email</span><input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@email.com" required /></label>
      <label><span>WhatsApp</span><input name="whatsapp" value={form.whatsapp} onChange={updateField} placeholder="+44 / +49 / +94" /></label>
      <label><span>Subject</span><input name="subject" value={form.subject} onChange={updateField} /></label>
      <label><span>Message</span><textarea name="message" value={form.message} onChange={updateField} rows="4" placeholder="Tell us your travel dates, group size, hotel area or safari question..." required /></label>
      <button className="booking-submit" type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Sending...' : 'Send Inquiry'}</button>
      {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
    </form>
  );
}
