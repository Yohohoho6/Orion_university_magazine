import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
} from "react-icons/lu";

export function Footer() {
  const quickLinks = [
    { label: "Home",       to: "/" },
    { label: "About Us",   to: "/about" },
    { label: "Contact",    to: "/contact" },
    { label: "Terms",      to: "/terms" },
  ];

  const contactItems = [
    { icon: <LuMapPin size={16} />, text: "123 University Ave, Academic City, AC 12345" },
    { icon: <LuPhone size={16} />,  text: "+1 (555) 123-4567" },
    { icon: <LuMail size={16} />,   text: "orion@university.edu" },
  ];

  const socialLinks = [
    { icon: LuFacebook, label: "Facebook", href: "#" },
    { icon: LuTwitter, label: "Twitter", href: "#" },
    { icon: LuInstagram, label: "Instagram", href: "#" },
    { icon: LuLinkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-slate-900 text-gray-400 py-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          
          {/* Brand & Description (Takes up 2 columns on larger screens) */}
          <div className="sm:col-span-2">
            <RouterLink 
              to="/" 
              className="inline-block font-serif text-2xl font-bold text-white mb-4 tracking-tight"
            >
              Orion<span className="text-orange-500">University</span>
            </RouterLink>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-sm">
              Empowering student voices through academic publishing since 2020. 
              Discover, learn, and grow with our community.
            </p>
            
            {/* Social Links mapped dynamically */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:bg-orange-500/15 hover:text-orange-500 transition-all duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-5 tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <RouterLink
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-5 tracking-wider uppercase">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-orange-500 mt-0.5 shrink-0">
                    {item.icon}
                  </span>
                  <span className="leading-snug">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white/10 my-10" />

        {/* Copyright & Bottom Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Orion University Magazine. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <RouterLink to="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </RouterLink>
            <RouterLink to="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </RouterLink>
            <RouterLink to="/contact" className="hover:text-gray-300 transition-colors">
              Contact
            </RouterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}