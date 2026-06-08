import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Cpu,
  Globe,
  HeartPulse,
  Server,
  Workflow,
} from "lucide-react";

export const enterpriseHero = {
  headlineLine1: "Good software changes how a business operates.",
  headlineLine2: "Great software changes what a business can become.",
  subheadline:
    "We design and build custom web applications, mobile products, and automation systems for companies that take their technology seriously.",
  locationTag: "Paris-based. Precision-built.",
  ctaSeeWork: "See our work",
  ctaGetInTouch: "Get in touch",
};

export const enterpriseAbout = {
  title: "Who we are",
  paragraphs: [
    "Hopstec Innovation was built on a straightforward belief: the right software, built properly, changes what an organisation can do. Not incrementally. Fundamentally.",
    "We are a Paris-based software consultancy specialising in custom web and mobile development, DevOps infrastructure, and operational automation. We work with businesses that need a technical partner who understands both the engineering and the business problem behind it — and who stays accountable from the first line of code to the final deployment.",
    "Alongside our consultancy work, we build our own products. Our current flagship is 20Hecto — a precision metabolic nutrition platform for people managing endocrine and metabolic conditions including diabetes, PCOS, and thyroid disorders. 20Hecto goes beyond calorie counting, tracking what actually matters for metabolic health: glycaemic load, blood glucose patterns, lab value trends, fasting windows, and medication adherence. It is connected to a Practitioner Portal verified through the French RPPS registry, so patients and their care teams work from the same data. It is live on Google Play.",
    "Building 20Hecto taught us something important: the best software is not the most technically impressive. It is the most honest — built around a real problem, with real people at the centre of every decision.",
    "That is the standard we bring to every client project. Hopstec Innovation. 47 Rue Vivienne, 75002 Paris.",
  ],
};

export type EnterpriseService = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const enterpriseServices = {
  title: "What we build",
  intro:
    "We work across the full stack — from product design and development to deployment, automation, and ongoing infrastructure. Every engagement starts with the problem, not the technology.",
  items: [
    {
      icon: Globe,
      title: "Custom Web and Mobile Applications",
      body: "We design and build web applications and mobile products from the ground up. Whether you need a client-facing platform, an internal management tool, or a consumer app, we build it around your specific workflows and your users — not around a template. Our stack covers React, Next.js, Django, Flask, Node.js, and Tailwind CSS, deployed on infrastructure that scales with your growth.",
    },
    {
      icon: Server,
      title: "DevOps and Infrastructure",
      body: "Shipping software is only half the work. We build the pipelines, containerisation strategies, and deployment workflows that keep your product stable, testable, and continuously deliverable. We work with Docker, Docker Swarm, GitLab CI/CD, and cloud environments, and we design systems that your team can own and operate long after we hand them over.",
    },
    {
      icon: Workflow,
      title: "Automation and Internal Tooling",
      body: "Manual processes that run on spreadsheets and emails are a liability. We build internal automation systems — logistics pipelines, scheduling tools, operational dashboards, and workflow integrations — that reduce the time your team spends on repetitive tasks and increase the reliability of the output. Our automation work draws directly from production systems we have built and maintained in demanding industrial environments.",
    },
    {
      icon: HeartPulse,
      title: "HealthTech and Regulated Environments",
      body: "We have direct experience building software for health contexts that require patient data protection, practitioner verification, and clinical-grade data flows. We understand the RPPS registry, GDPR compliance in health, and the design decisions that make health software trustworthy to both patients and clinicians. If your product operates in a regulated environment, we know what that requires.",
    },
    {
      icon: Cpu,
      title: "IoT and Connected Devices",
      body: "We design and build connected hardware and software systems — from embedded firmware on microcontrollers to cloud backends, MQTT brokers, and real-time dashboards. Our IoT work covers device communication, remote monitoring, data ingestion pipelines, and the full integration between physical hardware and the software that manages it.",
    },
    {
      icon: Brain,
      title: "AI Integration",
      body: "We integrate AI capabilities into products and workflows where they add measurable value. This includes language model integration, AI-powered food and health analysis, pattern recognition systems, and personalised recommendation engines. We do not add AI for its own sake. We add it where it removes friction, improves accuracy, or delivers something the product could not do without it.",
    },
  ] satisfies EnterpriseService[],
};

export type CaseStudyDetailSection = {
  heading: string;
  body: string;
};

export type EnterpriseCaseStudy = {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  techStack: string;
  deployment?: string;
  url?: string;
  isGuardian?: boolean;
  details: CaseStudyDetailSection[];
};

export const enterpriseCaseStudies = {
  title: "How we work in practice",
  intro:
    "These are products and systems we have designed, built, and shipped. Each one represents a specific problem, a deliberate technical approach, and a measurable outcome.",
  items: [
    {
      id: "20hecto",
      title: "20Hecto — Precision Metabolic Nutrition",
      tags: ["HealthTech", "Web and Mobile", "AI Integration"],
      summary:
        "A full-stack precision nutrition platform for people managing diabetes, PCOS, thyroid disorders, and insulin resistance — with clinical integration via the French RPPS registry.",
      techStack: "React 19, Node.js, Neon PostgreSQL",
      deployment: "app.20hecto.com",
      url: "https://app.20hecto.com",
      details: [
        {
          heading: "The Problem",
          body: "People managing diabetes, PCOS, thyroid disorders, and insulin resistance had no nutrition tool built around the complexity of their conditions. Every existing option was designed for weight loss through calorie counting — the wrong metric for metabolic health.",
        },
        {
          heading: "The Solution",
          body: "A full-stack precision nutrition platform built on React 19, Node.js, and Neon PostgreSQL. 20Hecto tracks blood glucose across reading types and correlates it with meal logs, monitors lab values including HbA1c, LDL, HDL, and triglycerides across appointments, scans food barcodes and returns glycaemic load with AI advice personalised to the user's medications, runs an AI Meal Coach that analyses seven days of meals and generates a corrective three-day plan, and includes a Fasting Tracker with phase guidance and a Medication Log.",
        },
        {
          heading: "Clinical Integration",
          body: "The Practitioner Portal allows dietitians and endocrinologists verified through the French RPPS registry to access a patient's full clinical summary — with consent managed entirely by the patient via a one-time six-digit code.",
        },
        {
          heading: "Status",
          body: "Live on Google Play. Apple App Store release targeted before end of 2026.",
        },
      ],
    },
    {
      id: "talaria",
      title: "Talaria — Logistics and Shipment Dashboard",
      tags: ["Internal Tooling", "Web Application", "Automation"],
      summary:
        "A Flask-based internal logistics dashboard that centralised shipment tracking and gave operations teams real-time visibility into every active shipment.",
      techStack: "Python, Flask, PostgreSQL",
      deployment: "Internal deployment",
      details: [
        {
          heading: "The Problem",
          body: "A photonic integrated circuits manufacturer was processing shipments manually, with tracking spread across disconnected systems. The process was slow, error-prone, and impossible to audit in real time.",
        },
        {
          heading: "The Solution",
          body: "Talaria is a Flask-based internal logistics dashboard built to centralise shipment tracking, automate status updates, and give operations teams a single source of truth for every active shipment. The application reduced shipment processing time significantly, replaced manual data entry with automated pipeline stages, and gave management real-time visibility into logistics operations for the first time.",
        },
        {
          heading: "Status",
          body: "Deployed in a production environment. Actively used by the operations team daily.",
        },
      ],
    },
    {
      id: "aquapulse",
      title: "AquaPulse AP-100 — Smart Water Management",
      tags: ["IoT", "Embedded Hardware", "Cloud Backend"],
      summary:
        "An ESP32-based IoT device for real-time water flow monitoring, with MQTT cloud integration and a live facility dashboard.",
      techStack: "ESP32, Django, HiveMQ MQTT, Railway",
      deployment: "hopstecinnovation.com",
      url: "https://hopstecinnovation.com/aquapulse",
      details: [
        {
          heading: "The Problem",
          body: "Water consumption monitoring in facilities relied on manual readings and offered no real-time visibility into usage patterns, leaks, or anomalies.",
        },
        {
          heading: "The Solution",
          body: "AquaPulse AP-100 is an ESP32-based IoT device designed and built under Hopstec Innovation to monitor water flow in real time. The device communicates over MQTT via HiveMQ, feeding data to a Django backend hosted on Railway. A real-time dashboard gives facility managers live consumption data, historical trends, and anomaly alerts.",
        },
        {
          heading: "Additional Work",
          body: "The product includes full CE homologation documentation, INPI patent filing, and product packaging — developed end to end by Hopstec Innovation.",
        },
      ],
    },
    {
      id: "prestige",
      title: "Prestige by Ekhaya — Car Wash Management Platform",
      tags: ["Web Application", "Business Operations", "Full Stack"],
      summary:
        "A Next.js and Prisma platform managing the full operational lifecycle of a car wash business in Cape Town.",
      techStack: "Next.js, Prisma, PostgreSQL",
      deployment: "prestigebyekhaya.com",
      url: "https://prestigebyekhaya.com/",
      details: [
        {
          heading: "The Problem",
          body: "A car wash business in Cape Town was managing bookings, staff scheduling, and customer records manually. There was no digital system connecting operations, no visibility into revenue trends, and no way to manage the customer relationship at scale.",
        },
        {
          heading: "The Solution",
          body: "Prestige by Ekhaya is a Next.js and Prisma platform built on PostgreSQL, designed to manage the full operational lifecycle of a car wash business. It covers booking management, staff scheduling, customer records, service history, and revenue reporting.",
        },
        {
          heading: "Status",
          body: "Built specifically for the South African market context and deployed for active use by the Ekhaya team in Cape Town.",
        },
      ],
    },
    {
      id: "guardian",
      title: "Guardian — AI Threat Investigation Workspace",
      tags: ["CyberSecurity", "AI Integration", "Workflow Orchestration"],
      summary:
        "A Django-based threat investigation workspace combining three AI-assisted fraud detection agents with Temporal workflow orchestration.",
      techStack:
        "Python, Django 4.2, Temporal Python SDK, Anthropic Claude API, SQLite, Tailwind",
      deployment: "hopstechguardian.com",
      url: "https://hopstechguardian.com",
      isGuardian: true,
      details: [
        {
          heading: "The Problem",
          body: "Fraud detection and threat investigation tools typically produce a verdict and stop. Analysts are left to manage case history, cross-case patterns, and follow-up actions across disconnected systems with no shared memory and no durable workflow state.",
        },
        {
          heading: "The Solution",
          body: "Guardian is a Django-based threat investigation workspace that combines three AI-assisted fraud detection agents with Temporal workflow orchestration. It treats every submission as a live investigation rather than a one-shot classification. Analysts can enable one, two, or all three agents depending on the evidence available: the Spam Agent evaluates sender, subject, and email content for phishing signals; the AML Agent reviews transaction context for anti-money-laundering indicators; and the Identity Agent checks for account takeover and identity theft signals from profile and session data.",
        },
        {
          heading: "Architecture",
          body: "Investigations run outside the normal HTTP request cycle via Temporal, which sequences agent execution, handles transient failures with automatic retries, and persists workflow state across app restarts. Each agent stores its own source record and analysis result. The master pipeline then computes an aggregate risk level — Critical, High, Medium, or Low. Every run is traceable via a Workflow ID.",
        },
        {
          heading: "Operational Features",
          body: "Beyond the AI pipeline, Guardian functions as a full operational workspace. Analysts can manage case ownership, priority, and resolution status, upload evidence files, write investigation notes, and review event timelines. Cross-case signal memory links recurring emails, domains, IP addresses, bank accounts, and devices across separate investigations and surfaces them in a Recurring Signals view. Watchlists trigger automatically when monitored entities reappear. Suggested response playbooks guide analysts through critical incident escalation, identity lockdown, AML compliance review, and spam containment. Outbound webhook delivery pushes investigation results to Slack, PagerDuty, or any HTTP endpoint. Scheduled rechecks create fresh investigation snapshots on a defined interval for proactive monitoring.",
        },
        {
          heading: "Status",
          body: "Live at hopstechguardian.com. Built and maintained by Hopstec Innovation.",
        },
      ],
    },
  ] satisfies EnterpriseCaseStudy[],
};

export const enterpriseMetrics = [
  { value: "5+", label: "Products shipped" },
  { value: "4", label: "Industry verticals" },
  { value: "Paris", label: "Headquarters" },
  { value: "Full-stack", label: "Design to deployment" },
];

export const enterpriseHowWeShip = {
  title: "How we ship",
  intro:
    "Every engagement follows a disciplined delivery model — from discovery and architecture through automated testing, staging, and production deployment. Your team inherits systems they can own.",
  stages: [
    { name: "Discover", desc: "Define the problem, scope, and success criteria" },
    { name: "Architect", desc: "Design systems around your workflows and constraints" },
    { name: "Build", desc: "Iterative development with continuous feedback" },
    { name: "Test", desc: "Automated quality gates at every stage" },
    { name: "Deploy", desc: "Staging validation before production release" },
    { name: "Operate", desc: "Monitoring, handover, and long-term support" },
  ],
};

export const enterpriseClientVisibility = {
  badge: "For Clients",
  title: "Work with full visibility",
  intro:
    "Every client gets a dedicated portal to track progress, review deliverables, manage payments, and communicate directly — no chasing updates by email.",
  features: [
    {
      title: "Secure Access",
      description: "Passwordless magic-link authentication — no credentials to manage",
    },
    {
      title: "Project Dashboard",
      description: "Live progress, milestones, phases, and deliverable tracking",
    },
    {
      title: "Direct Communication",
      description: "Messaging, support tickets, and activity logs in one place",
    },
    {
      title: "Payment Transparency",
      description: "Invoice tracking, installment schedules, and milestone-linked payments",
    },
  ],
  cta: "Access your portal",
};

export const enterpriseFooter = {
  companyName: "Hopstec Innovation",
  address: "47 Rue Vivienne, 75002 Paris, France",
  website: "hopstecinnovation.com",
  websiteUrl: "https://hopstecinnovation.com",
  email: "info@hopstecinnovation.com",
  navLinks: [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Case Studies", href: "/#case-studies" },
    { label: "Contact", href: "/contact" },
  ],
};
