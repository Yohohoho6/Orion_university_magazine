import React, { useState } from "react";
import { Button } from "@heroui/react";
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuClock,
  LuSend,
  LuCheck,
  LuFacebook,
  LuTwitter,
  LuLinkedin,
  LuInstagram,
  LuMap,
  LuHeadphones,
  LuFileText,
} from "react-icons/lu";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { useSubmitContact } from "@/features/contact/hooks/useSubmitContact";
import { useTrackPageView } from "@/utils/useTrackPageView";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .cp-root {
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  .cp-root h1, .cp-root h2, .cp-root h3 {
    font-family: 'Lora', serif;
  }

  /* Hero */
  .cp-hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
    padding: 96px 0 72px;
    position: relative;
    overflow: hidden;
  }

  .cp-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(245,124,0,0.1);
    pointer-events: none;
  }

  .cp-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(99,102,241,0.08);
    pointer-events: none;
  }

  .cp-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(245,124,0,0.15);
    border: 1px solid rgba(245,124,0,0.3);
    color: #fbbf24;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    margin-bottom: 20px;
  }

  .cp-hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 18px;
  }

  .cp-hero p {
    font-size: 1.05rem;
    color: #bfdbfe;
    line-height: 1.75;
    max-width: 560px;
  }

  /* Info cards */
  .cp-info-card {
    background: #fff;
    border-radius: 14px;
    padding: 24px 20px;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
  }
  .cp-info-card:hover {
    border-color: #f57c00;
    box-shadow: 0 6px 24px rgba(245,124,0,0.08);
    transform: translateY(-2px);
  }

  .cp-info-icon {
    width: 52px; height: 52px;
    background: rgba(245,124,0,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
    color: #f57c00;
  }

  .cp-info-card h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .cp-info-card p {
    font-size: 0.825rem;
    color: #6b7280;
    line-height: 1.65;
    margin: 0;
  }

  /* Form section */
  .cp-section-tag {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f57c00;
    margin-bottom: 10px;
  }

  .cp-form-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    border: 1px solid #e5e7eb;
  }

  .cp-form-title {
    font-size: clamp(1.4rem, 3vw, 1.75rem);
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
  }

  .cp-form-sub {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.65;
    margin-bottom: 28px;
  }

  .cp-field { margin-bottom: 18px; }

  .cp-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }

  .cp-input, .cp-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: #111827;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    background: #fff;
    box-sizing: border-box;
  }

  .cp-input::placeholder, .cp-textarea::placeholder { color: #9ca3af; }

  .cp-input:focus, .cp-textarea:focus {
    border-color: #f57c00;
    box-shadow: 0 0 0 3px rgba(245,124,0,0.1);
  }

  .cp-textarea { resize: none; }

  .cp-submit-btn {
    width: 100%;
    background: #1e3a8a !important;
    color: #fff !important;
    border: none !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    height: 48px !important;
    border-radius: 8px !important;
    transition: background 0.2s !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
  }
  .cp-submit-btn:hover { background: #172554 !important; }
  .cp-submit-btn:disabled { opacity: 0.7 !important; cursor: not-allowed !important; }

  /* Success state */
  .cp-success {
    background: rgba(245,124,0,0.04);
    border: 1.5px solid rgba(245,124,0,0.25);
    border-radius: 14px;
    padding: 40px 24px;
    text-align: center;
  }

  .cp-success-icon {
    width: 60px; height: 60px;
    background: rgba(245,124,0,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    color: #f57c00;
  }

  .cp-success h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  .cp-success p {
    font-size: 0.9rem;
    color: #6b7280;
  }

  /* Side cards */
  .cp-quick-card {
    border-radius: 14px;
    background: linear-gradient(135deg, #f57c00 0%, #0f766e 100%);
    padding: 28px;
    color: #fff;
  }

  .cp-quick-card h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
  }

  .cp-quick-card p {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.65;
    margin-bottom: 16px;
  }

  .cp-ghost-btn {
    display: inline-flex;
    align-items: center;
    background: rgba(255,255,255,0.15) !important;
    border: 1px solid rgba(255,255,255,0.3) !important;
    color: #fff !important;
    font-size: 0.825rem !important;
    font-weight: 500 !important;
    height: 36px !important;
    padding: 0 16px !important;
    border-radius: 6px !important;
    transition: background 0.18s !important;
  }
  .cp-ghost-btn:hover { background: rgba(255,255,255,0.25) !important; }

  .cp-side-card {
    background: #fff;
    border-radius: 14px;
    padding: 24px;
    border: 1px solid #e5e7eb;
  }

  .cp-side-card.navy-border { border: 1.5px solid rgba(30,58,138,0.2); }

  .cp-side-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
  }

  .cp-side-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
    margin-bottom: 14px;
  }

  .cp-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 0.825rem;
    color: #6b7280;
  }

  .cp-bullet-dot { color: #f57c00; margin-top: 2px; flex-shrink: 0; }

  .cp-outline-btn {
    display: inline-flex;
    align-items: center;
    border: 1.5px solid #1e3a8a !important;
    background: transparent !important;
    color: #1e3a8a !important;
    font-size: 0.825rem !important;
    font-weight: 500 !important;
    height: 36px !important;
    padding: 0 16px !important;
    border-radius: 6px !important;
    transition: background 0.18s !important;
  }
  .cp-outline-btn:hover { background: rgba(30,58,138,0.05) !important; }

  .cp-connect-bg {
    background: #f8fafc;
    border-radius: 14px;
    padding: 24px;
    border: 1px solid #e5e7eb;
  }

  .cp-connect-bg h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .cp-connect-bg p {
    font-size: 0.825rem;
    color: #6b7280;
    margin-bottom: 14px;
    line-height: 1.6;
  }

  .cp-social-btn {
    width: 38px; height: 38px;
    background: #1e3a8a;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: background 0.18s;
    border: none;
    flex-shrink: 0;
  }
  .cp-social-btn:hover { background: #f57c00; }

  /* Map placeholder */
  .cp-map {
    background: #f0f4ff;
    border-radius: 16px;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    gap: 10px;
  }

  .cp-map-icon {
    width: 56px; height: 56px;
    background: rgba(245,124,0,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #f57c00;
    margin-bottom: 4px;
  }

  .cp-map p {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
    text-align: center;
  }

  .cp-map .cp-map-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    font-family: 'Lora', serif;
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const infoCards = [
  {
    icon: <LuMail size={22} />,
    title: "Email",
    lines: ["orion@university.edu", "support@orion.edu"],
  },
  {
    icon: <LuPhone size={22} />,
    title: "Phone",
    lines: ["+1 (555) 123-4567", "Mon–Fri 9:00 AM – 5:00 PM"],
  },
  {
    icon: <LuMapPin size={22} />,
    title: "Office Location",
    lines: ["Student Center, Room 301", "123 University Ave"],
  },
  {
    icon: <LuClock size={22} />,
    title: "Office Hours",
    lines: ["Monday – Friday: 9:00 AM – 5:00 PM", "Saturday: 10:00 AM – 2:00 PM"],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactPage() {
  const [form, setForm] = useState({ full_name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { mutate: submitContact, isPending } = useSubmitContact();
  const { mutate } = useTrackPageView("Contact Page");

  React.useEffect(() => {
    mutate();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitContact(form, {
      onSuccess: () => {
        setSubmitted(true);
      }
    });
  };

  return (
    <>
      <style>{styles}</style>
      <Header />
      <div className="cp-root">

        {/* ── Hero ── */}
        <section className="cp-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ position: "relative", zIndex: 1, maxWidth: "640px" }}>
              <div className="cp-hero-tag">
                <LuMail size={12} />
                Contact Us
              </div>
              <h1>Get in Touch</h1>
              <p>
                Have questions or need assistance? Our team is here to help you
                with your submissions and any platform-related inquiries.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* ── Info Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {infoCards.map((card) => (
                <div key={card.title} className="cp-info-card">
                  <div className="cp-info-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* ── Form + Side panel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* Left: form */}
              <div>
                <span className="cp-section-tag">Drop us a line</span>
                {submitted ? (
                  <div className="cp-success">
                    <div className="cp-success-icon">
                      <LuCheck size={28} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for contacting us. We'll respond within 24–48 hours.</p>
                  </div>
                ) : (
                  <div className="cp-form-card">
                    <h2 className="cp-form-title">Send Us a Message</h2>
                    <p className="cp-form-sub">
                      Fill out the form below and we'll get back to you as soon
                      as possible. For urgent matters, please call our office
                      directly.
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="cp-field">
                        <label className="cp-label" htmlFor="full_name">Full Name *</label>
                        <input
                          className="cp-input"
                          id="full_name"
                          name="full_name"
                          type="text"
                          placeholder="John Doe"
                          value={form.full_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="cp-field">
                        <label className="cp-label" htmlFor="email">Email Address *</label>
                        <input
                          className="cp-input"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@gmail.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="cp-field">
                        <label className="cp-label" htmlFor="subject">Subject *</label>
                        <input
                          className="cp-input"
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Submission inquiry"
                          value={form.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="cp-field">
                        <label className="cp-label" htmlFor="message">Message *</label>
                        <textarea
                          className="cp-textarea"
                          id="message"
                          name="message"
                          placeholder="Please describe your inquiry or concern..."
                          rows={6}
                          value={form.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="cp-submit-btn"
                        isLoading={isPending}
                        disabled={isPending}
                        startContent={!isPending && <LuSend size={15} />}
                      >
                        {isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Right: side cards */}
              <div className="flex flex-col gap-5">

                {/* Quick Support */}
                <div className="cp-quick-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <LuHeadphones size={20} />
                    <h3 style={{ margin: 0 }}>Quick Support</h3>
                  </div>
                  <p>
                    Looking for immediate answers? Check out our frequently
                    asked questions or browse our knowledge base.
                  </p>
                  <Button className="cp-ghost-btn">Visit FAQ</Button>
                </div>

                {/* Technical Support */}
                <div className="cp-side-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <LuPhone size={16} style={{ color: "#f57c00" }} />
                    <h3 style={{ margin: 0 }}>Technical Support</h3>
                  </div>
                  <p>
                    Experiencing technical issues with the platform? Our IT team
                    is available to assist you.
                  </p>
                  <div className="cp-bullet">
                    <span className="cp-bullet-dot">•</span>
                    <span>Email: support@orion.edu</span>
                  </div>
                  <div className="cp-bullet">
                    <span className="cp-bullet-dot">•</span>
                    <span>Response time: Within 24 hours</span>
                  </div>
                </div>

                {/* Submission Guidelines */}
                <div className="cp-side-card navy-border">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <LuFileText size={16} style={{ color: "#1e3a8a" }} />
                    <h3 style={{ margin: 0 }}>Submission Guidelines</h3>
                  </div>
                  <p>
                    Before submitting your work, please review our submission
                    guidelines to ensure your content meets our standards.
                  </p>
                  <Button className="cp-outline-btn">View Guidelines</Button>
                </div>

                {/* Connect With Us */}
                <div className="cp-connect-bg">
                  <h3>Connect With Us</h3>
                  <p>
                    Follow us on social media for updates, featured articles,
                    and community highlights.
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[
                      { icon: <LuFacebook size={16} />, label: "Facebook" },
                      { icon: <LuTwitter size={16} />, label: "Twitter" },
                      { icon: <LuLinkedin size={16} />, label: "LinkedIn" },
                      { icon: <LuInstagram size={16} />, label: "Instagram" },
                    ].map(({ icon, label }) => (
                      <button key={label} className="cp-social-btn" aria-label={label}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Map Placeholder ── */}
        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="cp-map">
              <div className="cp-map-icon">
                <LuMap size={26} />
              </div>
              <p className="cp-map-title">Interactive Map Coming Soon</p>
              <p>Student Center, Room 301 &bull; 123 University Ave</p>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}