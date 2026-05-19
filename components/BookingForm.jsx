'use client';

import { useEffect, useMemo, useState } from 'react';

const fallbackSafariTypes = [
  'Full-Day Yala Safari',
  'Half-Day Morning Safari',
  'Half-Day Evening Safari',
  '5-12 Yala Safari',
];

const initialForm = {
  name: '',
  safariType: 'Full-Day Yala Safari',
  date: '',
  adults: 2,
  children: 0,
  nationality: 'Foreign Tourist',
  whatsapp: '',
  email: '',
  note: '',
};

export default function BookingForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [safariTypes, setSafariTypes] = useState(fallbackSafariTypes);
  const [selectedNotice, setSelectedNotice] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadSafariTypes() {
      try {
        const response = await fetch('/api/packages', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success && Array.isArray(result.packages)) {
          const titles = result.packages
            .filter((pkg) => String(pkg.visibility || '').toLowerCase() === 'published')
            .map((pkg) => pkg.title)
            .filter(Boolean);
          if (titles.length) setSafariTypes(titles);
        }
      } catch (error) {
        // Keep fallback values for static preview/build mode.
      }
    }

    function selectPackage(event) {
      const packageTitle = event.detail?.packageTitle;
      if (!packageTitle) return;
      setSafariTypes((current) => current.includes(packageTitle) ? current : [packageTitle, ...current]);
      setForm((current) => ({ ...current, safariType: packageTitle }));
      setSelectedNotice(`${packageTitle} selected. Complete your details and submit the request.`);
    }

    loadSafariTypes();
    window.addEventListener('azure-package-selected', selectPackage);
    return () => {
      ignore = true;
      window.removeEventListener('azure-package-selected', selectPackage);
    };
  }, []);

  const totalGuests = Math.max(0, Number(form.adults || 0)) + Math.max(0, Number(form.children || 0));
  const jeepCount = Math.max(1, Math.ceil(totalGuests / 6));

  const whatsappUrl = useMemo(() => {
    const message = [
      'Hello Azure Lanka Travels,',
      '',
      'I want to book a Yala safari.',
      '',
      `Name: ${form.name || 'Not added'}`,
      `Safari: ${form.safariType || 'Not selected'}`,
      `Date: ${form.date || 'Not selected'}`,
      `Adults: ${form.adults || 0}`,
      `Children: ${form.children || 0}`,
      `Total Guests: ${totalGuests}`,
      `Jeep Count: ${jeepCount}`,
      `Nationality: ${form.nationality || 'Not selected'}`,
      `WhatsApp: ${form.whatsapp || 'Not added'}`,
      `Email: ${form.email || 'Not added'}`,
      `Note: ${form.note || 'No special note'}`,
    ].join('\n');
    const number = String(settings?.whatsappNumber || '94700000000').replace(/[^0-9]/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [form, jeepCount, totalGuests, settings?.whatsappNumber]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Saving your safari request...' });
    setBookingId('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Booking request failed.');

      setBookingId(result.booking.id);
      setStatus({
        type: 'success',
        message: 'Saved in Admin → Bookings as Pending. WhatsApp is opening only to send the same details to Azure Lanka Travels for quick confirmation.',
      });
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setForm((current) => ({ ...current, note: '' }));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <section id="booking" className="section booking-section figma-page booking-priority-section">
      <div className="booking-copy">
        <span className="small-label left-label">Quick Safari Booking</span>
        <h2>Book Your Yala Safari Request</h2>
        <p>
          This is the main booking request area. Visitors can submit their safari details from the homepage, the request is saved in the admin panel as Pending, and WhatsApp opens with the same booking details.
        </p>

        <div className="booking-steps">
          <span>1. Add details</span>
          <span>2. Auto jeep count</span>
          <span>3. Admin confirms</span>
        </div>

        <div className="booking-app-card" aria-label="Estimated safari booking summary">
          <span>Auto Calculated Jeep Count</span>
          <strong>{jeepCount}</strong>
          <small>{totalGuests || 0} guests • maximum 6 guests per jeep</small>
        </div>
      </div>

      <form className="booking-form mobile-card quick-booking-card" onSubmit={submitBooking}>
        <div className="booking-form-head">
          <span>Booking Request Form</span>
          <strong>Fast WhatsApp Confirmation</strong>
        </div>
        {selectedNotice && <p className="selected-package-notice">{selectedNotice}</p>}

        <label>
          <span>Full Name</span>
          <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          <span>Safari Type</span>
          <select name="safariType" value={form.safariType} onChange={updateField} required>
            {safariTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          <span>Safari Date</span>
          <input name="date" type="date" value={form.date} onChange={updateField} aria-label="Safari date" required />
        </label>
        <label>
          <span>Nationality</span>
          <select name="nationality" value={form.nationality} onChange={updateField} required>
            <option>Foreign Tourist</option>
            <option>Local / Resident</option>
          </select>
        </label>
        <div className="form-row">
          <label>
            <span>Adults</span>
            <input name="adults" type="number" min="1" value={form.adults} onChange={updateField} required />
          </label>
          <label>
            <span>Children</span>
            <input name="children" type="number" min="0" value={form.children} onChange={updateField} />
          </label>
        </div>
        <label>
          <span>WhatsApp Number</span>
          <input name="whatsapp" type="tel" placeholder="+44 / +49 / +94" value={form.whatsapp} onChange={updateField} required />
        </label>
        <label>
          <span>Email Address</span>
          <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={updateField} required />
        </label>
        <label>
          <span>Pickup / Special Request</span>
          <textarea name="note" placeholder="Pickup hotel, preferred time, meal request..." rows="4" value={form.note} onChange={updateField} />
        </label>
        <button className="booking-submit" type="submit" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Saving Request...' : 'Save Booking & Open WhatsApp'}
        </button>
        {status.message && <p className={`form-status ${status.type}`}>{status.message}{bookingId ? ` Ref: ${bookingId}` : ''}</p>}
        <small>After submit: the request is saved in Admin → Bookings first. Then WhatsApp opens with the same details so the traveler can send a quick message to Azure Lanka Travels.</small>
      </form>
    </section>
  );
}
