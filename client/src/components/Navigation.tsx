import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { enterpriseFooter } from '@/content/enterprise';
import { handleSectionLink } from '@/lib/scrollToSection';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const navLinks = enterpriseFooter.navLinks;

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (handleSectionLink(href, () => setIsMobileMenuOpen(false))) {
      event.preventDefault();
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return location === '/';
    }
    return location === href;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/5 bg-slate-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="group flex items-center space-x-3 text-white transition-all hover:opacity-90">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Hopstec Innovation Logo"
                className="h-12 w-12 rounded-full ring-2 ring-[var(--hopstec-teal)]/50 shadow-lg shadow-[var(--hopstec-teal)]/20 transition-all duration-300 group-hover:scale-110"
              />
            </div>
            <span className="bg-clip-text text-xl font-bold text-transparent bg-gradient-to-r from-[var(--hopstec-teal)] via-cyan-300 to-blue-400">
              <span className="block max-w-[10rem] text-sm leading-tight sm:max-w-none sm:text-base md:text-xl">
                Hopstec Innovation
              </span>
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith('/#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className={`text-sm font-medium transition-colors hover:text-[var(--hopstec-teal)] ${
                    isActive(link.href) ? 'text-[var(--hopstec-teal)]' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`text-sm font-medium transition-colors hover:text-[var(--hopstec-teal)] ${
                      isActive(link.href) ? 'text-[var(--hopstec-teal)]' : 'text-gray-300'
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              )
            )}
            <Link href="/client-portal">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Client Portal
              </Button>
            </Link>
          </div>

          <button
            className="rounded-full border border-white/10 bg-slate-900/70 p-2 text-white shadow-lg backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 rounded-2xl border border-[var(--hopstec-teal)]/20 bg-[var(--hopstec-teal)]/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--hopstec-teal)]/80">
                  Hopstec Innovation
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Paris-based software consultancy. Explore our services, case studies, and ways to get in touch.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) =>
                  link.href.startsWith('/#') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(event) => handleNavClick(event, link.href)}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:text-[var(--hopstec-teal)] ${
                        isActive(link.href)
                          ? 'bg-[var(--hopstec-teal)]/10 text-[var(--hopstec-teal)]'
                          : 'text-gray-300 hover:bg-slate-800/80'
                      }`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      <a
                        className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:text-[var(--hopstec-teal)] ${
                          isActive(link.href)
                            ? 'bg-[var(--hopstec-teal)]/10 text-[var(--hopstec-teal)]'
                            : 'text-gray-300 hover:bg-slate-800/80'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    </Link>
                  )
                )}
                <div className="pt-2">
                  <Link href="/client-portal">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Client Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
