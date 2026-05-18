'use client';

import { useEffect, useMemo, useState } from 'react';
import { reviewRecords } from '@/data/reviews';

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState(reviewRecords);
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadReviews() {
      const response = await fetch('/api/reviews', { cache: 'no-store' });
      const result = await response.json();
      if (!ignore && result.success) setReviews(result.reviews);
    }
    loadReviews().catch(() => {});
    return () => { ignore = true; };
  }, []);

  const counts = useMemo(() => ({
    pending: reviews.filter((review) => review.status === 'pending').length,
    approved: reviews.filter((review) => review.status === 'approved').length,
    rejected: reviews.filter((review) => review.status === 'rejected').length,
  }), [reviews]);

  const changeStatus = async (id, status) => {
    setSavingId(id);
    try {
      const response = await fetch(`/api/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to update review.');
      setReviews((items) => items.map((review) => review.id === id ? result.review : review));
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="admin-reviews-page">
      <div className="approval-summary-grid">
        <article><span>Pending Approval</span><strong>{counts.pending}</strong><p>These are hidden from the public website.</p></article>
        <article><span>Approved Reviews</span><strong>{counts.approved}</strong><p>Only these reviews appear on the website.</p></article>
        <article><span>Rejected / Spam</span><strong>{counts.rejected}</strong><p>Keep low-quality or fake reviews unpublished.</p></article>
      </div>

      <section className="admin-panel-card">
        <div className="admin-card-heading">
          <div>
            <span>Review Approval Workflow</span>
            <h2>Approve before publishing</h2>
          </div>
          <p className="admin-note">New customer reviews are saved as pending. Public website shows approved reviews only.</p>
        </div>

        <div className="review-approval-list">
          {reviews.map((review) => (
            <article className="review-approval-card" key={review.id}>
              <div className="review-approval-main">
                <div className="review-avatar">{review.name.charAt(0)}</div>
                <div>
                  <div className="review-meta-line">
                    <strong>{review.name}</strong>
                    <span>{review.country}</span>
                    <em>{'★'.repeat(review.rating)}</em>
                  </div>
                  <p>“{review.text}”</p>
                  <small>{review.id} · {review.source} · {review.submittedAt}</small>
                </div>
              </div>
              <div className="review-approval-actions">
                <span className={`admin-status ${review.status}`}>{review.status}</span>
                <button type="button" disabled={savingId === review.id} onClick={() => changeStatus(review.id, 'approved')}>Approve</button>
                <button type="button" disabled={savingId === review.id} onClick={() => changeStatus(review.id, 'pending')}>Pending</button>
                <button type="button" disabled={savingId === review.id} className="danger" onClick={() => changeStatus(review.id, 'rejected')}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
