import React from "react";
import {
  LuTarget,
  LuEye,
  LuBookOpen,
  LuUsers,
  LuLightbulb,
  LuUpload,
  LuFileCheck,
  LuSend,
  LuCheck,
} from "react-icons/lu";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { useTrackPageView } from "@/utils/useTrackPageView";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .ap-root {
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  .ap-root h1, .ap-root h2, .ap-root h3 {
    font-family: 'Lora', serif;
  }

  /* Hero */
  .ap-hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
    padding: 96px 0 72px;
    position: relative;
    overflow: hidden;
  }

  .ap-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(245,124,0,0.1);
    pointer-events: none;
  }

  .ap-hero::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(99,102,241,0.08);
    pointer-events: none;
  }

  .ap-hero-tag {
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

  .ap-hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 18px;
  }

  .ap-hero p {
    font-size: 1.05rem;
    color: #bfdbfe;
    line-height: 1.75;
    max-width: 560px;
  }

  /* Section helpers */
  .ap-section-tag {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f57c00;
    margin-bottom: 10px;
  }

  .ap-section-title {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;
  }

  .ap-section-sub {
    font-size: 1rem;
    color: #6b7280;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* Mission / Vision */
  .ap-mv-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s;
  }
  .ap-mv-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.07); }

  .ap-mv-card.mission { border-top: 3px solid #1e3a8a; }
  .ap-mv-card.vision  { border-top: 3px solid #f57c00; }

  .ap-mv-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ap-mv-icon.mission { background: rgba(30,58,138,0.1); color: #1e3a8a; }
  .ap-mv-icon.vision  { background: rgba(245,124,0,0.1); color: #f57c00; }

  .ap-mv-card h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .ap-mv-card p {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.75;
    margin-top: 14px;
  }

  /* Objectives */
  .ap-obj-bg { background: #f0f4ff; }

  .ap-obj-card {
    background: #fff;
    border-radius: 14px;
    padding: 24px;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: all 0.2s;
  }
  .ap-obj-card:hover {
    border-color: #f57c00;
    box-shadow: 0 6px 24px rgba(245,124,0,0.08);
    transform: translateY(-2px);
  }

  .ap-obj-icon {
    width: 44px; height: 44px;
    background: rgba(245,124,0,0.08);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #f57c00;
  }

  .ap-obj-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 6px;
  }

  .ap-obj-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
  }

  /* Process steps */
  .ap-step-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    border: 1px solid #e5e7eb;
    position: relative;
    transition: box-shadow 0.2s;
  }
  .ap-step-card:hover { box-shadow: 0 8px 32px rgba(30,58,138,0.08); }

  .ap-step-icon {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, #f57c00 0%, #0f766e 100%);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: #fff;
  }

  .ap-step-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
  }

  .ap-step-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
  }

  .ap-step-connector {
    display: none;
  }
  @media (min-width: 768px) {
    .ap-step-connector {
      display: block;
      position: absolute;
      top: 54px;
      left: 62%;
      width: 76%;
      height: 2px;
      background: linear-gradient(to right, #f57c00, rgba(245,124,0,0.15));
      z-index: 0;
    }
  }

  /* Built for section */
  .ap-built-bg { background: #f8fafc; }

  .ap-check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  .ap-check-dot {
    width: 22px; height: 22px;
    background: #f57c00;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    color: #fff;
  }

  .ap-check-item span {
    font-size: 0.9rem;
    color: #4b5563;
    line-height: 1.6;
  }

  /* Values */
  .ap-value-card {
    background: #fff;
    border-radius: 14px;
    padding: 28px 20px;
    text-align: center;
    border: 1px solid #e5e7eb;
    border-top: 3px solid #f57c00;
    transition: all 0.2s;
  }
  .ap-value-card:hover {
    box-shadow: 0 6px 24px rgba(245,124,0,0.1);
    transform: translateY(-3px);
  }

  .ap-value-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .ap-value-card p {
    font-size: 0.825rem;
    color: #6b7280;
    line-height: 1.6;
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const objectives = [
  {
    icon: <LuTarget size={20} />,
    title: "Encourage Academic Excellence",
    desc: "Foster a culture of scholarly writing and creative expression among students.",
  },
  {
    icon: <LuBookOpen size={20} />,
    title: "Support Digital Publishing",
    desc: "Provide modern tools for institutional publication management and distribution.",
  },
  {
    icon: <LuUsers size={20} />,
    title: "Enable Collaboration",
    desc: "Connect students with faculty advisors and editorial staff for meaningful feedback.",
  },
  {
    icon: <LuLightbulb size={20} />,
    title: "Promote Innovation",
    desc: "Showcase innovative research, creative works, and diverse student perspectives.",
  },
];

const steps = [
  {
    icon: <LuUpload size={24} />,
    title: "Step 1: Submit Your Work",
    desc: "Upload articles, essays, or creative content through our secure submission portal. Include all necessary metadata and formatting requirements.",
    connector: true,
  },
  {
    icon: <LuFileCheck size={24} />,
    title: "Step 2: Review Process",
    desc: "Faculty advisors and editorial staff review submissions for quality, relevance, and adherence to academic standards.",
    connector: true,
  },
  {
    icon: <LuSend size={24} />,
    title: "Step 3: Revision & Publication",
    desc: "Receive feedback, make necessary revisions, and see your work published in the official university magazine.",
    connector: false,
  },
];

const checkItems = [
  "Intuitive submission interface with real-time validation",
  "Comprehensive review workflow with feedback tools",
  "Automated notifications and deadline reminders",
  "Analytics and reporting for institutional insights",
];

const values = [
  { title: "Integrity",    desc: "Upholding academic honesty and ethical standards" },
  { title: "Excellence",  desc: "Commitment to quality in all submissions" },
  { title: "Inclusivity", desc: "Welcoming diverse voices and perspectives" },
  { title: "Innovation",  desc: "Embracing new ideas and technologies" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AboutPage() {
  const { mutate } = useTrackPageView("About Page")

  React.useEffect(() => {
    mutate()
  }, [])

  return (
    <>
      <style>{styles}</style>
      <Header />
      <div className="ap-root">

        {/* ── Hero ── */}
        <section className="ap-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ position: "relative", zIndex: 1, maxWidth: "640px" }}>
              <div className="ap-hero-tag">
                <LuBookOpen size={12} />
                About Us
              </div>
              <h1>About Our Platform</h1>
              <p>
                Transforming how students contribute to academic publishing
                through modern, accessible, and collaborative digital tools.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="ap-section-tag">Who we are</span>
              <h2 className="ap-section-title">Mission & Vision</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="ap-mv-card mission">
                <div className="flex items-center gap-3 mb-2">
                  <div className="ap-mv-icon mission">
                    <LuTarget size={20} />
                  </div>
                  <h2>Our Mission</h2>
                </div>
                <p>
                  To empower student voices and foster academic excellence by
                  providing a modern, accessible platform for submitting,
                  reviewing, and publishing scholarly and creative works. We aim
                  to create a collaborative environment that bridges the gap
                  between students and faculty, promoting intellectual growth and
                  institutional pride.
                </p>
              </div>

              {/* Vision */}
              <div className="ap-mv-card vision">
                <div className="flex items-center gap-3 mb-2">
                  <div className="ap-mv-icon vision">
                    <LuEye size={20} />
                  </div>
                  <h2>Our Vision</h2>
                </div>
                <p>
                  To become the leading academic publishing platform that sets
                  the standard for student engagement in institutional
                  publications. We envision a future where every student has the
                  opportunity to share their perspectives, research, and
                  creativity with the broader academic community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Objectives ── */}
        <section className="ap-obj-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="ap-section-tag">What we stand for</span>
              <h2 className="ap-section-title">Platform Objectives</h2>
              <p className="ap-section-sub">
                Our core goals for creating an exceptional academic publishing
                experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {objectives.map((o) => (
                <div key={o.title} className="ap-obj-card">
                  <div className="ap-obj-icon">{o.icon}</div>
                  <div>
                    <h3>{o.title}</h3>
                    <p>{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contribution Process ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="ap-section-tag">How it works</span>
              <h2 className="ap-section-title">The Contribution Process</h2>
              <p className="ap-section-sub">
                A transparent, structured workflow from submission to
                publication.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.title} style={{ position: "relative" }}>
                  {s.connector && <div className="ap-step-connector" />}
                  <div className="ap-step-card" style={{ position: "relative", zIndex: 1 }}>
                    <div className="ap-step-icon">{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Built for Modern Publishing ── */}
        <section className="ap-built-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Left */}
              <div>
                <span className="ap-section-tag">Why choose us</span>
                <h2 className="ap-section-title">
                  Built for Modern Academic Publishing
                </h2>
                <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.75, marginBottom: "24px" }}>
                  Our platform combines cutting-edge technology with academic
                  best practices to create a seamless experience for both
                  contributors and reviewers.
                </p>
                <div>
                  {checkItems.map((item) => (
                    <div key={item} className="ap-check-item">
                      <div className="ap-check-dot">
                        <LuCheck size={12} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: image grid */}
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Digital content creation"
                  style={{ borderRadius: "14px", width: "100%", height: "220px", objectFit: "cover", gridColumn: "span 2", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Team collaboration"
                  style={{ borderRadius: "14px", width: "100%", height: "160px", objectFit: "cover", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="University library"
                  style={{ borderRadius: "14px", width: "100%", height: "160px", objectFit: "cover", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="ap-section-tag">What drives us</span>
              <h2 className="ap-section-title">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className="ap-value-card">
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}