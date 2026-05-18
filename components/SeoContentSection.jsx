const seoBlocks = [
  {
    title: 'Yala Safari Booking Made Simple',
    text: 'Azure Lanka Travels helps foreign travelers book reliable Yala National Park safari experiences with clear package guidance, fast WhatsApp support, and comfortable safari jeeps.',
  },
  {
    title: 'Best For Wildlife Lovers',
    text: 'Yala is famous for leopards, elephants, sloth bears, crocodiles, spotted deer, and rich birdlife. Our safari plans are designed for memorable wildlife viewing and photography moments.',
  },
  {
    title: 'Built Around Tourist Trust',
    text: 'From the first message to the final park exit, we focus on safe travel, local knowledge, transparent communication, and a smooth safari booking experience for couples, families, and small groups.',
  },
];

export default function SeoContentSection() {
  return (
    <section className="section seo-section figma-page" id="seo-guide">
      <span className="small-label left-label">Yala Safari Guide</span>
      <h2>Book A Premium Yala National Park Safari In Sri Lanka</h2>
      <p className="section-intro left-intro">
        Planning a Yala safari should be simple, safe, and exciting. This page is structured to help travelers quickly understand the safari options, wildlife highlights, jeep requirements, and booking process.
      </p>
      <div className="seo-card-grid">
        {seoBlocks.map((block) => (
          <article className="seo-card mobile-card" key={block.title}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
      <div className="seo-internal-links" aria-label="Important safari pages">
        <a href="/yala-safari-booking">Yala Safari Booking</a>
        <a href="/full-day-yala-safari">Full-Day Yala Safari</a>
        <a href="/half-day-yala-safari">Half-Day Yala Safari</a>
      </div>
    </section>
  );
}
