import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@heroui/react";
import {
  LuArrowRight,
  LuPenLine,
  LuUsers,
  LuFileText,
  LuAward,
  LuCheck,
  LuTrendingUp,
} from "react-icons/lu";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Chatbot } from "@/components/Chatbot";
import { useTrackPageView } from "@/utils/useTrackPageView";

// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .hp-root {
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  .hp-root h1, .hp-root h2, .hp-root h3 {
    font-family: 'Lora', serif;
  }

  /* Hero */
  .hp-hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
    padding: 96px 0 80px;
    position: relative;
    overflow: hidden;
  }

  .hp-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: rgba(245,124,0,0.12);
    pointer-events: none;
  }

  .hp-hero::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: rgba(99,102,241,0.1);
    pointer-events: none;
  }

  .hp-hero-tag {
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

  .hp-hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #ffffff;
    line-height: 1.15;
    margin-bottom: 20px;
  }

  .hp-hero-accent { color: #f57c00; }

  .hp-hero p {
    font-size: 1.05rem;
    color: #bfdbfe;
    line-height: 1.75;
    max-width: 520px;
    margin-bottom: 36px;
  }

  .hp-btn-primary {
    background: #f57c00 !important;
    color: #fff !important;
    border: none !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    padding: 0 28px !important;
    height: 48px !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 20px rgba(245,124,0,0.3) !important;
    transition: all 0.2s !important;
  }
  .hp-btn-primary:hover {
    background: #e65100 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 24px rgba(245,124,0,0.4) !important;
  }

  .hp-btn-ghost {
    background: rgba(255,255,255,0.08) !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,0.25) !important;
    font-size: 0.9rem !important;
    font-weight: 400 !important;
    padding: 0 28px !important;
    height: 48px !important;
    border-radius: 8px !important;
    transition: all 0.2s !important;
  }
  .hp-btn-ghost:hover {
    background: rgba(255,255,255,0.16) !important;
  }

  .hp-hero-img {
    border-radius: 16px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.4);
    width: 100%;
    height: 420px;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }

  /* Stats */
  .hp-stats {
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }

  .hp-stat-val {
    font-family: 'Lora', serif;
    font-size: 2.25rem;
    font-weight: 700;
    color: #1e3a8a;
    line-height: 1;
  }

  .hp-stat-lbl {
    font-size: 0.85rem;
    color: #6b7280;
    margin-top: 4px;
  }

  /* Features */
  .hp-feature-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 28px 24px;
    transition: all 0.25s;
  }
  .hp-feature-card:hover {
    border-color: #f57c00;
    box-shadow: 0 8px 32px rgba(245,124,0,0.1);
    transform: translateY(-3px);
  }

  .hp-feature-icon {
    width: 48px; height: 48px;
    background: rgba(245,124,0,0.08);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
    color: #f57c00;
  }

  .hp-feature-card h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
  }

  .hp-feature-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
  }

  /* Steps */
  .hp-steps-bg {
    background: #f0f4ff;
  }

  .hp-step-card {
    background: #fff;
    border-radius: 14px;
    padding: 36px 28px;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s;
  }
  .hp-step-card:hover { box-shadow: 0 8px 32px rgba(30,58,138,0.08); }

  .hp-step-num {
    width: 56px; height: 56px;
    background: rgba(245,124,0,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-family: 'Lora', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #f57c00;
  }

  .hp-step-card h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
  }

  .hp-step-card p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.65;
  }

  /* Activity */
  .hp-activity-card {
    background: #fff;
    border-left: 4px solid #f57c00;
    border-radius: 0 10px 10px 0;
    padding: 18px 20px;
    display: flex; align-items: flex-start; gap: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
  }
  .hp-activity-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }

  .hp-activity-icon {
    color: #f57c00;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hp-activity-card h4 {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 4px;
  }

  .hp-activity-card p {
    font-size: 0.78rem;
    color: #9ca3af;
  }

  .hp-community-card {
    border-radius: 14px;
    background: linear-gradient(135deg, #f57c00 0%, #0f766e 100%);
    padding: 32px 28px;
    color: #fff;
  }

  .hp-community-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 16px 0 10px;
    color: #fff;
  }

  .hp-community-card p {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.65;
  }

  /* CTA */
  .hp-cta {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
    padding: 80px 0;
    text-align: center;
  }

  .hp-cta h2 {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
  }

  .hp-cta p {
    font-size: 1rem;
    color: #bfdbfe;
    margin-bottom: 36px;
  }

  .hp-section-tag {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #f57c00;
    margin-bottom: 12px;
  }

  .hp-section-title {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;
  }

  .hp-section-sub {
    font-size: 1rem;
    color: #6b7280;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .hp-view-btn {
    background: #1e3a8a !important;
    color: #fff !important;
    border: none !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    padding: 0 24px !important;
    height: 44px !important;
    border-radius: 8px !important;
    transition: background 0.2s !important;
    margin-top: 24px !important;
  }
  .hp-view-btn:hover { background: #172554 !important; }

  .hp-cta-outline {
    background: rgba(255,255,255,0.08) !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,0.25) !important;
    font-size: 0.9rem !important;
    font-weight: 400 !important;
    padding: 0 28px !important;
    height: 48px !important;
    border-radius: 8px !important;
  }
  .hp-cta-outline:hover { background: rgba(255,255,255,0.15) !important; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <LuPenLine size={22} />,
    title: "Easy Submission",
    desc: "Submit your articles, essays, and creative works with our intuitive submission system.",
  },
  {
    icon: <LuUsers size={22} />,
    title: "Collaborative Review",
    desc: "Work with faculty advisors and editors through a structured review process.",
  },
  {
    icon: <LuFileText size={22} />,
    title: "Content Management",
    desc: "Organize and track your submissions through every stage of the publication workflow.",
  },
  {
    icon: <LuAward size={22} />,
    title: "Quality Publishing",
    desc: "Maintain academic standards with our quality control and editorial review system.",
  },
];

const steps = [
  {
    num: "1",
    title: "Create Account",
    desc: "Register with your university credentials to access the submission platform.",
  },
  {
    num: "2",
    title: "Submit Content",
    desc: "Upload your articles, essays, or creative works through the submission form.",
  },
  {
    num: "3",
    title: "Get Published",
    desc: "Receive feedback, make revisions, and see your work published in the magazine.",
  },
];

const activities = [
  { title: "New Publication: Spring 2026 Edition",      date: "March 8, 2026" },
  { title: "Submission Deadline Extended",              date: "March 5, 2026" },
  { title: "Featured Article: Climate Change Research", date: "March 1, 2026" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function HomePage() {
  const { mutate } = useTrackPageView("Home Page");

  React.useEffect(() => {
    mutate();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Header />
      <div className="hp-root">

        {/* ── Hero ── */}
        <section className="hp-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="hp-hero-tag">
                  <LuTrendingUp size={12} />
                  Spring 2026 Edition Open
                </div>
                <h1>
                  University Magazine{" "}
                  <span className="hp-hero-accent">Contribution</span> System
                </h1>
                <p>
                  Empowering student voices through academic publishing. Submit,
                  review, and publish your creative and scholarly works with our
                  modern digital platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    as={RouterLink}
                    to="/register"
                    className="hp-btn-primary"
                    endContent={<LuArrowRight size={16} />}
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/about"
                    className="hp-btn-ghost"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block" style={{ position: "relative", zIndex: 1 }}>
                <img
                  src="https://student-cms.prd.timeshighereducation.com/sites/default/files/styles/featured_image/public/2025-06/student-studying-in-library.jpg?itok=3nFP8DR7"
                  alt="University students"
                  className="hp-hero-img"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="hp-stats py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { val: "2,450+", lbl: "Active Contributors" },
                { val: "1,200+", lbl: "Published Articles" },
                { val: "85+",    lbl: "Faculty Reviewers" },
                { val: "98%",    lbl: "Satisfaction Rate" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="text-center">
                  <div className="hp-stat-val">{val}</div>
                  <div className="hp-stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="hp-section-tag">What we offer</span>
              <h2 className="hp-section-title">Platform Features</h2>
              <p className="hp-section-sub">
                Everything you need to contribute to academic publishing and
                manage your submissions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => (
                <div key={f.title} className="hp-feature-card">
                  <div className="hp-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="hp-steps-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="hp-section-tag">Simple process</span>
              <h2 className="hp-section-title">How It Works</h2>
              <p className="hp-section-sub">
                Simple steps to contribute your work to the university magazine.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.num} className="hp-step-card">
                  <div className="hp-step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

              {/* Left */}
              <div>
                <span className="hp-section-tag">Latest news</span>
                <h2 className="hp-section-title">Recent Activity & Updates</h2>
                <div className="flex flex-col gap-3 mt-6">
                  {activities.map((a) => (
                    <div key={a.title} className="hp-activity-card">
                      <LuCheck size={18} className="hp-activity-icon" />
                      <div>
                        <h4>{a.title}</h4>
                        <p>{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-5">
                <div className="hp-community-card">
                  <LuTrendingUp size={32} />
                  <h3>Growing Community</h3>
                  <p>
                    Join thousands of students contributing to academic
                    excellence through our platform.
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80"
                  alt="Academic writing"
                  style={{
                    borderRadius: "14px",
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hp-cta">
          <div className="max-w-3xl mx-auto px-4">
            <h2>Ready to Share Your Work?</h2>
            <p>
              Join our community of student contributors and start making an
              impact today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                as={RouterLink}
                to="/student/submit-contribution"
                className="hp-btn-primary"
              >
                Start Contributing
              </Button>
              <Button
                as={RouterLink}
                to="/about"
                className="hp-cta-outline"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </section>

      </div>

      {/* Footer lives outside hp-root so its own styles don't conflict */}
      <Footer />
      <Chatbot />
    </>
  );
}