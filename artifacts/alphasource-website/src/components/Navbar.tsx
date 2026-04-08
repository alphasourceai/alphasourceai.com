import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "AlphaScreen", href: "/alphascreen" },
    { label: "AI Agents", href: "/#agents" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Get in Touch", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0" data-testid="nav-logo">
            <img
              src="/logo-dark-text.png"
              alt="AlphaSource AI"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location === link.href
                    ? "text-[#A380F6]"
                    : "text-[#0A1547] hover:text-[#A380F6]"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <a
              href="/#contact"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="nav-cta-button"
            >
              Request a Demo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#0A1547]"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="nav-mobile-menu-button"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 6l12 12M6 18L18 6"
                />
              ) : (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2.5 text-sm font-medium text-[#0A1547] hover:text-[#A380F6] hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="/#contact"
              className="block text-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ backgroundColor: "#A380F6" }}
              onClick={() => setMobileOpen(false)}
            >
              Request a Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
