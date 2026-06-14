'use client';

import { useState } from 'react';

const safariTravelFields = [
  'Full-Day Yala Safari',
  'Half-Day Morning Safari',
  'Half-Day Evening Safari',
  '5-12 Yala Safari',
];

const numberFields = [
  { name: 'exchangeRateLkr', label: 'USD → LKR Exchange Rate' },
  { name: 'jeepCapacity', label: 'Guests Per Jeep' },
  { name: 'generalAdultTicketUsd', label: 'General Countries Adult Ticket (USD)' },
  { name: 'generalChildTicketUsd', label: 'General Countries Child Ticket (USD)' },
  { name: 'saarcAdultTicketUsd', label: 'SAARC Countries Adult Ticket (USD)' },
  { name: 'saarcChildTicketUsd', label: 'SAARC Countries Child Ticket (USD)' },
  { name: 'localAdultTicketUsd', label: 'Sri Lanka / Resident Adult Ticket (USD)' },
  { name: 'localChildTicketUsd', label: 'Sri Lanka / Resident Child Ticket (USD)' },
  { name: 'serviceFeeUsd', label: 'Extra Service / Handling Fee (USD)' },
];

export default function PricingSettingsForm({ initialPricing }) {
  const [form, setForm] = useState(initialPricing);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function updateSafariTravelPrice(title, value) {
    setForm((current) => ({
      ...current,
      safariTravelPricesUsd: {
        ...(current.safariTravelPricesUsd || {}),
        [title]: value,
      },
    }));
  }

  async function savePricing(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving ticket calculator settings...');
    try {
      const response = await fetch('/api/pricing-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Unable to save pricing settings.');
      setForm(result.pricingSettings);
      setMessage('Ticket calculator saved. Refresh the public website to see updated USD/LKR totals.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel-card settings-cms-panel pricing-cms-panel">
      <div className="admin-card-heading">
        <div>
          <span>Tickets + Cost Calculator</span>
          <h2>Control SAARC discounts, general tickets, jeep/travel cost and LKR rate</h2>
        </div>
        <p className="admin-note">Customers see a live calculator in the booking area. Package prices come from Admin → Packages, meal prices come from Admin → Meal Plans, and ticket rates come from here.</p>
      </div>

      <form className="settings-editor-form" onSubmit={savePricing}>
        <div className="settings-editor-full pricing-section-title">Park ticket rates</div>
        {numberFields.map((field) => (
          <label key={field.name}>
            <span>{field.label}</span>
            <input name={field.name} type="number" min="0" step="0.01" value={form[field.name] ?? ''} onChange={updateField} />
          </label>
        ))}

        <div className="settings-editor-full pricing-section-title">Safari / Travel prices shown in the public calculator</div>
        {safariTravelFields.map((title) => (
          <label key={title}>
            <span>{title} Travel Price (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.safariTravelPricesUsd?.[title] ?? ''}
              onChange={(event) => updateSafariTravelPrice(title, event.target.value)}
            />
          </label>
        ))}

        <label>
          <span>Safari / Travel Price Mode</span>
          <select name="safariPriceMode" value={form.safariPriceMode || 'perJeep'} onChange={updateField}>
            <option value="perJeep">Package price × Jeep count</option>
            <option value="perBooking">Package price once per booking</option>
          </select>
        </label>

        <label className="settings-editor-full admin-checkbox-row">
          <input name="showLkrTotal" type="checkbox" checked={Boolean(form.showLkrTotal)} onChange={updateField} />
          <span>Show LKR total to customers</span>
        </label>

        <label className="settings-editor-full">
          <span>Customer Calculator Note</span>
          <textarea name="calculatorNote" rows="3" value={form.calculatorNote || ''} onChange={updateField} />
        </label>

        <div className="settings-preview-card pricing-preview-card">
          <span>Calculator Preview</span>
          <h3>General adult ${Number(form.generalAdultTicketUsd || 0)} · SAARC adult ${Number(form.saarcAdultTicketUsd || 0)}</h3>
          <p>Full-Day travel ${Number(form.safariTravelPricesUsd?.['Full-Day Yala Safari'] || 0)} · 1 USD = LKR {Number(form.exchangeRateLkr || 0)} · Travel mode: {form.safariPriceMode === 'perBooking' ? 'once per booking' : 'per jeep'}</p>
          <small>SAARC: Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, Sri Lanka</small>
        </div>

        <div className="package-editor-actions settings-editor-full">
          <button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Calculator Settings'}</button>
          <a className="admin-ghost-btn" href="/#booking" target="_blank">View Booking Calculator</a>
        </div>
        {message && <p className="package-cms-message settings-editor-full">{message}</p>}
      </form>
    </section>
  );
}
