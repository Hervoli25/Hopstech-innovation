import { Link } from 'wouter';
import { Github, Linkedin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { enterpriseFooter } from '@/content/enterprise';
import { handleSectionLink } from '@/lib/scrollToSection';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (handleSectionLink(href)) {
      event.preventDefault();
    }
  };

  return (
    <footer
      className="border-t border-slate-800 text-gray-300"
      style={{ backgroundColor: 'var(--hopstec-footer-bg)' }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Link href="/">
              <a className="flex items-center space-x-3 text-white transition-all hover:opacity-90">
                <BrandLogo size="md" showRing={false} />
                <span className="text-xl font-bold text-white">
                  {enterpriseFooter.companyName}
                </span>
              </a>
            </Link>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{enterpriseFooter.address}</p>
              <p>
                <a
                  href={enterpriseFooter.websiteUrl}
                  className="transition-colors hover:text-[var(--hopstec-teal)]"
                >
                  {enterpriseFooter.website}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${enterpriseFooter.email}`}
                  className="transition-colors hover:text-[var(--hopstec-teal)]"
                >
                  {enterpriseFooter.email}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Navigation</h3>
            <ul className="space-y-2">
              {enterpriseFooter.navLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      onClick={(event) => handleNavClick(event, link.href)}
                      className="text-sm transition-colors hover:text-[var(--hopstec-teal)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <a className="text-sm transition-colors hover:text-[var(--hopstec-teal)]">
                        {link.label}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-gray-400 sm:flex-row">
          <div className="text-center sm:text-left">
            <p>
              © {currentYear} {enterpriseFooter.companyName}. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-500">{enterpriseFooter.trustLine}</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/hopstech"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--hopstec-teal)]"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/herve-kajingu"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--hopstec-teal)]"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
