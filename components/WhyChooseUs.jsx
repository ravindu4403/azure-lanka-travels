const reasons = [
  {
    title: 'Local Knowledge & Experience',
    text: 'As a locally based company rooted in Kataragama, we know Yala National Park in a way no outsider can replicate. Our guides have spent years learning wildlife behavior, animal movements by season, and the exact timing and locations that consistently deliver the most remarkable sightings. We don’t follow generic tourist routes — we go where the wildlife is.',
  },
  {
    title: 'Local Knowledge & Experience',
    text: 'As a locally based company rooted in Kataragama, we know Yala National Park in a way no outsider can replicate. Our guides have spent years learning wildlife behavior, animal movements by season, and the exact timing and locations that consistently deliver the most remarkable sightings. We don’t follow generic tourist routes — we go where the wildlife is.',
  },
  {
    title: 'Local Knowledge & Experience',
    text: 'As a locally based company rooted in Kataragama, we know Yala National Park in a way no outsider can replicate. Our guides have spent years learning wildlife behavior, animal movements by season, and the exact timing and locations that consistently deliver the most remarkable sightings. We don’t follow generic tourist routes — we go where the wildlife is.',
  },
  {
    title: 'Local Knowledge & Experience',
    text: 'As a locally based company rooted in Kataragama, we know Yala National Park in a way no outsider can replicate. Our guides have spent years learning wildlife behavior, animal movements by season, and the exact timing and locations that consistently deliver the most remarkable sightings. We don’t follow generic tourist routes — we go where the wildlife is.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="section figma-page why-section">
      <span className="small-label left-label">Why Azure Lanka</span>
      <h2>Why Travelers Choose Us</h2>
      <p className="section-intro left-intro">
        We understand that every traveler wants a safe, comfortable, and genuinely memorable safari. We focus on personal service,
        deep local knowledge, and reliable support from your very first message to the moment you leave the park.
      </p>
      <div className="why-grid">
        {reasons.map((item, index) => (
          <article className={`why-card ${index % 2 ? 'gold-border' : ''}`} key={`${item.title}-${index}`}>
            <div className="why-icon-image-wrap">
              <img className="why-icon-image" src="/images/icons/local-knowledge.png" alt="Local knowledge icon" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
