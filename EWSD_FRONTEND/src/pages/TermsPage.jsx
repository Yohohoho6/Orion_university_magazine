import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  LuShield,
  LuFileText,
  LuUsers,
  LuBadgeAlert,
  LuCheck,
  LuX,
  LuLock,
  LuClipboardCheck,
  LuPenLine,
  LuScale,
  LuMail,
  LuPhone,
} from "react-icons/lu";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { useTrackPageView } from "@/utils/useTrackPageView";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .tp-root {
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  .tp-root h1, .tp-root h2, .tp-root h3 {
    font-family: 'Lora', serif;
  }

  /* Hero */
  .tp-hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
    padding: 96px 0 72px;
    position: relative;
    overflow: hidden;
  }

  .tp-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(245,124,0,0.1);
    pointer-events: none;
  }

  .tp-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(99,102,241,0.08);
    pointer-events: none;
  }

  .tp-hero-tag {
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

  .tp-hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 18px;
  }

  .tp-hero p {
    font-size: 1.05rem;
    color: #bfdbfe;
    line-height: 1.75;
    max-width: 600px;
  }

  /* Last updated bar */
  .tp-meta {
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    padding: 14px 0;
  }

  .tp-meta p {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0;
  }

  .tp-meta strong { color: #374151; font-weight: 500; }

  /* Main term cards */
  .tp-term-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px 32px;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    transition: all 0.2s;
  }
  .tp-term-card:hover {
    border-color: rgba(245,124,0,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  }

  .tp-term-icon {
    width: 44px; height: 44px;
    background: rgba(245,124,0,0.08);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #f57c00;
    margin-top: 2px;
  }

  .tp-term-card h2 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
  }

  .tp-check-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .tp-check-icon {
    color: #f57c00;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .tp-check-item span {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
  }

  /* Acceptable / Prohibited */
  .tp-ap-bg { background: #f0f4ff; }

  .tp-ap-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px 32px;
    border: 1px solid #e5e7eb;
    height: 100%;
  }

  .tp-ap-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .tp-ap-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .tp-ap-icon.good  { background: rgba(245,124,0,0.1); color: #f57c00; }
  .tp-ap-icon.bad   { background: rgba(239,68,68,0.1);  color: #ef4444; }

  .tp-ap-card h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .tp-ap-card > p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 16px;
    line-height: 1.65;
  }

  .tp-ap-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
  }

  .tp-ap-item svg { flex-shrink: 0; margin-top: 2px; }

  /* Additional policy cards */
  .tp-policy-card {
    background: #fff;
    border-radius: 14px;
    padding: 26px;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s;
  }
  .tp-policy-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.06); }

  .tp-policy-card h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tp-policy-card h3 svg { color: #f57c00; flex-shrink: 0; }

  .tp-policy-card > p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
    margin-bottom: 14px;
  }

  .tp-bullet {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.825rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 7px;
  }

  .tp-bullet-dot { color: #f57c00; flex-shrink: 0; margin-top: 1px; }

  /* Contributor Agreement */
  .tp-agreement-bg {
    background: linear-gradient(135deg, rgba(245,124,0,0.04) 0%, rgba(30,58,138,0.04) 100%);
  }

  .tp-agreement-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    border: 1.5px solid rgba(245,124,0,0.2);
    max-width: 800px;
    margin: 0 auto;
  }

  .tp-agreement-card h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #111827;
    text-align: center;
    margin-bottom: 16px;
  }

  .tp-agreement-card > p {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .tp-agreement-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.65;
  }

  .tp-agreement-num {
    width: 24px; height: 24px;
    background: rgba(245,124,0,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: #f57c00;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .tp-agreement-item strong { color: #111827; font-weight: 600; }

  /* Contact strip */
  .tp-contact-bg { background: #f8fafc; }

  .tp-section-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
  }

  .tp-contact-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 20px;
    font-size: 0.875rem;
    color: #4b5563;
    transition: border-color 0.18s;
  }
  .tp-contact-pill:hover { border-color: #f57c00; }
  .tp-contact-pill svg { color: #f57c00; flex-shrink: 0; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const termSections = [
  {
    icon: <LuShield size={20} />,
    title: "Acceptance of Terms",
    items: [
      "By accessing and using the University Magazine Contribution System, you agree to be bound by these Terms and Conditions.",
      "If you do not agree with any part of these terms, you must not use the platform.",
      "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    icon: <LuFileText size={20} />,
    title: "Content Submission Guidelines",
    items: [
      "All submitted content must be original work created by the submitting student.",
      "Submissions must not violate copyright laws, plagiarism policies, or any applicable regulations.",
      "Content must be appropriate for an academic setting and free from offensive, discriminatory, or harmful material.",
      "By submitting content, you grant the university a non-exclusive license to publish and distribute your work.",
    ],
  },
  {
    icon: <LuUsers size={20} />,
    title: "User Responsibilities",
    items: [
      "Users must provide accurate and up-to-date information during registration.",
      "Account credentials must be kept secure and not shared with others.",
      "Users are responsible for all activities that occur under their account.",
      "Any suspected unauthorized access must be reported immediately to administrators.",
    ],
  },
  {
    icon: <LuBadgeAlert size={20} />,
    title: "Intellectual Property Rights",
    items: [
      "Authors retain copyright ownership of their submitted works.",
      "The university is granted the right to publish, distribute, and archive submitted content.",
      "Proper attribution will be given to all published authors.",
      "Users must respect the intellectual property rights of others when creating content.",
    ],
  },
];

const acceptableItems = [
  "Submitting original academic and creative works",
  "Collaborating respectfully with reviewers",
  "Providing constructive feedback when requested",
  "Following submission deadlines and guidelines",
  "Maintaining professional communication",
  "Respecting the review process decisions",
];

const prohibitedItems = [
  "Submitting plagiarized or copied content",
  "Uploading malicious files or code",
  "Attempting to access unauthorized areas",
  "Harassing or threatening other users",
  "Submitting false or misleading information",
  "Using the platform for commercial purposes",
];

const policyCards = [
  {
    icon: <LuLock size={15} />,
    title: "Privacy & Data Protection",
    desc: "We are committed to protecting your personal information and privacy. All data collected is used solely for platform operations and will not be shared with third parties without consent.",
    bullets: [
      "Secure data storage and encryption",
      "Limited access to authorized personnel",
      "Compliance with data protection regulations",
      "Right to access and delete your data",
    ],
  },
  {
    icon: <LuClipboardCheck size={15} />,
    title: "Review Process",
    desc: "All submissions undergo a rigorous review process to maintain quality standards. The review team reserves the right to reject submissions that do not meet criteria.",
    bullets: [
      "Initial screening for guidelines compliance",
      "Faculty advisor review and feedback",
      "Editorial board final decision",
      "Authors notified of decision within 30 days",
    ],
  },
  {
    icon: <LuPenLine size={15} />,
    title: "Modifications & Revisions",
    desc: "Authors may be asked to revise their submissions based on reviewer feedback. Multiple revision rounds may be required before final publication.",
    bullets: [
      "Revision requests sent within 7 days",
      "Authors have 14 days to submit revisions",
      "Extensions available upon request",
      "Final approval by editorial board",
    ],
  },
  {
    icon: <LuScale size={15} />,
    title: "Dispute Resolution",
    desc: "If you disagree with a decision or have concerns about the process, we have a formal appeal procedure available.",
    bullets: [
      "Submit written appeal within 14 days",
      "Appeals reviewed by senior editorial board",
      "Decision communicated within 21 days",
      "Final decisions are binding",
    ],
  },
];

const agreementItems = [
  { label: "Originality", text: "I certify that the submitted work is my original creation and does not infringe upon any copyright, trademark, or other intellectual property rights." },
  { label: "Accuracy", text: "I have made reasonable efforts to ensure the accuracy and truthfulness of all information contained in my submission." },
  { label: "License Grant", text: "I grant the university a non-exclusive, perpetual license to publish, reproduce, and distribute my work in print and digital formats." },
  { label: "Attribution", text: "I understand that my work will be published with proper attribution and that I will be credited as the author." },
  { label: "Editorial Changes", text: "I agree to allow minor editorial changes for clarity, grammar, and formatting, while substantial changes will require my approval." },
  { label: "Compliance", text: "I agree to comply with all platform policies, submission guidelines, and these Terms and Conditions." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TermsPage() {
  const { mutate } = useTrackPageView("Terms Page");

  React.useEffect(() => {
    mutate();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Header />
      <div className="tp-root">

        {/* ── Hero ── */}
        <section className="tp-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ position: "relative", zIndex: 1, maxWidth: "680px" }}>
              <div className="tp-hero-tag">
                <LuShield size={12} />
                Legal
              </div>
              <h1>Terms and Conditions</h1>
              <p>
                Please read these terms carefully before using the University
                Magazine Contribution System. These policies ensure a safe,
                respectful, and productive environment for all users.
              </p>
            </div>
          </div>
        </section>

        {/* ── Meta bar ── */}
        <div className="tp-meta">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>
              <strong>Last Updated:</strong> March 10, 2026 &nbsp;|&nbsp;
              <strong>Effective Date:</strong> January 1, 2026
            </p>
          </div>
        </div>

        {/* ── Main term sections ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5">
              {termSections.map((section) => (
                <div key={section.title} className="tp-term-card">
                  <div className="tp-term-icon">{section.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h2>{section.title}</h2>
                    {section.items.map((item) => (
                      <div key={item} className="tp-check-item">
                        <LuCheck size={15} className="tp-check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Acceptable / Prohibited ── */}
        <section className="tp-ap-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Acceptable */}
              <div className="tp-ap-card">
                <div className="tp-ap-header">
                  <div className="tp-ap-icon good"><LuCheck size={20} /></div>
                  <h2>Acceptable Use</h2>
                </div>
                <p>The following activities are encouraged and supported on our platform:</p>
                {acceptableItems.map((item) => (
                  <div key={item} className="tp-ap-item">
                    <LuCheck size={14} style={{ color: "#f57c00", marginTop: "2px", flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Prohibited */}
              <div className="tp-ap-card">
                <div className="tp-ap-header">
                  <div className="tp-ap-icon bad"><LuX size={20} /></div>
                  <h2>Prohibited Activities</h2>
                </div>
                <p>The following activities are strictly forbidden and may result in account suspension:</p>
                {prohibitedItems.map((item) => (
                  <div key={item} className="tp-ap-item">
                    <LuX size={14} style={{ color: "#ef4444", marginTop: "2px", flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Additional Policies ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {policyCards.map((card) => (
                <div key={card.title} className="tp-policy-card">
                  <h3>
                    {card.icon}
                    {card.title}
                  </h3>
                  <p>{card.desc}</p>
                  {card.bullets.map((b) => (
                    <div key={b} className="tp-bullet">
                      <span className="tp-bullet-dot">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contributor Agreement ── */}
        <section className="tp-agreement-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="tp-agreement-card">
              <h2>Contributor Agreement</h2>
              <p>
                By submitting content to the University Magazine Contribution
                System, I hereby acknowledge and agree to the following:
              </p>
              {agreementItems.map((item, i) => (
                <div key={item.label} className="tp-agreement-item">
                  <div className="tp-agreement-num">{i + 1}</div>
                  <span>
                    <strong>{item.label}:</strong> {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Questions strip ── */}
        <section className="tp-contact-bg py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="tp-section-title">Questions About These Terms?</h2>
            <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "28px", lineHeight: 1.7 }}>
              If you have any questions or concerns about our Terms and
              Conditions, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="tp-contact-pill">
                <LuMail size={15} />
                <span>legal@university.edu</span>
              </div>
              <div className="tp-contact-pill">
                <LuPhone size={15} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}