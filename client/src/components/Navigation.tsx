import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/aquapulse', label: 'AquaPulse' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/5 bg-slate-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 text-white hover:opacity-90 transition-all group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="HOPSTECH INNOVATION Logo"
                className="h-12 w-12 rounded-full ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/30 group-hover:ring-blue-400 group-hover:shadow-blue-400/40 transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
              <span className="block max-w-[10rem] text-sm leading-tight sm:max-w-none sm:text-base md:text-xl">
                HOPSTECH INNOVATION
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    location === link.href
                      ? 'text-blue-400'
                      : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/client-portal">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Let's Build
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Explore</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Browse AquaPulse, portfolio projects, and ways to start working together from your phone.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:text-blue-400 ${
                        location === link.href
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-gray-300 hover:bg-slate-800/80'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <div className="pt-2">
                  <Link href="/client-portal">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Let's Build
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
