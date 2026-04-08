import React from "react";
import { Link } from "react-router-dom";
import { LuHouse, LuArrowLeft } from "react-icons/lu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@400;500&display=swap');

  .nf-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .nf-root::before {
    content: '';
    position: absolute;
    top: -100px; left: -100px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: rgba(30,58,138,0.05);
    pointer-events: none;
  }

  .nf-root::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: rgba(245,124,0,0.05);
    pointer-events: none;
  }

  .nf-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 56px 40px 48px;
    max-width: 520px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .nf-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 36px;
    text-decoration: none;
  }

  .nf-brand-icon {
    width: 26px; height: 26px;
    background: #1e3a8a;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }

  .nf-brand-text {
    font-family: 'Lora', serif;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .nf-brand-uni  { color: #1e3a8a; }
  .nf-brand-mag  { color: #f57c00; }

  .nf-404 {
    font-family: 'Lora', serif;
    font-size: clamp(5rem, 15vw, 7rem);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
    background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nf-divider {
    width: 40px;
    height: 3px;
    background: #f57c00;
    border-radius: 2px;
    margin: 16px auto;
  }

  .nf-card h2 {
    font-family: 'Lora', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;
  }

  .nf-card p {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }

  .nf-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 480px) {
    .nf-actions { flex-direction: row; }
  }

  .nf-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 24px;
    border-radius: 8px;
    background: #1e3a8a;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    border: none;
    transition: background 0.18s;
  }
  .nf-btn-primary:hover { background: #172554; }

  .nf-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 24px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    transition: all 0.18s;
  }
  .nf-btn-outline:hover {
    border-color: #1e3a8a;
    color: #1e3a8a;
  }

  .nf-footer {
    margin-top: 28px;
    font-size: 0.78rem;
    color: #9ca3af;
  }

  .nf-footer a {
    color: #f57c00;
    text-decoration: none;
    font-weight: 500;
  }
  .nf-footer a:hover { text-decoration: underline; }

  .nf-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 24px;
  }

  .nf-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
  }
`;

export default function NotFoundPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="nf-root">
        <div className="nf-card">

          {/* Brand */}
          <Link to="/" className="nf-brand">
            <div className="nf-brand-icon">
              <svg fill="none" height="14" viewBox="0 0 32 32" width="14">
                <path clipRule="evenodd" d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z" fill="white" fillRule="evenodd" />
              </svg>
            </div>
            <span className="nf-brand-text">
              <span className="nf-brand-uni">Uni</span>
              <span className="nf-brand-mag">Magazine</span>
            </span>
          </Link>

          {/* Decorative dots */}
          <div className="nf-dots">
            <div className="nf-dot" style={{ background: "#1e3a8a" }} />
            <div className="nf-dot" style={{ background: "#f57c00" }} />
            <div className="nf-dot" style={{ background: "#e5e7eb" }} />
          </div>

          {/* 404 number */}
          <div className="nf-404">404</div>

          <div className="nf-divider" />

          <h2>Page Not Found</h2>
          <p>
            Sorry — we couldn't find the page you're looking for. It may have
            been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="nf-actions">
            <Link to={-1} className="nf-btn-outline">
              <LuArrowLeft size={14} />
              Go Back
            </Link>
            <Link to="/" className="nf-btn-primary">
              <LuHouse size={14} />
              Return Home
            </Link>
          </div>

          <p className="nf-footer">
            Think this is a bug?{" "}
            <a href="mailto:support@university.edu">Report it</a>
          </p>
        </div>
      </div>
    </>
  );
}