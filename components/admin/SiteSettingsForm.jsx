'use client';

import { useState } from 'react';

const fields = [
  { name: 'siteName', label: 'Website / Company Name', placeholder: 'Azure Lanka Travels' },
  { name: 'domain', label: 'Production Domain', placeholder: 'https://azurelankatravels.com' },
  { name: 'heroEyebrow', label: 'Hero Small Label', placeholder: 'Yala Safari Experiences' },
  { name: 'heroTitle', label: 'Hero Main Title', type: 'textarea', rows: 3, placeholder: 'Discover The\nWild Heart of Sri\nLanka' },
  { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea', rows: 3, placeholder: 'Experience unforgettable Yala safaris...' },
  { name: 'primaryCtaLabel', label: 'Primary CTA Button', placeholder: 'Book Your Safari' },
  { name: 'whatsappCtaLabel', label: 'WhatsApp CTA Button', placeholder: 'Chat On WhatsApp' },
  { name: 'whatsappNumber', label: 'WhatsApp Number', placeholder: '94700000000' },
  { name: 'email', label: 'Booking Email', placeholder: 'bookings@azurelankatravels.com' },
  { name: 'location', label: 'Location Text', placeholder: 'Yala National Park • Sri Lanka' },
  { name: 'businessHours', label: 'Business Hours', placeholder: 'Daily • 6.00 AM – 9.00 PM' },
  { name: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { name: 'instagramUrl', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { name: 'metaTitle', label: 'Default SEO Meta Title', placeholder: 'Azure Lanka Travels | Yala Safari Booking in Sri Lanka' },
  { name: 'metaDescription', label: 'Default SEO Meta Description', type: 'textarea', rows: 3, placeholder: 'Book premium Yala safari experiences...' },
  { name: 'seoKeywords', label: 'SEO Keywords', type: 'textarea', rows: 3, placeholder: 'Yala safari booking, Yala National Park safari...' },
  { name: 'ogImage', label: 'Open Graph Image Path', placeholder: '/logos/azure-logo-light.png' },
  { name: 'footerCredit', label: 'Footer Credit', placeholder: 'Crafted by SPELLZZ' },
];

export default function SiteSettingsForm({ initialSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving website settings...');
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save settings.');
      setForm(result.settings);
      setMessage('Settings saved. Refresh the public website to see the latest homepage, contact and SEO changes.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel-card settings-cms-panel">
      <div className="admin-card-heading">
        <div>
          <span>Homepage CMS + Site Settings</span>
          <h2>Control public website text, contact details and SEO defaults</h2>
        </div>
        <p className="admin-note">Use this area to update the hero title, WhatsApp number, email, social links and SEO copy without editing code.</p>
      </div>

      <form className="settings-editor-form" onSubmit={saveSettings}>
        {fields.map((field) => (
          <label key={field.name} className={field.type === 'textarea' ? 'settings-editor-full' : ''}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                rows={field.rows || 3}
                value={form[field.name] || ''}
                onChange={updateField}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                name={field.name}
                value={form[field.name] || ''}
                onChange={updateField}
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}

        <div className="settings-preview-card">
          <span>Live Preview</span>
          <h3>{form.heroTitle?.split('\n').join(' ') || 'Hero title preview'}</h3>
          <p>{form.heroSubtitle}</p>
          <small>{form.email} · WhatsApp: {form.whatsappNumber}</small>
        </div>

        <div className="package-editor-actions settings-editor-full">
          <button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Website Settings'}</button>
          <a className="admin-ghost-btn" href="/" target="_blank">View Website</a>
        </div>
        {message && <p className="package-cms-message settings-editor-full">{message}</p>}
      </form>
    </section>
  );
}
