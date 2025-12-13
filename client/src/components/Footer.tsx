import { Link } from 'wouter';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <a className="flex items-center space-x-3 text-white hover:opacity-90 transition-all group">
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="HOPSTECH INNOVATION Logo"
                    className="h-12 w-12 rounded-full ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/30 group-hover:ring-blue-400 group-hover:shadow-blue-400/40 transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
                  HOPSTECH INNOVATION
                </span>
              </a>
            </Link>
            <p className="text-sm text-gray-400">
              Building cutting-edge solutions with DevOps expertise and modern
              web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-sm hover:text-blue-400 transition-colors">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <a className="text-sm hover:text-blue-400 transition-colors">
                    Portfolio
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-sm hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm">DevOps Engineering</li>
              <li className="text-sm">Full-Stack Development</li>
              <li className="text-sm">Cloud Architecture</li>
              <li className="text-sm">CI/CD Solutions</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <a
                  href="mailto:hk@hopstechinnovation.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  hk@hopstechinnovation.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                <a
                  href="tel:+33776026688"
                  className="hover:text-blue-400 transition-colors"
                >
                  +33 7 76 02 66 88
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/hopstech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/herve-kajingu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} HOPSTECH INNOVATION. All rights reserved. Built by{' '}
            <span className="text-blue-400">Herve Kajingu</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
