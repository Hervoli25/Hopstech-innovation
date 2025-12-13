import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <main className={className}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
