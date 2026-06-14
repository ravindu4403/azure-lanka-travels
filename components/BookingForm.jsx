'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  country: 'United Kingdom',
  nationality: 'General Countries',
  whatsapp: '',
  email: '',
  note: '',
};

const defaultSafariTravelPricesUsd = {
  'Full-Day Yala Safari': 120,
  'Half-Day Morning Safari': 70,
  'Half-Day Evening Safari': 70,
  '5-12 Yala Safari': 90,
};

const defaultPricingSettings = {
  exchangeRateLkr: 305,
  jeepCapacity: 6,
  generalAdultTicketUsd: 50,
  generalChildTicketUsd: 25,
  saarcAdultTicketUsd: 30,
  saarcChildTicketUsd: 15,
  localAdultTicketUsd: 15,
  localChildTicketUsd: 8,
  safariPriceMode: 'perJeep',
  safariTravelPricesUsd: defaultSafariTravelPricesUsd,
  serviceFeeUsd: 0,
  showLkrTotal: true,
  calculatorNote: 'Final amount is confirmed by our team on WhatsApp before payment.',
};

const saarcCountries = ['Afghanistan', 'Bangladesh', 'Bhutan', 'India', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka'];

const countryOptions = [
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Australia', 'United States', 'Canada',
  ...saarcCountries,
  'China', 'Japan', 'South Korea', 'Other Country',
];

function priceToUsd(value) {
  const number = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

export default function BookingForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [safariPackages, setSafariPackages] = useState(fallbackSafariTypes);
  const [mealPlans, setMealPlans] = useState(fallbackMealPlans);
  const [pricingSettings, setPricingSettings] = useState(defaultPricingSettings);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [calculatorMeals, setCalculatorMeals] = useState({});
  const [selectedNotice, setSelectedNotice] = useState('');
  const [step, setStep] = useState('details');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [bookingId, setBookingId] = useState('');
  const mealSelectRef = useRef(null);

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

    async function loadPricingSettings() {
      try {
        const response = await fetch('/api/pricing-settings', { cache: 'no-store' });
        const result = await response.json();
        if (!ignore && result.success && result.pricingSettings) {
          setPricingSettings({ ...defaultPricingSettings, ...result.pricingSettings });
        }
      } catch (error) {
        // Keep fallback pricing for static preview/build mode.
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
    loadPricingSettings();
    window.addEventListener('azure-package-selected', selectPackage);
    return () => {
      ignore = true;
      window.removeEventListener('azure-package-selected', selectPackage);
    };
  }, []);

  useEffect(() => {
    const isOpen = step === 'meal-choice';
    document.body.classList.toggle('meal-modal-open', isOpen);
    return () => document.body.classList.remove('meal-modal-open');
  }, [step]);

  useEffect(() => {
    if (step !== 'meal-select') return;
    const timer = window.setTimeout(() => {
      mealSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [step]);

  const adultsCount = Math.max(0, Number(form.adults || 0));
  const childrenCount = Math.max(0, Number(form.children || 0));
  const totalGuests = adultsCount + childrenCount;
  const jeepCapacity = Math.max(1, Number(pricingSettings.jeepCapacity || 6));
  const jeepCount = Math.max(1, Math.ceil(totalGuests / jeepCapacity));
  const selectedSafariPackage = safariPackages.find((pkg) => pkg.title === form.safariType) || safariPackages[0] || fallbackSafariTypes[0];
  const safariUnitPriceUsd = Number(
    pricingSettings.safariTravelPricesUsd?.[selectedSafariPackage?.title] ?? priceToUsd(selectedSafariPackage?.price)
  );
  const safariPriceUsd = Number((pricingSettings.safariPriceMode === 'perBooking' ? safariUnitPriceUsd : safariUnitPriceUsd * jeepCount).toFixed(2));
  const visitorCategory = form.nationality === 'Local / Resident' || form.country === 'Sri Lanka'
    ? 'local'
    : saarcCountries.includes(form.country) || form.nationality === 'SAARC Countries'
      ? 'saarc'
      : 'general';
  const adultTicketUsd = Number(pricingSettings[`${visitorCategory}AdultTicketUsd`] || pricingSettings.generalAdultTicketUsd || 0);
  const childTicketUsd = Number(pricingSettings[`${visitorCategory}ChildTicketUsd`] || pricingSettings.generalChildTicketUsd || 0);
  const ticketTotalUsd = Number(((adultsCount * adultTicketUsd) + (childrenCount * childTicketUsd)).toFixed(2));
  const serviceFeeUsd = Number(pricingSettings.serviceFeeUsd || 0);
  const calculatorMealSelections = useMemo(() => {
    return mealPlans.map((meal) => {
      const persons = Math.max(0, Number(calculatorMeals[meal.id] || 0));
      const priceUsd = Math.max(0, Number(meal.priceUsd || 0));
      return { id: meal.id, title: meal.title, priceUsd, persons, lineTotalUsd: Number((priceUsd * persons).toFixed(2)) };
    }).filter((item) => item.persons > 0);
  }, [mealPlans, calculatorMeals]);
  const calculatorMealTotalUsd = Number(calculatorMealSelections.reduce((sum, item) => sum + item.lineTotalUsd, 0).toFixed(2));
  const calculatorTotalUsd = Number((ticketTotalUsd + safariPriceUsd + calculatorMealTotalUsd + serviceFeeUsd).toFixed(2));
  const calculatorTotalLkr = Number((calculatorTotalUsd * Number(pricingSettings.exchangeRateLkr || 0)).toFixed(0));

  const mealSelections = useMemo(() => {
    return mealPlans
      .filter((meal) => selectedMeals[meal.id]?.selected)
      .map((meal) => {
        const persons = Math.max(0, Number(selectedMeals[meal.id]?.persons ?? 0));
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
  const grandTotalUsd = Number((ticketTotalUsd + safariPriceUsd + mealTotalUsd + serviceFeeUsd).toFixed(2));

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
      `Country: ${form.country || 'Not selected'}`,
      `Visitor Category: ${form.nationality || 'Not selected'}`,
      `WhatsApp: ${form.whatsapp || 'Not added'}`,
      `Email: ${form.email || 'Not added'}`,
      `Note: ${form.note || 'No special note'}`,
      '',
      'Meal Plans:',
      mealLines,
      '',
      `Park Tickets: $${ticketTotalUsd}`,
      `Safari / Travel: $${safariPriceUsd}`,
      `Meal Total: $${effectiveMealTotalUsd}`,
      `Service Fee: $${serviceFeeUsd}`,
      `Full Estimated Total: $${effectiveGrandTotalUsd} USD`,
      `Estimated LKR: LKR ${Math.round(effectiveGrandTotalUsd * Number(pricingSettings.exchangeRateLkr || 0)).toLocaleString()}`,
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
      const existing = current[meal.id] || { selected: false, persons: 0 };
      return {
        ...current,
        [meal.id]: { ...existing, selected: !existing.selected, persons: Number(existing.persons ?? 0) },
      };
    });
  }

  function updateMealPersons(mealId, value) {
    setSelectedMeals((current) => ({
      ...current,
      [mealId]: { ...(current[mealId] || { selected: true }), selected: true, persons: Math.max(0, Number(value || 0)) },
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
          country: form.country,
          visitorCategory: form.nationality,
          ticketTotalUsd,
          serviceFeeUsd,
          exchangeRateLkr: pricingSettings.exchangeRateLkr,
          grandTotalUsd: includeMeals ? grandTotalUsd : Number((ticketTotalUsd + safariPriceUsd + serviceFeeUsd).toFixed(2)),
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
      const effectiveGrandTotal = includeMeals ? grandTotalUsd : Number((ticketTotalUsd + safariPriceUsd + serviceFeeUsd).toFixed(2));
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
          <small>{totalGuests || 0} guests • maximum {jeepCapacity} guests per jeep</small>
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
              <span>Country</span>
              <select name="country" value={form.country} onChange={(event) => {
                const nextCountry = event.target.value;
                setForm((current) => ({
                  ...current,
                  country: nextCountry,
                  nationality: nextCountry === 'Sri Lanka' ? 'Local / Resident' : saarcCountries.includes(nextCountry) ? 'SAARC Countries' : 'General Countries',
                }));
              }} required>
                {countryOptions.map((country) => <option key={country}>{country}</option>)}
              </select>
            </label>
            <label>
              <span>Visitor Category</span>
              <select name="nationality" value={form.nationality} onChange={updateField} required>
                <option>General Countries</option>
                <option>SAARC Countries</option>
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

            <div className="public-cost-calculator">
              <div className="cost-calculator-head">
                <span>Live Cost Calculator</span>
                <strong>{form.nationality}</strong>
              </div>
              <div className="cost-calculator-grid">
                <article><span>Park Tickets</span><strong>${ticketTotalUsd}</strong><small>Adults ${adultTicketUsd} × {adultsCount} · Children ${childTicketUsd} × {childrenCount}</small></article>
                <article><span>Safari / Travel</span><strong>${safariPriceUsd}</strong><small>{pricingSettings.safariPriceMode === 'perBooking' ? 'Package price once' : `$${safariUnitPriceUsd} × ${jeepCount} jeep(s)`}</small></article>
                <article><span>Meals Estimate</span><strong>${calculatorMealTotalUsd}</strong><small>Select food quantities below</small></article>
                <article><span>Total Estimate</span><strong>${calculatorTotalUsd}</strong><small>{pricingSettings.showLkrTotal ? `Approx. LKR ${calculatorTotalLkr.toLocaleString()}` : 'USD total only'}</small></article>
              </div>
              <div className="calculator-meal-mini-grid">
                {mealPlans.map((meal) => (
                  <label key={meal.id}>
                    <span>{meal.title} (${Number(meal.priceUsd || 0)} pp)</span>
                    <input type="number" min="0" value={calculatorMeals[meal.id] || 0} onChange={(event) => setCalculatorMeals((current) => ({ ...current, [meal.id]: Math.max(0, Number(event.target.value || 0)) }))} />
                  </label>
                ))}
              </div>
              <small>{pricingSettings.calculatorNote}</small>
            </div>
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
          <div ref={mealSelectRef} className="booking-form mobile-card meal-select-panel">
            <div className="booking-form-head">
              <span>Meal Plan Selection</span>
              <strong>Select one or more meal plans</strong>
            </div>
            <div className="meal-plan-grid-public">
              {mealPlans.map((meal) => {
                const selected = Boolean(selectedMeals[meal.id]?.selected);
                const persons = selectedMeals[meal.id]?.persons ?? 0;
                return (
                  <article className={`meal-plan-public-card ${selected ? 'selected' : ''}`} key={meal.id}>
                    <button type="button" className="meal-toggle-cover" onClick={() => toggleMeal(meal)} aria-label={`Select ${meal.title}`} />
                    <div className="meal-card-image">
                      <img src={meal.imageUrl || '/images/animals/elephant.png'} alt={meal.title} />
                    </div>
                    <div className="meal-card-content">
                      <span className="meal-card-check">{selected ? '✓ Selected' : 'Tap card to select'}</span>
                      <span>{meal.badge || 'Meal Plan'}</span>
                      <h3>{meal.title}</h3>
                      <p>{meal.description}</p>
                      <strong>${Number(meal.priceUsd || 0)} per person</strong>
                    </div>
                    <label className={`meal-person-count ${selected ? 'active' : ''}`}>
                      <span>Persons</span>
                      <input type="number" min="0" value={persons} onChange={(event) => updateMealPersons(meal.id, event.target.value)} disabled={!selected} />
                    </label>
                  </article>
                );
              })}
            </div>
            <div className="booking-total-box">
              <span>Meal Total</span>
              <strong>${mealTotalUsd}</strong>
              <small>Tickets: ${ticketTotalUsd} • Safari/travel: ${safariPriceUsd} • Service: ${serviceFeeUsd}</small>
              <b>Full Estimated Total: ${grandTotalUsd} USD / LKR {Math.round(grandTotalUsd * Number(pricingSettings.exchangeRateLkr || 0)).toLocaleString()}</b>
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
