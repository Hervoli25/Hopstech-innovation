import { getDb } from "./db";
import { projects, services, blogPosts, testimonials, projectTypes } from "../drizzle/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }

  try {
    // Seed Projects
    console.log("📦 Seeding projects...");
    await db.insert(projects).values([
      {
        title: "Talaria - Fleet Management System",
        slug: "talaria-fleet-management",
        description: "Advanced fleet management and logistics optimization platform",
        longDescription: `Talaria is a comprehensive fleet management system designed to optimize logistics operations, reduce costs, and improve delivery efficiency. The platform provides real-time tracking, route optimization, and predictive maintenance capabilities.
        
        **Challenge:** The client was facing significant operational inefficiencies with their traditional fleet management approach, leading to high fuel costs and delayed deliveries.
        
        **Solution:** We developed a cloud-native platform using microservices architecture, implementing real-time GPS tracking, AI-powered route optimization, and predictive maintenance algorithms.
        
        **Results:** The implementation resulted in a 65% improvement in delivery efficiency, 40% reduction in operational costs, and 99.9% system uptime.`,
        thumbnail: "/images/projects/talaria-thumbnail.jpg",
        images: [
          "/images/projects/talaria-1.jpg",
          "/images/projects/talaria-2.jpg",
          "/images/projects/talaria-3.jpg"
        ] as any,
        technologies: [
          "React",
          "Node.js",
          "PostgreSQL",
          "Docker",
          "Kubernetes",
          "AWS",
          "Redis",
          "GraphQL"
        ] as any,
        category: "Full-Stack Development",
        client: "Logistics Corp",
        url: "https://talaria-demo.example.com",
        githubUrl: "https://github.com/hopstech/talaria",
        featured: true,
        order: 1,
        metrics: {
          "Performance Improvement": "65%",
          "Cost Reduction": "40%",
          "System Uptime": "99.9%",
          "User Satisfaction": "4.8/5"
        } as any,
        publishedAt: new Date("2024-01-15")
      },
      {
        title: "Talos - CI/CD Pipeline Automation",
        slug: "talos-cicd-automation",
        description: "Enterprise-grade CI/CD pipeline automation and DevOps orchestration platform",
        longDescription: `Talos is an enterprise CI/CD platform that automates the entire software delivery lifecycle, from code commit to production deployment. It integrates seamlessly with existing tools and provides comprehensive monitoring and rollback capabilities.
        
        **Challenge:** The organization was struggling with manual deployment processes, leading to frequent errors and slow release cycles.
        
        **Solution:** We built an automated CI/CD platform with multi-cloud support, automated testing, security scanning, and one-click rollback functionality.
        
        **Results:** Deployment time reduced from hours to minutes, with zero-downtime deployments and 50% reduction in production incidents.`,
        thumbnail: "/images/projects/talos-thumbnail.jpg",
        images: [
          "/images/projects/talos-1.jpg",
          "/images/projects/talos-2.jpg"
        ] as any,
        technologies: [
          "Jenkins",
          "Docker",
          "Kubernetes",
          "Terraform",
          "Ansible",
          "Python",
          "GitLab",
          "Prometheus"
        ] as any,
        category: "DevOps",
        client: "Tech Enterprise Inc",
        url: "https://talos-demo.example.com",
        featured: true,
        order: 2,
        metrics: {
          "Deployment Speed": "10x faster",
          "Incident Reduction": "50%",
          "Automation Rate": "95%",
          "Developer Satisfaction": "4.9/5"
        } as any,
        publishedAt: new Date("2024-03-20")
      },
      {
        title: "PRESTIGE Car Wash",
        slug: "prestige-car-wash",
        description: "Enterprise Car Wash Service Management Platform",
        longDescription: `PRESTIGE Car Wash is a comprehensive, enterprise-grade car wash service platform delivering seamless booking experiences, intelligent membership management, and integrated payment processing for modern car wash businesses.

**Overview**

A full-featured business management solution designed specifically for premium car wash operations. The platform combines cutting-edge web technologies with intuitive design to provide an exceptional experience for both customers and business operators.

**Challenge**

Traditional car wash businesses struggled with manual booking systems, inefficient customer management, and fragmented payment processing. Customers faced long wait times and lacked transparency in service tracking, while business owners had no centralized system for analytics and operations management.

**Solution**

We developed a comprehensive platform featuring:
• Smart booking system with real-time availability and intelligent scheduling
• Digital membership cards with QR codes and loyalty points tracking
• Secure Stripe payment integration with saved payment methods
• Real-time SMS and email notifications for confirmations and reminders
• Mobile-first responsive design optimized for all devices
• Analytics dashboard with comprehensive business intelligence
• Customer management with detailed profiles and interaction history
• Dynamic service configuration and pricing management
• Staff coordination with booking assignments and schedule management

**Results**

The platform successfully transformed the car wash business operations, resulting in streamlined customer experiences, improved operational efficiency, and enhanced revenue tracking. The digital membership system increased customer retention, while automated notifications reduced no-shows significantly.`,
        thumbnail: "/showcase/Ekhaya1.png",
        images: [
          "/showcase/Ekhaya1.png",
          "/showcase/Ekhaya2.png",
          "/showcase/Ekhaya3.png",
          "/showcase/Ekhaya4.png"
        ] as any,
        technologies: [
          "Next.js 14",
          "TypeScript",
          "Tailwind CSS",
          "Radix UI",
          "Framer Motion",
          "Prisma ORM",
          "PostgreSQL",
          "NextAuth.js",
          "Stripe",
          "Nodemailer",
          "Twilio",
          "Vercel",
          "Neon PostgreSQL"
        ] as any,
        category: "Full-Stack Development",
        client: "PRESTIGE by Ekhaya",
        url: "https://www.prestigebyekhaya.com",
        featured: true,
        order: 3,
        metrics: {
          "Customer Retention": "+45%",
          "Booking Efficiency": "85%",
          "Payment Success Rate": "99.2%",
          "User Satisfaction": "4.9/5"
        } as any,
        publishedAt: new Date("2024-11-15")
      },
      {
        title: "Game Hub Platform",
        slug: "game-hub-platform",
        description: "Modern Game Discovery Platform with Advanced Filtering",
        longDescription: `Game Hub is a modern, responsive game discovery platform built with React and TypeScript that allows users to browse, search, and filter thousands of games using the RAWG Video Games Database API.

**Overview**

Game Hub provides an intuitive interface for gamers to discover new games based on their preferences. The platform features advanced filtering capabilities, multiple sorting options, and a beautiful responsive design that works seamlessly across all devices.

**Key Features**

- **Comprehensive Game Database**: Access to thousands of games from the RAWG API
- **Advanced Search**: Find games quickly by name with real-time search
- **Genre Filtering**: Browse games by genre (Action, RPG, Strategy, Sports, etc.)
- **Platform Filtering**: Filter by gaming platform (PC, PlayStation, Xbox, Nintendo, etc.)
- **Smart Sorting**: Sort by relevance, date added, name, release date, popularity, or rating
- **Theme Toggle**: Switch between dark and light modes for comfortable viewing
- **Responsive Design**: Optimized experience on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast load times

**Technical Implementation**

The platform leverages modern web technologies to deliver a smooth, performant user experience. React 18 provides the foundation for the UI, while TypeScript ensures type safety throughout the codebase. Chakra UI components offer a consistent, accessible design system, and Axios handles efficient API communication with the RAWG database.

**User Experience**

Game Hub prioritizes user experience with intuitive navigation, smooth animations, and instant feedback. The filtering system allows users to combine multiple criteria to find exactly what they're looking for, while the responsive grid layout adapts beautifully to any screen size.

**Impact**

- Provides instant access to comprehensive game information
- Helps users discover new games based on their preferences
- Offers a modern, polished alternative to traditional game databases
- Demonstrates best practices in React development and API integration`,
        thumbnail: "/showcase/gamehub1.png",
        images: [
          "/showcase/gamehub1.png",
          "/showcase/gamehub2.png",
          "/showcase/gamehub3.png"
        ] as any,
        technologies: [
          "React 18",
          "TypeScript",
          "Vite",
          "Chakra UI",
          "Axios",
          "RAWG API",
          "React Query",
          "Zustand",
          "Vercel"
        ] as any,
        category: "Full-Stack Development",
        client: "Personal Project",
        url: "https://game-hub-hervoli25.vercel.app/",
        githubUrl: "https://github.com/hervoli25/game-hub",
        featured: true,
        order: 2,
        metrics: {
          "API Integration": "RAWG Database",
          "Games Available": "500,000+",
          "Load Time": "<1s",
          "User Rating": "4.7/5"
        } as any,
        publishedAt: new Date("2024-02-10")
      }
    ]);

    // Seed Services
    console.log("🛠️  Seeding services...");
    await db.insert(services).values([
      {
        title: "DevOps Engineering",
        slug: "devops-engineering",
        description: "End-to-end DevOps solutions including CI/CD pipelines, infrastructure automation, and cloud optimization",
        icon: "DevOps",
        features: [
          "CI/CD Pipeline Setup & Optimization",
          "Infrastructure as Code (Terraform, Ansible)",
          "Container Orchestration (Docker, Kubernetes)",
          "Cloud Migration & Optimization (AWS, GCP, Azure)",
          "Monitoring & Logging Solutions",
          "Security & Compliance Automation",
          "Performance Optimization",
          "24/7 Support & Maintenance"
        ] as any,
        pricing: {
          type: "custom",
          starting: "Contact for quote",
          description: "Pricing varies based on project scope and requirements"
        } as any,
        order: 1,
        active: true
      },
      {
        title: "Full-Stack Development",
        slug: "full-stack-development",
        description: "Modern web applications built with React, Next.js, Node.js, and cutting-edge technologies",
        icon: "Code",
        features: [
          "Custom Web Application Development",
          "Progressive Web Apps (PWA)",
          "API Development & Integration",
          "Database Design & Optimization",
          "Real-time Features (WebSockets)",
          "Payment Integration (Stripe, PayPal)",
          "Third-party API Integration",
          "Responsive & Mobile-First Design"
        ] as any,
        pricing: {
          type: "project-based",
          starting: "€5,000",
          description: "Project-based pricing with flexible payment terms"
        } as any,
        order: 2,
        active: true
      },
      {
        title: "Cloud Architecture",
        slug: "cloud-architecture",
        description: "Scalable cloud infrastructure design and implementation for modern applications",
        icon: "Cloud",
        features: [
          "Cloud Strategy & Consulting",
          "Multi-Cloud Architecture Design",
          "Serverless Application Development",
          "Microservices Architecture",
          "Auto-scaling & Load Balancing",
          "Disaster Recovery Planning",
          "Cost Optimization",
          "Security Best Practices"
        ] as any,
        pricing: {
          type: "consulting",
          starting: "€150/hour",
          description: "Hourly consulting or fixed-price projects available"
        } as any,
        order: 3,
        active: true
      }
    ]);

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    await db.insert(blogPosts).values([
      {
        title: "Building Scalable Microservices with Kubernetes",
        slug: "building-scalable-microservices-kubernetes",
        excerpt: "Learn how to design, deploy, and manage microservices at scale using Kubernetes orchestration",
        content: `# Building Scalable Microservices with Kubernetes

Microservices architecture has become the de facto standard for building modern, scalable applications. In this comprehensive guide, we'll explore how to leverage Kubernetes to orchestrate and manage microservices at scale.

## Why Microservices?

Microservices offer several advantages over monolithic architectures:
- **Scalability**: Scale individual services independently
- **Flexibility**: Use different technologies for different services
- **Resilience**: Failure in one service doesn't bring down the entire system
- **Faster Development**: Teams can work on services independently

## Kubernetes Fundamentals

Kubernetes provides the infrastructure needed to run microservices effectively...

[Content continues...]`,
        thumbnail: "/images/blog/kubernetes-microservices.jpg",
        author: "Herve Kajingu",
        tags: ["Kubernetes", "Microservices", "DevOps", "Cloud"] as any,
        published: true,
        views: 1250,
        readTime: 12,
        publishedAt: new Date("2024-11-15")
      },
      {
        title: "CI/CD Best Practices for Modern DevOps",
        slug: "cicd-best-practices-modern-devops",
        excerpt: "Essential CI/CD practices every DevOps engineer should implement for efficient software delivery",
        content: `# CI/CD Best Practices for Modern DevOps

Continuous Integration and Continuous Deployment (CI/CD) are fundamental to modern software development...

[Content continues...]`,
        thumbnail: "/images/blog/cicd-best-practices.jpg",
        author: "Herve Kajingu",
        tags: ["CI/CD", "DevOps", "Automation", "Best Practices"] as any,
        published: true,
        views: 980,
        readTime: 8,
        publishedAt: new Date("2024-10-20")
      }
    ]);

    // Seed Testimonials
    console.log("💬 Seeding testimonials...");
    await db.insert(testimonials).values([
      {
        name: "Sarah Johnson",
        role: "CTO",
        company: "Logistics Corp",
        content: "Herve transformed our entire infrastructure. The Talaria platform has revolutionized our fleet management operations. His expertise in DevOps and cloud architecture is unmatched.",
        avatar: "/images/testimonials/sarah-johnson.jpg",
        rating: 5,
        featured: true,
        approved: true
      },
      {
        name: "Michael Chen",
        role: "VP of Engineering",
        company: "Tech Enterprise Inc",
        content: "Working with Herve on our CI/CD pipeline was a game-changer. The Talos platform reduced our deployment time by 90% and significantly improved our development workflow.",
        avatar: "/images/testimonials/michael-chen.jpg",
        rating: 5,
        featured: true,
        approved: true
      },
      {
        name: "Papy Kapole",
        role: "CEO",
        company: "PRESTIGE by Ekhaya",
        content: "Herve delivered an exceptional car wash management platform that transformed our business operations. His attention to detail and technical expertise created a system that streamlined our customer bookings, automated our membership management, and significantly improved our revenue tracking. The platform has been instrumental in scaling PRESTIGE to new heights.",
        avatar: "/images/testimonials/papy-kapole.jpg",
        rating: 5,
        featured: true,
        approved: true
      }
    ]);

    // Seed Project Types
    console.log("🏷️  Seeding project types...");
    await db.insert(projectTypes).values([
      {
        name: "Web Application",
        description: "Full-stack web applications with modern frameworks",
        icon: "Globe",
        active: true,
        order: 1
      },
      {
        name: "Mobile Application",
        description: "Native or cross-platform mobile apps",
        icon: "Smartphone",
        active: true,
        order: 2
      },
      {
        name: "DevOps & Infrastructure",
        description: "CI/CD pipelines, cloud infrastructure, and automation",
        icon: "Server",
        active: true,
        order: 3
      },
      {
        name: "E-commerce Platform",
        description: "Online stores and marketplace solutions",
        icon: "ShoppingCart",
        active: true,
        order: 4
      },
      {
        name: "API Development",
        description: "RESTful or GraphQL API services",
        icon: "Code",
        active: true,
        order: 5
      },
      {
        name: "Cloud Migration",
        description: "Migrate existing systems to cloud platforms",
        icon: "Cloud",
        active: true,
        order: 6
      },
      {
        name: "Consulting & Strategy",
        description: "Technical consulting and architecture planning",
        icon: "Lightbulb",
        active: true,
        order: 7
      },
      {
        name: "Maintenance & Support",
        description: "Ongoing maintenance and technical support",
        icon: "Wrench",
        active: true,
        order: 8
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed function
seed()
  .then(() => {
    console.log("🎉 Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  });
