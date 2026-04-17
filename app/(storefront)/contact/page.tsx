import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import ContactForm from '@/components/contact/ContactForm';
import { getDynamicWhatsAppNumber } from '@/lib/config/whatsapp';

export const metadata = {
  title: 'Contact Us | 7 Sisters Tea Co.',
  description: 'Have questions about our blends? Reach out via WhatsApp or our contact form. Based in Barpeta Road, Assam.',
  alternates: {
    canonical: '/contact'
  }
};

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
      </svg>
    ),
    label: 'WhatsApp',
    value: 'Quick replies within hours',
    highlight: true
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Location',
    value: '7 Sisters Restro, Barpeta Road, Assam, India',
    highlight: false
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Business Hours',
    value: 'Mon – Sat, 9 AM – 7 PM IST',
    highlight: false
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Wholesale & Bulk Orders',
    value: 'Reach out via WhatsApp for B2B pricing',
    highlight: false
  }
];

export default async function ContactPage() {
  const whatsapp = await getDynamicWhatsAppNumber();
  const waUrl = `https://wa.me/${whatsapp}`;
  const waFormUrl = `https://wa.me/${whatsapp}?text=Hi%207%20Sisters%20Tea%20Co.%2C%20I%20have%20a%20query%3A%20`;

  return (
    <>
      {/* Header */}
      <Section className="pt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <Container>
          <Reveal>
            <div className="max-w-2xl space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">Contact Us</p>
              <h1 className="text-4xl font-heading font-semibold md:text-5xl lg:text-6xl leading-tight">
                We'd love to <span className="text-accent italic">hear from you.</span>
              </h1>
              <p className="text-lg text-cream/60 leading-relaxed">
                Whether it's a question about our teas, a wholesale inquiry, or just saying hello — we're here.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 items-start">

            {/* Left — Contact Info */}
            <Reveal>
              <div className="space-y-4">
                {/* WhatsApp CTA — highlighted */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6 hover:border-accent/50 hover:bg-accent/[0.07] transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/25 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent/70 font-semibold">WhatsApp</p>
                    <p className="text-base font-semibold text-cream mt-0.5">Chat for quick help</p>
                    <p className="text-xs text-cream/50 mt-0.5">Replies within hours</p>
                  </div>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent/40 shrink-0 group-hover:text-accent/80 group-hover:translate-x-0.5 transition-all">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* Other info cards */}
                {contactInfo.slice(1).map((item) => (
                  <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-cream/50 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-cream/30 font-semibold">{item.label}</p>
                      <p className="text-sm text-cream/75 mt-1 leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}

                {/* Social proof strip */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.015] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['NS', 'AM', 'RP'].map((initials) => (
                        <div key={initials} className="h-7 w-7 rounded-full bg-accent/20 border-2 border-ink flex items-center justify-center text-[9px] font-bold text-accent">
                          {initials}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-cream/50 leading-snug">
                      <span className="text-cream/80 font-medium">100+ customers</span> already pre-ordered
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right — Contact Form */}
            <Reveal delay={0.1}>
              <ContactForm waUrl={waUrl} />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}



