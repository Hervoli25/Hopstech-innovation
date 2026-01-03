# HOPSTECH INNOVATION Portfolio & Client Portal

A cutting-edge portfolio website and comprehensive client portal platform showcasing DevOps engineering expertise and software development services. Built by **Herve Kajingu**, this platform combines a professional portfolio showcase with a feature-rich client management system.

![HOPSTECH Portfolio](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.1-646cff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8)

## 📖 Overview

HOPSTECH INNOVATION is a hybrid B2B + B2C platform that serves dual purposes:

1. **Portfolio Website** - Showcase DevOps and software development expertise, projects, and services
2. **Client Portal** - Full-featured client management system with project tracking, messaging, invoicing, and support

This platform demonstrates modern web development best practices, cutting-edge technologies, and exceptional user experience design.

## ✨ Key Features

### 🎯 Portfolio Website
- **Dynamic Project Showcase** - Filterable portfolio with detailed project views
- **Service Offerings** - Comprehensive DevOps, Full-Stack Development, and Cloud Architecture services
- **Client Testimonials** - Social proof from satisfied clients
- **Contact System** - Integrated contact form with email notifications
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Dark Theme** - Sophisticated navy blue color scheme with gradient effects
- **SEO Optimized** - Meta tags, semantic HTML, and performance optimization

### 🚀 Client Portal (Advanced Features)

#### 1. **Smart Notification Center**
- Real-time notification system with unread badge
- Priority-based color coding (urgent, high, medium, low)
- Notification grouping and categorization
- Actionable notifications with direct links
- Snooze functionality for better workflow management
- Desktop notifications via Web Notifications API
- Granular notification preferences

#### 2. **Interactive Project Timeline**
- Visual Gantt chart for project milestones
- Color-coded milestone status (completed, on track, due soon, overdue)
- Interactive milestone completion with confetti celebrations
- Timeline and list view toggle
- Real-time progress tracking
- Milestone management and updates

#### 3. **AI-Powered Project Insights**
- Project health score algorithm (0-100 with A-F grading)
- Predictive completion date based on velocity
- Budget burn rate analysis
- Risk detection system (overdue milestones, budget overruns, low activity)
- Intelligent recommendations and alerts
- Visual insights dashboard

#### 4. **Progressive Web App (PWA)**
- Installable as native app on desktop and mobile
- Offline mode with service worker caching
- Custom install prompts
- Update notifications
- Offline indicator
- App-like experience with HOPSTECH branding

#### 5. **Comprehensive Loading States**
- Skeleton screens for all major components
- HOPSTECH-branded loading spinners with gradient effects
- Full-screen loader for initial app load
- Button loading states for form submissions
- Smooth transitions between loading and loaded states
- Accessible loading indicators (ARIA labels)

#### 6. **Additional Portal Features**
- **Magic Link Authentication** - Passwordless email-based login with JWT sessions
- **Project Management** - Create, track, and manage client projects
- **Messaging System** - Two-column messaging interface with conversation threads
- **Invoice Management** - View invoices, track payments, download PDFs
- **Support Tickets** - Create and manage support tickets with threaded conversations
- **User Profile** - Manage profile information and notification preferences
- **Activity Tracking** - Comprehensive activity log for all user actions
- **File Management** - Upload and manage project files

## 🛠️ Technology Stack

### Frontend
- **React 19.2** - Latest React with concurrent features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.1** - Lightning-fast build tool
- **Wouter 3.3** - Lightweight routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Framer Motion 12.23** - Advanced animations
- **Three.js** - 3D graphics and visualizations
- **Canvas Confetti** - Celebration animations

### Backend
- **Express 4.21** - Web application framework
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL (Neon)** - Serverless PostgreSQL database
- **JWT** - Secure session management
- **Nodemailer** - Email service integration

### PWA & Performance
- **Vite PWA Plugin** - Progressive Web App support
- **Workbox** - Service worker and caching strategies
- **Sharp** - High-performance image processing
- **Web Notifications API** - Desktop notifications

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Drizzle Kit** - Database migrations
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm or pnpm** - Package manager
- **Neon PostgreSQL** - Serverless database (free tier available at [neon.tech](https://neon.tech))
- **Git** - Version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hopstech-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database - Neon PostgreSQL
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

   # JWT Secret for Authentication
   JWT_SECRET="your-secure-random-secret-key"

   # Email Configuration (for contact form and magic links)
   EMAIL_USER="your-email@domain.com"
   EMAIL_PASS="your-app-specific-password"
   EMAIL_HOST="smtp.zoho.eu"
   EMAIL_PORT="587"

   # Application Settings
   VITE_APP_TITLE="HOPSTECH INNOVATION"
   VITE_APP_LOGO="/logo.png"
   NODE_ENV="development"
   ```

4. **Set up the database**

   ```bash
   # Push schema to Neon PostgreSQL
   npm run db:push

   # Seed with sample data (optional)
   npm exec tsx server/seed.ts
   ```

5. **Generate PWA icons (optional)**

   ```bash
   node scripts/generate-pwa-icons.js
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### First-Time Setup

After starting the dev server:

1. **Access the Portfolio** - Navigate to `http://localhost:3000`
2. **Access the Client Portal** - Navigate to `http://localhost:3000/client-portal`
3. **Login with Magic Link** - Enter your email to receive a passwordless login link
4. **Explore Features** - Check out notifications, projects, timeline, AI insights, and more!

## 📁 Project Structure

```plaintext
hopstech-portfolio/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   ├── manifest.json           # PWA manifest
│   │   ├── pwa-icon-*.png          # PWA icons
│   │   ├── favicon-*.png           # Rounded favicons
│   │   └── logo.png                # HOPSTECH logo
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Shadcn/ui components
│   │   │   │   ├── loading-spinner.tsx  # Loading components
│   │   │   │   ├── skeletons.tsx        # Skeleton screens
│   │   │   │   └── ...             # Other UI components
│   │   │   ├── dashboard/          # Client portal components
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── NotificationCenter.tsx
│   │   │   │   ├── CreateProjectModal.tsx
│   │   │   │   └── ...
│   │   │   ├── project/            # Project-specific components
│   │   │   │   ├── ProjectTimeline.tsx
│   │   │   │   ├── ProjectInsights.tsx
│   │   │   │   └── ...
│   │   │   ├── pwa/                # PWA components
│   │   │   │   ├── PWAInstallPrompt.tsx
│   │   │   │   ├── PWAUpdatePrompt.tsx
│   │   │   │   └── OfflineIndicator.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── pages/                  # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── PortfolioPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── ClientPortalPage.tsx
│   │   │   ├── ClientProjectDetailPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── SupportPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── usePWA.ts
│   │   ├── lib/                    # Utilities and configurations
│   │   │   ├── trpc.ts             # tRPC client
│   │   │   ├── projectInsights.ts  # AI insights logic
│   │   │   ├── confetti.ts         # Confetti animations
│   │   │   └── utils.ts
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Global styles
│   └── index.html
├── server/                          # Backend application
│   ├── routers.ts                  # tRPC router configuration
│   ├── projectRouter.ts            # Projects API
│   ├── serviceRouter.ts            # Services API
│   ├── testimonialRouter.ts        # Testimonials API
│   ├── contactRouter.ts            # Contact form API
│   ├── clientPortalRouter.ts       # Client portal API (25+ endpoints)
│   ├── authRouter.ts               # Authentication API
│   ├── auth.ts                     # JWT session management
│   ├── email.ts                    # Email service
│   ├── db.ts                       # Database connection
│   └── seed.ts                     # Database seeding script
├── drizzle/                         # Database schema and migrations
│   ├── schema.ts                   # Database schema (20+ tables)
│   └── seed-notifications.ts       # Notification seeding
├── scripts/                         # Utility scripts
│   └── generate-pwa-icons.js       # PWA icon generator
├── shared/                          # Shared types and utilities
│   └── portfolio-types.ts
├── vite.config.ts                  # Vite configuration with PWA
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) - Trust, professionalism
- **Secondary**: Purple (#9333ea) - Innovation, creativity
- **Background**: Navy Blue (#0f172a) - Sophisticated, modern
- **Accent**: Pink (#ec4899) - Energy, attention

### Typography
- **Headings**: Bold, gradient effects
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for technical content

### Components
- **Cards**: Hover effects with border glow
- **Buttons**: Primary, secondary, and outline variants
- **Badges**: Technology tags and categories
- **Forms**: Floating labels with validation

## 🗄️ Database Schema

The application uses **Neon PostgreSQL** with **Drizzle ORM** for type-safe database operations. The schema includes 20+ tables:

### Portfolio Tables

- **projects** - Portfolio projects with title, description, category, technologies, metrics, images, URLs
- **services** - Service offerings with features, pricing, and active status
- **testimonials** - Client testimonials with name, role, company, content, rating
- **contactSubmissions** - Contact form submissions with status tracking
- **blogPosts** - Blog posts with title, slug, content, author, category, tags
- **newsletterSubscriptions** - Email subscriptions with active status
- **analytics** - Page views, unique visitors, referrer tracking

### Client Portal Tables

- **users** - User accounts with email, authentication tokens
- **userProfiles** - Extended user profiles with company info, phone, avatar
- **clientProjectsExtended** - Client projects with type, priority, budget, milestones, status
- **projectFiles** - File attachments for projects with upload tracking
- **invoices** - Invoice management with amount, status, due dates, payment tracking
- **supportTickets** - Support ticket system with priority, status, assignment
- **ticketMessages** - Threaded messages for support tickets
- **messages** - Direct messaging system between clients and staff
- **notifications** - Notification system with priority, grouping, snoozing, action types
- **activityLog** - Comprehensive activity tracking for all user actions
- **notificationPreferences** - User preferences for notification channels and types

All tables include proper timestamps, foreign key relationships, and indexes for optimal performance.

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build

# Database
npm run db:push         # Push schema changes to Neon PostgreSQL
npm run db:studio       # Open Drizzle Studio (database GUI)

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler

# PWA
node scripts/generate-pwa-icons.js  # Generate PWA icons and favicons
```

### Development Workflow

1. **Start the dev server** - `npm run dev`
2. **Make changes** - Edit files in `client/src/` or `server/`
3. **Hot reload** - Changes are automatically reflected in the browser
4. **Database changes** - Update `drizzle/schema.ts` and run `npm run db:push`
5. **Test features** - Use the client portal at `/client-portal`

### Adding New Features

#### Add a New Page

1. Create page component in `client/src/pages/`

   ```typescript
   // client/src/pages/NewPage.tsx
   export default function NewPage() {
     return <div>New Page Content</div>;
   }
   ```

2. Add route in `client/src/App.tsx`

   ```typescript
   <Route path="/new-page" component={NewPage} />
   ```

3. Update navigation in `client/src/components/Navigation.tsx`

#### Add a New tRPC Endpoint

1. Create or update router in `server/`

   ```typescript
   // server/newRouter.ts
   export const newRouter = router({
     getData: publicProcedure.query(async () => {
       return { data: 'example' };
     }),
   });
   ```

2. Register router in `server/routers.ts`

   ```typescript
   export const appRouter = router({
     // ... existing routers
     new: newRouter,
   });
   ```

3. Use in frontend

   ```typescript
   const { data } = trpc.new.getData.useQuery();
   ```

### Customization

#### Update Contact Information

Edit `client/src/components/Footer.tsx`:

```typescript
<a href="mailto:hk@hopstecinnovation.com">
  hk@hopstecinnovation.com
</a>
<a href="tel:+33776026688">
  +33 7 76 02 66 88
</a>
```

#### Modify Theme Colors

Edit `client/src/index.css`:

```css
.dark {
  --primary: var(--color-blue-700);
  --background: oklch(0.141 0.005 285.823);
  /* Adjust other color variables */
}
```

#### Customize PWA Settings

Edit `client/public/manifest.json`:

```json
{
  "name": "HOPSTECH INNOVATION",
  "short_name": "HOPSTECH",
  "theme_color": "#2563eb",
  "background_color": "#0f172a"
}
```

## 📧 Email Configuration

The contact form uses SMTP to send email notifications. Configure with Zoho Mail or any SMTP provider:

### Zoho Mail Setup
1. Create a Zoho Mail account
2. Generate an App-Specific Password
3. Add environment variables:
   ```env
   EMAIL_USER="your-email@domain.com"
   EMAIL_PASS="app-specific-password"
   EMAIL_HOST="smtppro.zoho.eu"
   EMAIL_PORT="587"
   ```

### Alternative Providers
- **Gmail**: `smtp.gmail.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`

## 🚢 Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment with serverless functions and edge caching:

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Configure environment variables**

   Add all environment variables from `.env` to Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`
   - `NODE_ENV=production`

3. **Deploy**

   ```bash
   vercel --prod
   ```

4. **Configure custom domain** (optional)
   - Add domain in Vercel dashboard
   - Update DNS records

### Alternative Platforms

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Note:** Configure environment variables in Netlify dashboard under Site settings → Environment variables.

#### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t hopstech-portfolio .
docker run -p 3000:3000 --env-file .env hopstech-portfolio
```

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure Neon PostgreSQL connection string
- [ ] Run database migrations (`npm run db:push`)
- [ ] Test email configuration
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Test PWA installation
- [ ] Verify all features work in production

## 🔐 Security

### Best Practices Implemented
- Environment variables for sensitive data
- Input validation on forms
- SQL injection prevention with Drizzle ORM
- XSS protection with React
- HTTPS enforcement in production
- Rate limiting on API endpoints (recommended)

### Recommendations
1. Enable CORS only for trusted domains
2. Implement authentication for admin features
3. Regular dependency updates
4. Monitor for security vulnerabilities
5. Use Content Security Policy headers

## 📊 Performance

### Optimization Techniques
- Code splitting with Vite
- Lazy loading of images
- Minification and compression
- Tree shaking for smaller bundles
- CDN for static assets (recommended)

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Portfolio filtering and search
- [ ] Project detail pages display properly
- [ ] Contact form submits successfully
- [ ] Responsive design on mobile/tablet
- [ ] All links work correctly
- [ ] Images load properly

### Future: Automated Testing
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 📝 Content Management

### Current Approach
- Database-driven content
- Manual updates via Drizzle Studio or seed scripts

### Future Enhancements
- Admin dashboard for content management
- Rich text editor for blog posts
- Image upload and management
- Draft/publish workflow
- Content versioning

## 🌐 SEO Optimization

### Implemented
- Semantic HTML structure
- Meta tags for social sharing
- Descriptive alt text for images
- Clean URL structure
- Mobile-friendly design

### Recommended Additions
- Sitemap.xml generation
- Robots.txt configuration
- Schema.org structured data
- Open Graph tags
- Twitter Card tags
- Google Analytics integration

## 📞 Contact & Support

### Author

**Herve Kajingu**
Solo Developer & Owner
HOPSTECH INNOVATION

### Contact Information

- **Email**: [hk@hopstecinnovation.com](mailto:hk@hopstecinnovation.com)
- **Phone**: +33 7 76 02 66 88
- **GitHub**: [github.com/hopstech](https://github.com/hopstech)
- **LinkedIn**: [linkedin.com/in/herve-kajingu](https://linkedin.com/in/herve-kajingu)
- **Website**: [hopstecinnovation.com](https://hopstecinnovation.com)

### Business Inquiries

For DevOps consulting, software development services, or partnership opportunities, please reach out via email or phone.

## 📄 License

**Copyright © 2024 HOPSTECH INNOVATION. All Rights Reserved.**

This project and its contents are proprietary and confidential. Unauthorized copying, distribution, modification, or use of this software, via any medium, is strictly prohibited without explicit written permission from the copyright holder.

### Proprietary License

- **Owner**: Herve Kajingu
- **Company**: HOPSTECH INNOVATION
- **Rights**: All rights reserved
- **Usage**: This software is for demonstration and portfolio purposes only
- **Restrictions**: No part of this project may be reproduced, distributed, or transmitted in any form without prior written permission

For licensing inquiries, please contact: hk@hopstecinnovation.com

## 🙏 Acknowledgments

This project was built using the following open-source technologies and tools:

### Core Technologies

- **[React](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev)** - Build tool and dev server
- **[tRPC](https://trpc.io)** - End-to-end type-safe APIs
- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database toolkit
- **[Neon](https://neon.tech)** - Serverless PostgreSQL

### UI & Styling

- **[Shadcn/ui](https://ui.shadcn.com)** - High-quality React components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Lucide](https://lucide.dev)** - Beautiful icon library
- **[Framer Motion](https://www.framer.com/motion)** - Animation library

### Additional Libraries

- **[Three.js](https://threejs.org)** - 3D graphics
- **[Canvas Confetti](https://github.com/catdad/canvas-confetti)** - Celebration animations
- **[Workbox](https://developers.google.com/web/tools/workbox)** - PWA service worker
- **[Sharp](https://sharp.pixelplumbing.com)** - Image processing

Special thanks to the open-source community for making these amazing tools available.

---

## 📊 Project Information

**Project Name**: HOPSTECH INNOVATION Portfolio & Client Portal
**Version**: 2.0.0
**Author**: Herve Kajingu
**Company**: HOPSTECH INNOVATION
**Last Updated**: December 2025
**Status**: Production Ready ✅
**License**: Proprietary - All Rights Reserved

---

**Built with ❤️ by Herve Kajingu**
