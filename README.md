# HOPSTECH Portfolio Website

A cutting-edge portfolio website showcasing DevOps engineering expertise and software development projects for **Herve Kajingu**.

![HOPSTECH Portfolio](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff)

## 🌟 Features

### Core Functionality
- **Dynamic Portfolio Showcase** - Display projects with filtering, search, and detailed views
- **Service Offerings** - Highlight DevOps, Full-Stack Development, and Cloud Architecture services
- **Client Testimonials** - Build trust with social proof from satisfied clients
- **Contact Form** - Integrated contact system with email notifications
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Dark Theme** - Sophisticated navy blue color scheme with gradient effects

### Technical Highlights
- **Type-Safe APIs** - End-to-end type safety with tRPC
- **Database Integration** - Neon PostgreSQL with Drizzle ORM
- **Modern UI Components** - Shadcn/ui with Tailwind CSS
- **SEO Optimized** - Meta tags and semantic HTML
- **Performance Focused** - Fast loading with Vite bundling
- **Smooth Animations** - Professional transitions and hover effects
- **Serverless Ready** - Optimized for Vercel deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm (or pnpm)
- Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hopstech-portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   # Database - Neon PostgreSQL
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

   # Email (Optional - for contact form)
   EMAIL_USER="your-email@domain.com"
   EMAIL_PASS="your-app-specific-password"
   EMAIL_HOST="smtp.zoho.eu"
   EMAIL_PORT="587"

   # Application
   VITE_APP_TITLE="HOPSTECH INNOVATION"
   VITE_APP_LOGO="/logo.png"
   ```

4. **Set up the database**
   ```bash
   # Generate and apply migrations to Neon PostgreSQL
   npm run db:push

   # Seed with sample data (optional)
   npm exec tsx server/seed.ts
   ```

   > **Note:** This project uses Neon PostgreSQL. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
hopstech-portfolio/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Shadcn/ui components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── PortfolioPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   └── ContactPage.tsx
│   │   ├── lib/          # Utilities and configurations
│   │   ├── App.tsx       # Main app component
│   │   └── index.css     # Global styles
│   └── index.html
├── server/                # Backend application
│   ├── routers.ts        # tRPC router configuration
│   ├── projectRouter.ts  # Projects API
│   ├── serviceRouter.ts  # Services API
│   ├── testimonialRouter.ts  # Testimonials API
│   ├── contactRouter.ts  # Contact form API
│   ├── db.ts            # Database connection
│   └── seed.ts          # Database seeding script
├── drizzle/              # Database schema and migrations
│   └── schema.ts        # Database schema definition
├── shared/               # Shared types and utilities
│   └── portfolio-types.ts
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

### Projects
- Title, description, category
- Technologies, metrics, client info
- Thumbnail, gallery images
- GitHub URL, live URL
- Featured flag, publish date

### Services
- Title, description, icon
- Features list, pricing
- Active status

### Testimonials
- Client name, role, company
- Content, rating
- Featured flag

### Contact Submissions
- Name, email, company, phone
- Subject, message
- Status tracking, timestamps

### Blog Posts
- Title, slug, content
- Author, category, tags
- Featured image, publish date

### Newsletter Subscriptions
- Email, subscription date
- Active status

### Analytics
- Page views, unique visitors
- Referrer tracking
- Timestamps

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm preview         # Preview production build

# Database
pnpm db:push         # Push schema changes
pnpm db:studio       # Open Drizzle Studio

# Code Quality
pnpm lint            # Run ESLint
pnpm type-check      # Run TypeScript compiler
```

### Adding New Projects

1. **Via Database**
   ```typescript
   // Add to seed.ts or use Drizzle Studio
   await db.insert(projects).values({
     title: 'Project Name',
     slug: 'project-name',
     description: 'Short description',
     longDescription: 'Detailed description',
     category: 'DevOps',
     technologies: ['Docker', 'Kubernetes'],
     thumbnail: '/images/project.jpg',
     featured: true,
     publishedAt: new Date(),
   });
   ```

2. **Via API**
   - Use tRPC mutations to create projects programmatically
   - Implement admin panel for content management (future enhancement)

### Customization

#### Update Contact Information
Edit `client/src/components/Footer.tsx`:
```typescript
<a href="mailto:hk@hopstechinnovation.com">
  hk@hopstechinnovation.com
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

#### Add New Pages
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Update navigation in `client/src/components/Navigation.tsx`

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

### Manus Platform (Recommended)
The project is optimized for Manus hosting with built-in database and deployment:

1. Click **Publish** in the Manus UI
2. Configure custom domain (optional)
3. Set environment variables in Settings → Secrets

### Alternative Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

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

## 📞 Contact

**Herve Kajingu**  
DevOps Engineer & Full-Stack Developer

- **Email**: hk@hopstechinnovation.com
- **Phone**: +33 7 76 02 66 88
- **GitHub**: [github.com/hopstech](https://github.com/hopstech)
- **LinkedIn**: [linkedin.com/in/herve-kajingu](https://linkedin.com/in/herve-kajingu)

## 📄 License

This project is proprietary and confidential. All rights reserved © 2024 HOPSTECH INNOVATION.

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) - AI-powered development platform
- UI Components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
