'use client';

import { useEffect, useState } from 'react';
import { approvedReviews } from '@/data/reviews';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(approvedReviews);
  const [form, setForm] = useState({ name: '', country: '', rating: '5', text: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    let ignore = false;
    async function loadApprovedReviews() {
      const response = await fetch('/api/reviews?status=approved', { cache: 'no-store' });
      const result = await response.json();
      if (!ignore && result.success) setReviews(result.reviews);
    }
    loadApprovedReviews().catch(() => {});
    return () => { ignore = true; };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitReview(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sending your review for admin approval...' });
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Review submission failed.');
      setStatus({ type: 'success', message: 'Thank you. Your review is now pending admin approval.' });
      setForm({ name: '', country: '', rating: '5', text: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <section className="section reviews-section figma-page" id="reviews">
      <span className="small-label left-label">Guest Stories</span>
      <h2>What Travelers Say</h2>
      <p className="reviews-intro">
        Only admin-approved guest reviews are published here, helping foreign travelers see real, trusted experiences before booking.
      </p>
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="stars">{'★'.repeat(review.rating)}</div>
            <p>“{review.text}”</p>
            <strong>{review.name}</strong>
            <span>{review.country}</span>
          </article>
        ))}
      </div>
      <div className="review-submit-card review-submit-form-card" id="leave-review">
        <div>
          <span>After Your Safari</span>
          <h3>Share your Yala experience</h3>
          <p>Traveler reviews go to the admin panel first. After approval, the best real stories appear on the website.</p>
        </div>
        <form className="public-review-form" onSubmit={submitReview}>
          <div className="form-row">
            <input name="name" placeholder="Your name" value={form.name} onChange={updateField} required />
            <input name="country" placeholder="Country" value={form.country} onChange={updateField} required />
          </div>
          <select name="rating" value={form.rating} onChange={updateField} aria-label="Review rating">
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★ Very good</option>
            <option value="3">★★★ Good</option>
            <option value="2">★★ Fair</option>
            <option value="1">★ Poor</option>
          </select>
          <textarea name="text" rows="3" placeholder="Write your safari experience..." value={form.text} onChange={updateField} required />
          <button type="submit" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Sending...' : 'Send Review For Approval'}</button>
          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
        </form>
      </div>
    </section>
  );
}
