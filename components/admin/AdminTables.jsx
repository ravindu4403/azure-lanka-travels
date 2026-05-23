'use client';

import { useEffect, useState } from 'react';
import { bookingRows, packageRows, galleryRows } from '@/data/adminData';

function LoadingRow({ colSpan = 10 }) {
  return <tr><td colSpan={colSpan}>Loading latest records...</td></tr>;
}

function isVideoMedia(url = '', type = '') {
  return String(type).toLowerCase() === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(String(url).split('?')[0]);
}

function AdminMediaPreview({ src, type, alt = 'Uploaded media' }) {
  if (!src) return null;
  if (isVideoMedia(src, type)) {
    return <video className="admin-upload-preview-media" src={src} controls playsInline muted />;
  }
  return <img className="admin-upload-preview-media" src={src} alt={alt} />;
}


function getBookingStatusActions(status = '') {
  const normalized = String(status || 'Pending').toLowerCase();

  if (normalized === 'accepted') {
    return [
      { label: 'Complete', nextStatus: 'Completed', className: '' },
      { label: 'Cancel', nextStatus: 'Cancelled', className: 'muted' },
    ];
  }

  if (normalized === 'pending') {
    return [
      { label: 'Accept', nextStatus: 'Accepted', className: '' },
      { label: 'Reject', nextStatus: 'Rejected', className: 'danger' },
      { label: 'Cancel', nextStatus: 'Cancelled', className: 'muted' },
    ];
  }

  return [];
}

function BookingStatusActionButtons({ status, saving = false, onStatusChange, longLabels = false }) {
  const actions = getBookingStatusActions(status);

  if (!actions.length) {
    return <span className="admin-no-actions">No further action</span>;
  }

  return actions.map((action) => (
    <button
      key={action.nextStatus}
      type="button"
      disabled={saving}
      className={action.className}
      onClick={() => onStatusChange(action.nextStatus)}
    >
      {longLabels && action.nextStatus === 'Accepted' ? 'Accept Booking' : longLabels && action.nextStatus === 'Completed' ? 'Mark Completed' : action.label}
    </button>
  ));
}

function AdminMediaUploadField({
  label = 'Media file',
  value = '',
  type = '',
  folder = 'general',
  accept = 'image/*,video/*',
  onPathChange,
  onUploaded,
  hint = 'Choose a file from your computer or paste a path/URL.',
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMessage('Uploading media...');
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('folder', folder);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: payload });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Upload failed.');
      onPathChange?.(result.fileUrl);
      onUploaded?.(result.fileUrl, result.mediaType, result);
      setUploadMessage(result.message || `${result.mediaType} uploaded successfully. Preview updated.`);
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="package-editor-full admin-media-upload-field">
      <div className="admin-media-label-row">
        <span>{label}</span>
        {value ? <small>{isVideoMedia(value, type) ? 'Video preview enabled' : 'Image preview enabled'}</small> : null}
      </div>
      <div className="admin-media-upload-grid">
        <label className="admin-file-drop-zone">
          <input type="file" accept={accept} onChange={handleFile} disabled={uploading} />
          <strong>{uploading ? 'Uploading...' : 'Select file'}</strong>
          <small>{hint}</small>
        </label>
        <div className="admin-upload-preview-box">
          {value ? <AdminMediaPreview src={value} type={type} alt={label} /> : <span>No media selected</span>}
        </div>
      </div>
      <input value={value || ''} onChange={(event) => onPathChange?.(event.target.value)} placeholder="/uploads/images/... or https://..." />
      {uploadMessage ? <small className="admin-upload-message">{uploadMessage}</small> : null}
    </div>
  );
}


export function BookingsTable() {
  const [rows, setRows] = useState(bookingRows);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const updateBookingStatus = async (id, status) => {
    setSavingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update booking status.');
      setRows((items) => items.map((booking) => booking.id === id ? result.booking : booking));
      setSelectedBooking((current) => current?.id === id ? result.booking : current);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId('');
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadBookings() {
      try {
        const response = await fetch('/api/bookings', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success) setRows(result.bookings);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadBookings();
    return () => { ignore = true; };
  }, []);

  return (
    <section className="admin-panel-card">
      <div className="admin-card-heading">
        <div>
          <span>Booking Management</span>
          <h2>Safari booking requests</h2>
        </div>
        <p className="admin-note">Website booking form requests are saved here first as Pending. Admin can confirm through WhatsApp/email.</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Guest</th><th>Package</th><th>Date</th><th>People</th><th>Meals</th><th>Total</th><th>Status</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow /> : rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td><strong>{row.guest}</strong><small>{row.country}</small></td>
                <td>{row.package}</td>
                <td>{row.date}</td>
                <td>{row.people}<small>{row.adults || 0} adults · {row.children || 0} children</small></td>
                <td>
                  {Array.isArray(row.mealSelections) && row.mealSelections.length ? (
                    <div className="booking-meal-list">{row.mealSelections.map((meal) => <small key={`${row.id}-${meal.id}`}>{meal.title} × {meal.persons}</small>)}</div>
                  ) : <small>No meals</small>}
                  <small>{row.jeeps} jeep(s)</small>
                </td>
                <td><strong>${Number(row.grandTotalUsd || row.safariPriceUsd || 0)}</strong><small>Meals: ${Number(row.mealTotalUsd || 0)}</small></td>
                <td><span className={`admin-status ${String(row.status).toLowerCase()}`}>{row.status}</span></td>
                <td><strong>{row.whatsapp || 'No WhatsApp'}</strong><small>{row.email}</small></td>
                <td>
                  <div className="booking-admin-actions">
                    <button type="button" className="view" onClick={() => setSelectedBooking(row)}>Open</button>
                    <BookingStatusActionButtons
                      status={row.status}
                      saving={savingId === row.id}
                      onStatusChange={(status) => updateBookingStatus(row.id, status)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking ? (
        <BookingDetailsModal
          booking={selectedBooking}
          saving={savingId === selectedBooking.id}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={(status) => updateBookingStatus(selectedBooking.id, status)}
        />
      ) : null}
    </section>
  );
}

function BookingDetailsModal({ booking, saving, onClose, onStatusChange }) {
  const meals = Array.isArray(booking.mealSelections) ? booking.mealSelections : [];
  const submitted = booking.submittedAt ? new Date(booking.submittedAt).toLocaleString() : 'Not available';
  return (
    <div className="booking-detail-overlay" role="dialog" aria-modal="true" aria-label="Booking details">
      <div className="booking-detail-modal">
        <div className="booking-detail-header">
          <div>
            <span>Booking Request</span>
            <h3>{booking.id}</h3>
            <p>{booking.package} • {booking.date}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking details">×</button>
        </div>

        <div className="booking-detail-status-line">
          <span className={`admin-status ${String(booking.status).toLowerCase()}`}>{booking.status}</span>
          <strong>Grand Total: ${Number(booking.grandTotalUsd || booking.safariPriceUsd || 0)}</strong>
        </div>

        <div className="booking-detail-grid">
          <article><span>Guest Name</span><strong>{booking.guest}</strong><small>{booking.country}</small></article>
          <article><span>Contact</span><strong>{booking.whatsapp || 'No WhatsApp'}</strong><small>{booking.email}</small></article>
          <article><span>People</span><strong>{booking.people || 0} guests</strong><small>{booking.adults || 0} adults • {booking.children || 0} children</small></article>
          <article><span>Jeep Count</span><strong>{booking.jeeps || 1}</strong><small>Maximum 6 guests per jeep</small></article>
          <article><span>Safari Price</span><strong>${Number(booking.safariPriceUsd || 0)}</strong><small>USD</small></article>
          <article><span>Meal Total</span><strong>${Number(booking.mealTotalUsd || 0)}</strong><small>{meals.length ? `${meals.length} selected meal plan(s)` : 'No meals selected'}</small></article>
          <article><span>Submitted</span><strong>{submitted}</strong><small>Website booking form</small></article>
          <article><span>Note / Pickup</span><strong>{booking.note || 'No special request'}</strong><small>Customer request</small></article>
        </div>

        <div className="booking-detail-meals">
          <span>Selected Meal Plans</span>
          {meals.length ? meals.map((meal) => (
            <div className="booking-detail-meal-row" key={`${booking.id}-${meal.id}`}>
              <strong>{meal.title}</strong>
              <small>{meal.persons} person(s) × ${Number(meal.priceUsd || 0)} = ${Number(meal.lineTotalUsd || 0)}</small>
            </div>
          )) : <p>No meal plans selected for this safari booking.</p>}
        </div>

        <div className="booking-detail-actions">
          <BookingStatusActionButtons
            status={booking.status}
            saving={saving}
            longLabels
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

const emptyPackageForm = {
  id: '',
  badge: 'Safari Package',
  title: '',
  price: '$70',
  duration: '4–5 hours',
  capacity: '6 per jeep',
  visibility: 'Draft',
  featured: false,
  text: '',
  includesText: 'Comfortable safari jeep\nLocal safari guidance\nWhatsApp booking support\nPickup support on request',
};

function packageToForm(pkg = {}) {
  return {
    id: pkg.id || '',
    badge: pkg.badge || 'Safari Package',
    title: pkg.title || '',
    price: pkg.price || '$70',
    duration: pkg.duration || '4–5 hours',
    capacity: pkg.capacity || '6 per jeep',
    visibility: pkg.visibility || 'Draft',
    featured: Boolean(pkg.featured),
    text: pkg.text || pkg.description || '',
    includesText: Array.isArray(pkg.includes) && pkg.includes.length
      ? pkg.includes.join('\n')
      : 'Comfortable safari jeep\nLocal safari guidance\nWhatsApp booking support\nPickup support on request',
  };
}

function formToPayload(form) {
  return {
    badge: form.badge,
    title: form.title,
    price: form.price,
    duration: form.duration,
    capacity: form.capacity,
    visibility: form.visibility,
    featured: form.featured,
    text: form.text,
    includes: form.includesText.split('\n').map((item) => item.trim()).filter(Boolean),
  };
}

export function PackagesTable() {
  const [rows, setRows] = useState(packageRows);
  const [form, setForm] = useState(emptyPackageForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const isEditing = Boolean(form.id);

  async function loadPackages() {
    setLoading(true);
    try {
      const response = await fetch('/api/packages', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.packages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        const response = await fetch('/api/packages', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success) setRows(result.packages);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run().catch(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  function updateForm(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function editPackage(pkg) {
    setForm(packageToForm(pkg));
    setMessage(`Editing ${pkg.title}`);
    setTimeout(() => {
      document.getElementById('package-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function resetForm() {
    setForm(emptyPackageForm);
    setMessage('');
  }

  async function savePackage(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving package...');
    try {
      const endpoint = isEditing ? `/api/packages/${form.id}` : '/api/packages';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToPayload(form)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save package.');
      await loadPackages();
      setForm(emptyPackageForm);
      setMessage(isEditing ? 'Package updated successfully. Public website will refresh with the latest data.' : 'New package created successfully. Publish it to show on the website.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdate(pkg, patch) {
    setSaving(true);
    setMessage('Updating package...');
    try {
      const payload = formToPayload(packageToForm({ ...pkg, ...patch }));
      const response = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update package.');
      setRows((items) => items.map((item) => item.id === pkg.id ? result.package : item));
      setMessage(`${result.package.title} is now ${result.package.visibility}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePackage(pkg) {
    if (!confirm(`Delete ${pkg.title}? This removes it from the public website and admin list.`)) return;
    setSaving(true);
    setMessage('Deleting package...');
    try {
      const response = await fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to delete package.');
      setRows((items) => items.filter((item) => item.id !== pkg.id));
      if (form.id === pkg.id) resetForm();
      setMessage('Package deleted successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel-card package-cms-panel">
      <div className="admin-card-heading">
        <div>
          <span>Package CMS</span>
          <h2>Create, edit, publish and hide safari packages</h2>
        </div>
        <p className="admin-note">Published packages appear on the public website. Draft packages stay hidden until admin publishes them.</p>
      </div>

      <form id="package-editor" className="package-editor-form" onSubmit={savePackage}>
        <div className="package-editor-title">
          <span>{isEditing ? 'Edit Package' : 'Create Package'}</span>
          <h3>{isEditing ? form.title || 'Selected package' : 'New safari package'}</h3>
        </div>
        <label>
          <span>Title</span>
          <input name="title" value={form.title} onChange={updateForm} placeholder="Full-Day Yala Safari" required />
        </label>
        <label>
          <span>Badge</span>
          <input name="badge" value={form.badge} onChange={updateForm} placeholder="Most Popular • Best Value" />
        </label>
        <label>
          <span>Price</span>
          <input name="price" value={form.price} onChange={updateForm} placeholder="$120" />
        </label>
        <label>
          <span>Duration</span>
          <input name="duration" value={form.duration} onChange={updateForm} placeholder="10–12 hours" />
        </label>
        <label>
          <span>Capacity</span>
          <input name="capacity" value={form.capacity} onChange={updateForm} placeholder="6 per jeep" />
        </label>
        <label>
          <span>Visibility</span>
          <select name="visibility" value={form.visibility} onChange={updateForm}>
            <option>Draft</option>
            <option>Published</option>
          </select>
        </label>
        <label className="package-editor-full">
          <span>Short description</span>
          <textarea name="text" value={form.text} onChange={updateForm} rows="3" placeholder="A premium safari experience description for foreign travelers..." />
        </label>
        <label className="package-editor-full">
          <span>Included items — one item per line</span>
          <textarea name="includesText" value={form.includesText} onChange={updateForm} rows="5" />
        </label>
        <label className="package-feature-toggle">
          <input name="featured" type="checkbox" checked={form.featured} onChange={updateForm} />
          <span>Feature this package in admin/highlight areas</span>
        </label>
        <div className="package-editor-actions">
          <button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}</button>
          <button className="admin-ghost-btn" type="button" onClick={resetForm} disabled={saving}>Clear Form</button>
        </div>
        {message && <p className="package-cms-message">{message}</p>}
      </form>

      <div className="admin-card-heading package-list-heading">
        <div>
          <span>Current Packages</span>
          <h2>Website package list</h2>
        </div>
        <button type="button" className="admin-primary-btn small" onClick={resetForm}>Add Package</button>
      </div>

      <div className="admin-edit-grid package-admin-grid">
        {loading ? <p>Loading latest packages...</p> : rows.map((pkg) => (
          <article className="admin-edit-card package-admin-card" key={pkg.id || pkg.title}>
            <div className="package-admin-topline">
              <span className={`admin-status ${String(pkg.visibility).toLowerCase()}`}>{pkg.visibility}</span>
              {pkg.featured ? <strong className="featured-mini-badge">Featured</strong> : null}
            </div>
            <h3>{pkg.title}</h3>
            <p>{pkg.duration} · {pkg.capacity}</p>
            <strong>{pkg.price}</strong>
            {pkg.text ? <small>{pkg.text}</small> : null}
            <div className="package-admin-actions">
              <button type="button" onClick={() => editPackage(pkg)} disabled={saving}>Edit</button>
              <button type="button" onClick={() => quickUpdate(pkg, { visibility: pkg.visibility === 'Published' ? 'Draft' : 'Published' })} disabled={saving}>
                {pkg.visibility === 'Published' ? 'Move Draft' : 'Publish'}
              </button>
              <button type="button" className="danger" onClick={() => deletePackage(pkg)} disabled={saving}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}



const emptyGalleryForm = {
  id: '',
  title: '',
  category: 'Wildlife',
  status: 'Pending Approval',
  type: 'Image',
  imageUrl: '/images/animals/leopard.png',
  alt: '',
  caption: '',
};

function galleryToForm(item = {}) {
  return {
    id: item.id || '',
    title: item.title || '',
    category: item.category || 'Wildlife',
    status: item.status || 'Pending Approval',
    type: item.type || 'Image',
    imageUrl: item.imageUrl || '/images/animals/leopard.png',
    alt: item.alt || item.title || '',
    caption: item.caption || '',
  };
}

function galleryPayload(form) {
  return {
    title: form.title,
    category: form.category,
    status: form.status,
    type: form.type,
    imageUrl: form.imageUrl,
    alt: form.alt,
    caption: form.caption,
  };
}

export function GalleryTable() {
  const [rows, setRows] = useState(galleryRows);
  const [form, setForm] = useState(emptyGalleryForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const isEditing = Boolean(form.id);

  async function loadGallery() {
    setLoading(true);
    try {
      const response = await fetch('/api/gallery', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.gallery);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery().catch(() => setLoading(false));
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function editItem(item) {
    setForm(galleryToForm(item));
    setMessage(`Editing ${item.title}`);
    setTimeout(() => document.getElementById('gallery-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function resetForm() {
    setForm(emptyGalleryForm);
    setMessage('');
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving gallery item...');
    try {
      const endpoint = isEditing ? `/api/gallery/${form.id}` : '/api/gallery';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryPayload(form)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save gallery item.');
      await loadGallery();
      setForm(emptyGalleryForm);
      setMessage(isEditing ? 'Gallery item updated.' : 'Gallery item added. Publish it to show on the website.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(item, status) {
    setSaving(true);
    try {
      const response = await fetch(`/api/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...galleryPayload(galleryToForm(item)), status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update gallery status.');
      setRows((items) => items.map((row) => row.id === item.id ? result.item : row));
      setMessage(`${item.title} is now ${status}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    if (!confirm(`Delete ${item.title}?`)) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/gallery/${item.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to delete gallery item.');
      setRows((items) => items.filter((row) => row.id !== item.id));
      if (form.id === item.id) resetForm();
      setMessage('Gallery item deleted.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel-card gallery-cms-panel">
      <div className="admin-card-heading">
        <div>
          <span>Gallery CMS</span>
          <h2>Images, categories and approvals</h2>
        </div>
        <p className="admin-note">Only Published gallery items appear on the public website. Tourist/customer uploads can stay Pending Approval.</p>
      </div>

      <form id="gallery-editor" className="package-editor-form" onSubmit={saveItem}>
        <div className="package-editor-title">
          <span>{isEditing ? 'Edit Media' : 'Add Media'}</span>
          <h3>{isEditing ? form.title || 'Selected gallery item' : 'New safari gallery item'}</h3>
        </div>
        <label><span>Title</span><input name="title" value={form.title} onChange={updateForm} placeholder="Leopard at Yala trail" required /></label>
        <label><span>Category</span><select name="category" value={form.category} onChange={updateForm}><option>Wildlife</option><option>Safari Moments</option><option>Customer Photos</option><option>Landscapes</option><option>Videos</option></select></label>
        <label><span>Status</span><select name="status" value={form.status} onChange={updateForm}><option>Pending Approval</option><option>Published</option><option>Rejected</option></select></label>
        <label><span>Type</span><select name="type" value={form.type} onChange={updateForm}><option>Image</option><option>Video</option></select></label>
        <AdminMediaUploadField
          label="Image / video file"
          value={form.imageUrl}
          type={form.type}
          folder="gallery"
          accept="image/*,video/*"
          onPathChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))}
          onUploaded={(fileUrl, mediaType) => setForm((current) => ({ ...current, imageUrl: fileUrl, type: mediaType }))}
          hint="Upload gallery photos or videos. Videos will play on the public website."
        />
        <label className="package-editor-full"><span>Alt text for SEO</span><input name="alt" value={form.alt} onChange={updateForm} placeholder="Sri Lankan leopard sighting in Yala National Park" /></label>
        <label className="package-editor-full"><span>Caption</span><textarea name="caption" value={form.caption} onChange={updateForm} rows="3" placeholder="Short story or context for this safari moment..." /></label>
        <div className="package-editor-actions">
          <button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Media' : 'Add Media'}</button>
          <button className="admin-ghost-btn" type="button" onClick={resetForm} disabled={saving}>Clear Form</button>
        </div>
        {message && <p className="package-cms-message">{message}</p>}
      </form>

      <div className="admin-edit-grid gallery-admin-grid">
        {loading ? <p>Loading latest gallery...</p> : rows.map((item) => (
          <article className="admin-edit-card gallery-admin-card" key={item.id || item.title}>
            <div className="gallery-thumb-real"><AdminMediaPreview src={item.imageUrl || '/images/animals/elephant.png'} type={item.type} alt={item.alt || item.title} /></div>
            <span className={`admin-status ${String(item.status).toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span>
            <h3>{item.title}</h3>
            <p>{item.category}</p>
            {item.caption ? <small>{item.caption}</small> : null}
            <div className="package-admin-actions">
              <button type="button" onClick={() => editItem(item)} disabled={saving}>Edit</button>
              <button type="button" onClick={() => quickStatus(item, item.status === 'Published' ? 'Pending Approval' : 'Published')} disabled={saving}>{item.status === 'Published' ? 'Unpublish' : 'Publish'}</button>
              <button type="button" className="danger" onClick={() => deleteItem(item)} disabled={saving}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const emptyBlogForm = {
  id: '', title: '', slug: '', category: 'Safari guides', status: 'Draft',
  excerpt: '', content: '', metaTitle: '', metaDescription: '', featuredImage: '/images/animals/leopard.png',
};

function blogToForm(blog = {}) {
  return {
    id: blog.id || '',
    title: blog.title || '',
    slug: blog.slug || '',
    category: blog.category || 'Safari guides',
    status: blog.status || 'Draft',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    metaTitle: blog.metaTitle || blog.title || '',
    metaDescription: blog.metaDescription || blog.excerpt || '',
    featuredImage: blog.featuredImage || '/images/animals/leopard.png',
  };
}

function blogPayload(form) {
  return {
    title: form.title, slug: form.slug, category: form.category, status: form.status,
    excerpt: form.excerpt, content: form.content, metaTitle: form.metaTitle,
    metaDescription: form.metaDescription, featuredImage: form.featuredImage,
  };
}

export function BlogCmsPanel() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyBlogForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const isEditing = Boolean(form.id);

  async function loadBlogs() {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.blogs);
    } finally { setLoading(false); }
  }

  useEffect(() => { loadBlogs().catch(() => setLoading(false)); }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function editBlog(blog) {
    setForm(blogToForm(blog));
    setMessage(`Editing ${blog.title}`);
    setTimeout(() => document.getElementById('blog-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function resetForm() { setForm(emptyBlogForm); setMessage(''); }

  async function saveBlog(event) {
    event.preventDefault();
    setSaving(true); setMessage('Saving blog post...');
    try {
      const endpoint = isEditing ? `/api/blogs/${form.id}` : '/api/blogs';
      const response = await fetch(endpoint, { method: isEditing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blogPayload(form)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save blog post.');
      await loadBlogs(); resetForm(); setMessage(isEditing ? 'Blog post updated.' : 'Blog post created. Publish it to show on the website.');
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function quickStatus(blog, status) {
    setSaving(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...blogPayload(blogToForm(blog)), status }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update blog post.');
      setRows((items) => items.map((item) => item.id === blog.id ? result.blog : item));
      setMessage(`${blog.title} is now ${status}.`);
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  async function deleteBlog(blog) {
    if (!confirm(`Delete ${blog.title}?`)) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to delete blog post.');
      setRows((items) => items.filter((item) => item.id !== blog.id));
      if (form.id === blog.id) resetForm();
      setMessage('Blog post deleted.');
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  return (
    <section className="admin-panel-card blog-cms-panel">
      <div className="admin-card-heading">
        <div><span>Blog SEO CMS</span><h2>Create SEO articles for Yala safari keywords</h2></div>
        <p className="admin-note">Published posts appear on /blog and help target Google searches such as Yala safari booking and Sri Lanka wildlife safari.</p>
      </div>
      <form id="blog-editor" className="package-editor-form blog-editor-form" onSubmit={saveBlog}>
        <div className="package-editor-title"><span>{isEditing ? 'Edit Blog' : 'Create Blog'}</span><h3>{isEditing ? form.title || 'Selected blog post' : 'New SEO blog post'}</h3></div>
        <label><span>Title</span><input name="title" value={form.title} onChange={updateForm} required placeholder="Best Time to Book a Yala Safari" /></label>
        <label><span>Slug</span><input name="slug" value={form.slug} onChange={updateForm} placeholder="best-time-to-book-yala-safari" /></label>
        <label><span>Category</span><select name="category" value={form.category} onChange={updateForm}><option>Safari guides</option><option>Travel tips</option><option>Wildlife education</option><option>Sri Lanka tourism</option></select></label>
        <label><span>Status</span><select name="status" value={form.status} onChange={updateForm}><option>Draft</option><option>Published</option></select></label>
        <AdminMediaUploadField
          label="Featured image / video"
          value={form.featuredImage}
          folder="blog"
          accept="image/*,video/*"
          onPathChange={(value) => setForm((current) => ({ ...current, featuredImage: value }))}
          onUploaded={(fileUrl) => setForm((current) => ({ ...current, featuredImage: fileUrl }))}
          hint="Upload a blog cover image. Video files will also preview/play where supported."
        />
        <label className="package-editor-full"><span>Excerpt</span><textarea name="excerpt" value={form.excerpt} onChange={updateForm} rows="3" /></label>
        <label className="package-editor-full"><span>Article content</span><textarea name="content" value={form.content} onChange={updateForm} rows="8" /></label>
        <label className="package-editor-full"><span>SEO meta title</span><input name="metaTitle" value={form.metaTitle} onChange={updateForm} /></label>
        <label className="package-editor-full"><span>SEO meta description</span><textarea name="metaDescription" value={form.metaDescription} onChange={updateForm} rows="3" /></label>
        <div className="package-editor-actions"><button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Blog' : 'Create Blog'}</button><button className="admin-ghost-btn" type="button" onClick={resetForm} disabled={saving}>Clear Form</button></div>
        {message && <p className="package-cms-message">{message}</p>}
      </form>
      <div className="admin-edit-grid blog-admin-grid">
        {loading ? <p>Loading blog posts...</p> : rows.map((blog) => (
          <article className="admin-edit-card blog-admin-card" key={blog.id}>
            <div className="gallery-thumb-real"><AdminMediaPreview src={blog.featuredImage || '/images/animals/leopard.png'} alt={blog.title} /></div>
            <span className={`admin-status ${String(blog.status).toLowerCase()}`}>{blog.status}</span>
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <small>/{blog.slug}</small>
            <div className="package-admin-actions"><button type="button" onClick={() => editBlog(blog)} disabled={saving}>Edit</button><button type="button" onClick={() => quickStatus(blog, blog.status === 'Published' ? 'Draft' : 'Published')} disabled={saving}>{blog.status === 'Published' ? 'Move Draft' : 'Publish'}</button><button type="button" className="danger" onClick={() => deleteBlog(blog)} disabled={saving}>Delete</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

const emptyMealPlanForm = {
  id: '',
  title: '',
  badge: 'Meal Plan',
  priceUsd: 8,
  description: '',
  imageUrl: '/images/animals/elephant.png',
  visibility: 'Draft',
  includesText: 'Water bottle\nFresh fruit\nSnack pack',
};

function mealPlanToForm(meal = {}) {
  return {
    id: meal.id || '',
    title: meal.title || '',
    badge: meal.badge || 'Meal Plan',
    priceUsd: meal.priceUsd ?? 8,
    description: meal.description || '',
    imageUrl: meal.imageUrl || '/images/animals/elephant.png',
    visibility: meal.visibility || 'Draft',
    includesText: Array.isArray(meal.includes) && meal.includes.length ? meal.includes.join('\n') : 'Water bottle\nFresh fruit\nSnack pack',
  };
}

function mealPlanPayload(form) {
  return {
    title: form.title,
    badge: form.badge,
    priceUsd: Number(form.priceUsd || 0),
    description: form.description,
    imageUrl: form.imageUrl,
    visibility: form.visibility,
    includes: form.includesText.split('\n').map((item) => item.trim()).filter(Boolean),
  };
}

export function MealPlansPanel() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyMealPlanForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const isEditing = Boolean(form.id);

  async function loadMealPlans() {
    setLoading(true);
    try {
      const response = await fetch('/api/meal-plans', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) setRows(result.mealPlans);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMealPlans().catch(() => setLoading(false)); }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function editMealPlan(meal) {
    setForm(mealPlanToForm(meal));
    setMessage(`Editing ${meal.title}`);
    setTimeout(() => document.getElementById('meal-plan-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function resetForm() {
    setForm(emptyMealPlanForm);
    setMessage('');
  }

  async function handleMealImageUploaded(fileUrl) {
    setForm((current) => ({ ...current, imageUrl: fileUrl }));
    if (!isEditing) {
      setMessage('Photo uploaded. Complete the details and click Create Meal Plan.');
      return;
    }

    setSaving(true);
    setMessage('Photo uploaded. Updating meal plan image...');
    try {
      const payload = mealPlanPayload({ ...form, imageUrl: fileUrl });
      const response = await fetch(`/api/meal-plans/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update meal plan image.');
      await loadMealPlans();
      setForm(mealPlanToForm(result.mealPlan));
      setMessage('Meal photo uploaded and saved successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveMealPlan(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('Saving meal plan...');
    try {
      const endpoint = isEditing ? `/api/meal-plans/${form.id}` : '/api/meal-plans';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealPlanPayload(form)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save meal plan.');
      await loadMealPlans();
      setForm(emptyMealPlanForm);
      setMessage(isEditing ? 'Meal plan updated. Published plans are visible in the booking flow.' : 'Meal plan created. Publish it to show in the booking flow.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdate(meal, patch) {
    setSaving(true);
    setMessage('Updating meal plan...');
    try {
      const payload = mealPlanPayload(mealPlanToForm({ ...meal, ...patch }));
      const response = await fetch(`/api/meal-plans/${meal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update meal plan.');
      setRows((items) => items.map((item) => item.id === meal.id ? result.mealPlan : item));
      setMessage(`${result.mealPlan.title} is now ${result.mealPlan.visibility}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMealPlan(meal) {
    if (!confirm(`Delete ${meal.title}?`)) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/meal-plans/${meal.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to delete meal plan.');
      setRows((items) => items.filter((item) => item.id !== meal.id));
      if (form.id === meal.id) resetForm();
      setMessage('Meal plan deleted.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel-card meal-plan-cms-panel">
      <div className="admin-card-heading">
        <div>
          <span>Meal Plan CMS</span>
          <h2>Create beautiful add-on meal plans for safari bookings</h2>
        </div>
        <p className="admin-note">Published meal plans appear after the visitor taps Continue in the booking form. They can select one or more plans and choose person counts.</p>
      </div>

      <form id="meal-plan-editor" className="package-editor-form" onSubmit={saveMealPlan}>
        <div className="package-editor-title">
          <span>{isEditing ? 'Edit Meal Plan' : 'Create Meal Plan'}</span>
          <h3>{isEditing ? form.title || 'Selected meal plan' : 'New meal plan'}</h3>
        </div>
        <label><span>Title</span><input name="title" value={form.title} onChange={updateForm} placeholder="Safari Breakfast Box" required /></label>
        <label><span>Badge</span><input name="badge" value={form.badge} onChange={updateForm} placeholder="Morning Safari Favorite" /></label>
        <label><span>Price USD per person</span><input name="priceUsd" type="number" min="0" value={form.priceUsd} onChange={updateForm} /></label>
        <label><span>Visibility</span><select name="visibility" value={form.visibility} onChange={updateForm}><option>Draft</option><option>Published</option></select></label>
        <AdminMediaUploadField
          label="Meal photo"
          value={form.imageUrl}
          folder="meals"
          accept="image/*"
          onPathChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))}
          onUploaded={(fileUrl) => handleMealImageUploaded(fileUrl)}
          hint="Upload a beautiful meal photo from your computer."
        />
        <label className="package-editor-full"><span>Description</span><textarea name="description" value={form.description} onChange={updateForm} rows="3" placeholder="Short, attractive description for foreign tourists..." /></label>
        <label className="package-editor-full"><span>Included items — one item per line</span><textarea name="includesText" value={form.includesText} onChange={updateForm} rows="5" /></label>
        <div className="package-editor-actions">
          <button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : isEditing ? 'Update Meal Plan' : 'Create Meal Plan'}</button>
          <button className="admin-ghost-btn" type="button" onClick={resetForm} disabled={saving}>Clear Form</button>
        </div>
        {message && <p className="package-cms-message">{message}</p>}
      </form>

      <div className="admin-edit-grid meal-plan-admin-grid">
        {loading ? <p>Loading meal plans...</p> : rows.map((meal) => (
          <article className="admin-edit-card meal-plan-admin-card" key={meal.id}>
            <div className="gallery-thumb-real"><AdminMediaPreview src={meal.imageUrl || '/images/animals/elephant.png'} alt={meal.title} /></div>
            <span className={`admin-status ${String(meal.visibility).toLowerCase()}`}>{meal.visibility}</span>
            <h3>{meal.title}</h3>
            <p>{meal.description}</p>
            <strong>${Number(meal.priceUsd || 0)} per person</strong>
            <small>{Array.isArray(meal.includes) ? meal.includes.join(' • ') : ''}</small>
            <div className="package-admin-actions">
              <button type="button" onClick={() => editMealPlan(meal)} disabled={saving}>Edit</button>
              <button type="button" onClick={() => quickUpdate(meal, { visibility: meal.visibility === 'Published' ? 'Draft' : 'Published' })} disabled={saving}>{meal.visibility === 'Published' ? 'Move Draft' : 'Publish'}</button>
              <button type="button" className="danger" onClick={() => deleteMealPlan(meal)} disabled={saving}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
