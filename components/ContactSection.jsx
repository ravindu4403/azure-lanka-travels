import { getWhatsappUrl } from '@/lib/siteSettings';
import ContactRequestForm from '@/components/ContactRequestForm';

export default function ContactSection({ settings }) {
  const whatsappUrl = getWhatsappUrl(settings, 'Hello Azure Lanka Travels, I need help planning a safari.');
  return (
    <section id="contact" className="section contact-section figma-page">
      <div>
        <span className="small-label left-label">Contact Azure Lanka</span>
        <h2>Ready For The Wild?</h2>
        <p>Tell us your preferred safari date, group size, and pickup location. We will guide you with the best package and next steps.</p>
      </div>
      <div className="contact-layout-grid">
      <div className="contact-card">
        <img src={settings?.logoPath || '/logos/azure-logo-transparent.png'} alt="Azure Lanka Travels" />
        <a href={`mailto:${settings?.email}`}>{settings?.email}</a>
        <a href={whatsappUrl} target="_blank">Chat on WhatsApp</a>
        <span>{settings?.location}</span>
        <span>{settings?.businessHours}</span>
        <div className="contact-social-links">
          {settings?.facebookUrl ? <a href={settings.facebookUrl} target="_blank">Facebook</a> : null}
          {settings?.instagramUrl ? <a href={settings.instagramUrl} target="_blank">Instagram</a> : null}
        </div>
      </div>
      <ContactRequestForm />
      </div>
    </section>
  );
}
