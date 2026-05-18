const faqs = [
  ['What is the best time for a Yala safari?', 'Early morning and late afternoon are popular because wildlife is often more active and the light is better for photography.'],
  ['How many people can travel in one safari jeep?', 'The standard planning rule is maximum 6 guests per jeep. If the group has 7 guests, the booking should use 2 jeeps.'],
  ['Can foreign tourists book through WhatsApp?', 'Yes. The fastest way is to send the safari type, date, number of adults and children, pickup location, and email through WhatsApp.'],
  ['Does Azure Lanka Travels arrange accommodation?', 'The website can collect accommodation requests, but it is not an online hotel booking engine. The team can manually guide travelers with hotel options.'],
];

export default function FAQSection() {
  return (
    <section className="section faq-section figma-page" id="faq">
      <span className="small-label right-label">Travel Questions</span>
      <h2 className="center-title">Yala Safari FAQ</h2>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details className="faq-item mobile-card" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export { faqs };
