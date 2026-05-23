'use client';

import { useEffect, useMemo, useState } from 'react';

const fallbackSafariTypes = [
  { title: 'Full-Day Yala Safari', price: '$120' },
  { title: 'Half-Day Morning Safari', price: '$70' },
  { title: 'Half-Day Evening Safari', price: '$70' },
  { title: '5-12 Yala Safari', price: '$90' },
];

const fallbackMealPlans = [
  {
    id: 'MEAL-01',
    title: 'Safari Breakfast Box',
    badge: 'Morning Safari Favorite',
    priceUsd: 8,
    description: 'A fresh breakfast box prepared for early morning safari guests.',
    imageUrl: '/images/meals/breakfast-box.svg',
    visibility: 'Published',
    includes: ['Sandwich or bun', 'Fresh fruit', 'Water bottle', 'Snack pack'],
  },
  {
    id: 'MEAL-02',
    title: 'Picnic Lunch Pack',
    badge: 'Full-Day Safari Choice',
    priceUsd: 12,
    description: 'A convenient lunch pack for full-day safari travelers.',
    imageUrl: '/images/meals/lunch-pack.svg',
    visibility: 'Published',
    includes: ['Rice or light meal', 'Fruit', 'Water bottle', 'Sweet snack'],
  },
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

function priceToUsd(value) {
  const number = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

export default function BookingForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [safariPackages, setSafariPackages] = useState(fallbackSafariTypes);
  const [mealPlans, setMealPlans] = useState(fallbackMealPlans);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [selectedNotice, setSelectedNotice] = useState('');
  const [step, setStep] = useState('details');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadSafariTypes() {
      try {
        const response = await fetch('/api/packages', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success && Array.isArray(result.packages)) {
          const published = result.packages
            .filter((pkg) => String(pkg.visibility || '').toLowerCase() === 'published')
            .map((pkg) => ({ title: pkg.title, price: pkg.price || '$0' }))
            .filter((pkg) => pkg.title);
          if (published.length) setSafariPackages(published);
        }
      } catch (error) {
        // Keep fallback values for static preview/build mode.
      }
    }

    async function loadMealPlans() {
      try {
        const response = await fetch('/api/meal-plans', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success && Array.isArray(result.mealPlans)) {
          const published = result.mealPlans.filter((meal) => String(meal.visibility || '').toLowerCase() === 'published');
          if (published.length) setMealPlans(published);
        }
      } catch (error) {
        // Keep fallback meal plans.
      }
    }

    function selectPackage(event) {
      const packageTitle = event.detail?.packageTitle;
      if (!packageTitle) return;
      setSafariPackages((current) => current.some((pkg) => pkg.title === packageTitle) ? current : [{ title: packageTitle, price: '$0' }, ...current]);
      setForm((current) => ({ ...current, safariType: packageTitle }));
      setSelectedNotice(`${packageTitle} selected. Complete your details and tap Continue.`);
    }

    loadSafariTypes();
    loadMealPlans();
    window.addEventListener('azure-package-selected', selectPackage);
    return () => {
      ignore = true;
      window.removeEventListener('azure-package-selected', selectPackage);
    };
  }, []);

  const totalGuests = Math.max(0, Number(form.adults || 0)) + Math.max(0, Number(form.children || 0));
  const jeepCount = Math.max(1, Math.ceil(totalGuests / 6));
  const selectedSafariPackage = safariPackages.find((pkg) => pkg.title === form.safariType) || safariPackages[0] || fallbackSafariTypes[0];
  const safariPriceUsd = priceToUsd(selectedSafariPackage?.price);

  const mealSelections = useMemo(() => {
    return mealPlans
      .filter((meal) => selectedMeals[meal.id]?.selected)
      .map((meal) => {
        const persons = Math.max(1, Number(selectedMeals[meal.id]?.persons || totalGuests || 1));
        const priceUsd = Math.max(0, Number(meal.priceUsd || 0));
        return {
          id: meal.id,
          title: meal.title,
          priceUsd,
          persons,
          lineTotalUsd: Number((priceUsd * persons).toFixed(2)),
        };
      });
  }, [mealPlans, selectedMeals, totalGuests]);

  const mealTotalUsd = Number(mealSelections.reduce((sum, item) => sum + item.lineTotalUsd, 0).toFixed(2));
  const grandTotalUsd = Number((safariPriceUsd + mealTotalUsd).toFixed(2));

  function buildWhatsappUrl(effectiveMealSelections = mealSelections, effectiveMealTotalUsd = mealTotalUsd, effectiveGrandTotalUsd = grandTotalUsd) {
    const mealLines = effectiveMealSelections.length
      ? effectiveMealSelections.map((item) => `- ${item.title}: ${item.persons} person(s) x $${item.priceUsd} = $${item.lineTotalUsd}`).join('\n')
      : 'No meal plan selected';
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
      '',
      'Meal Plans:',
      mealLines,
      '',
      `Safari Price: $${safariPriceUsd}`,
      `Meal Total: $${effectiveMealTotalUsd}`,
      `Full Estimated Total: $${effectiveGrandTotalUsd}`,
    ].join('\n');
    const number = String(settings?.whatsappNumber || '94700000000').replace(/[^0-9]/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function continueToMealChoice(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setBookingId('');
    setStep('meal-choice');
  }

  function toggleMeal(meal) {
    setSelectedMeals((current) => {
      const existing = current[meal.id] || { selected: false, persons: totalGuests || 1 };
      return {
        ...current,
        [meal.id]: { ...existing, selected: !existing.selected, persons: existing.persons || totalGuests || 1 },
      };
    });
  }

  function updateMealPersons(mealId, value) {
    setSelectedMeals((current) => ({
      ...current,
      [mealId]: { ...(current[mealId] || { selected: true }), selected: true, persons: Math.max(1, Number(value || 1)) },
    }));
  }

  async function submitBooking(includeMeals = true) {
    setStatus({ type: 'loading', message: 'Saving your safari request...' });
    setBookingId('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          mealSelections: includeMeals ? mealSelections : [],
          safariPriceUsd,
          mealTotalUsd: includeMeals ? mealTotalUsd : 0,
          grandTotalUsd: includeMeals ? grandTotalUsd : safariPriceUsd,
        }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Booking request failed.');

      setBookingId(result.booking.id);
      setStatus({
        type: 'success',
        message: 'Done! Your request is saved in Admin → Bookings as Pending. We will confirm through WhatsApp.',
      });
      const effectiveMeals = includeMeals ? mealSelections : [];
      const effectiveMealTotal = includeMeals ? mealTotalUsd : 0;
      const effectiveGrandTotal = includeMeals ? grandTotalUsd : safariPriceUsd;
      window.open(buildWhatsappUrl(effectiveMeals, effectiveMealTotal, effectiveGrandTotal), '_blank', 'noopener,noreferrer');
      setForm((current) => ({ ...current, note: '' }));
      setStep('details');
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
          This is the main booking request area. Visitors can submit their safari details from the homepage, choose optional meal plans, and the request is saved in the admin panel as Pending.
        </p>

        <div className="booking-steps">
          <span>1. Add details</span>
          <span>2. Choose meals</span>
          <span>3. Admin confirms</span>
        </div>

        <div className="booking-app-card" aria-label="Estimated safari booking summary">
          <span>Auto Calculated Jeep Count</span>
          <strong>{jeepCount}</strong>
          <small>{totalGuests || 0} guests • maximum 6 guests per jeep</small>
        </div>
      </div>

      <div className="booking-flow-wrap">
        {step === 'details' && (
          <form className="booking-form mobile-card quick-booking-card" onSubmit={continueToMealChoice}>
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
                {safariPackages.map((type) => <option key={type.title}>{type.title}</option>)}
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
            <button className="booking-submit" type="submit">Continue</button>
            {status.message && <p className={`form-status ${status.type}`}>{status.message}{bookingId ? ` Ref: ${bookingId}` : ''}</p>}
            <small>After Continue: visitor can choose whether to add a meal plan before WhatsApp opens.</small>
          </form>
        )}

        {step === 'meal-choice' && (
          <div className="meal-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="meal-choice-title">
            <div className="meal-modal-card">
              <div className="meal-modal-icon">🍱</div>
              <span className="meal-modal-kicker">Optional Meal Plan</span>
              <h3 id="meal-choice-title">Do you want to add a meal plan?</h3>
              <p>You can skip meals and submit only the safari booking, or add one or more meal plans for selected person counts.</p>
              <div className="meal-modal-actions">
                <button type="button" className="meal-action-button" onClick={() => setStep('details')}>Back</button>
                <button type="button" className="meal-action-button" onClick={() => submitBooking(false)}>No, Submit Safari Only</button>
                <button type="button" className="meal-action-button primary" onClick={() => setStep('meal-select')}>Yes, Add Meal Plans</button>
              </div>
              {status.message && <p className={`form-status ${status.type}`}>{status.message}{bookingId ? ` Ref: ${bookingId}` : ''}</p>}
            </div>
          </div>
        )}

        {step === 'meal-select' && (
          <div className="booking-form mobile-card meal-select-panel">
            <div className="booking-form-head">
              <span>Meal Plan Selection</span>
              <strong>Select one or more meal plans</strong>
            </div>
            <div className="meal-plan-grid-public">
              {mealPlans.map((meal) => {
                const selected = Boolean(selectedMeals[meal.id]?.selected);
                const persons = selectedMeals[meal.id]?.persons || totalGuests || 1;
                return (
                  <article className={`meal-plan-public-card ${selected ? 'selected' : ''}`} key={meal.id}>
                    <button type="button" className="meal-toggle-cover" onClick={() => toggleMeal(meal)} aria-label={`Select ${meal.title}`} />
                    <div className="meal-card-image">
                      <img src={meal.imageUrl || '/images/animals/elephant.png'} alt={meal.title} />
                      <span className="meal-card-check">{selected ? '✓ Selected' : 'Tap to select'}</span>
                    </div>
                    <div className="meal-card-content">
                      <span>{meal.badge || 'Meal Plan'}</span>
                      <h3>{meal.title}</h3>
                      <p>{meal.description}</p>
                      <strong>${Number(meal.priceUsd || 0)} per person</strong>
                    </div>
                    <label className={`meal-person-count ${selected ? 'active' : ''}`}>
                      <span>Persons</span>
                      <input type="number" min="1" value={persons} onChange={(event) => updateMealPersons(meal.id, event.target.value)} disabled={!selected} />
                    </label>
                  </article>
                );
              })}
            </div>
            <div className="booking-total-box">
              <span>Meal Total</span>
              <strong>${mealTotalUsd}</strong>
              <small>Safari selected: {form.safariType} • Safari price: ${safariPriceUsd}</small>
              <b>Full Estimated Total: ${grandTotalUsd} USD</b>
            </div>
            <div className="meal-choice-actions">
              <button type="button" className="admin-ghost-btn" onClick={() => setStep('meal-choice')}>Back</button>
              <button type="button" className="booking-submit" onClick={() => submitBooking(true)} disabled={status.type === 'loading'}>
                {status.type === 'loading' ? 'Saving Request...' : 'Submit Booking & Open WhatsApp'}
              </button>
            </div>
            {status.message && <p className={`form-status ${status.type}`}>{status.message}{bookingId ? ` Ref: ${bookingId}` : ''}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
