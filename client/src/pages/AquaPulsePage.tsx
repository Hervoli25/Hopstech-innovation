import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Droplets,
  Gauge,
  Home,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import PageLayout from "../components/PageLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { trpc } from "../lib/trpc";

const plans = [
  {
    id: "starter",
    name: "Starter Protection",
    price: "EUR89",
    note: "Device pre-order",
    description: "Best for early customers who want the AquaPulse device reserved first.",
    features: [
      "1 AquaPulse AP-100 device",
      "Leak detection and auto shutoff",
      "Mobile app access",
      "Installation guidance",
    ],
    accent: "border-cyan-400/50 bg-cyan-500/10",
  },
  {
    id: "connected",
    name: "Connected Home",
    price: "EUR129",
    note: "Device + onboarding",
    description: "A stronger package for homes that want setup support and alerts ready on day one.",
    features: [
      "Everything in Starter",
      "Priority setup review",
      "Alert tuning support",
      "First-year dashboard onboarding",
    ],
    accent: "border-emerald-400/50 bg-emerald-500/10",
  },
  {
    id: "partner",
    name: "Property Partner",
    price: "Custom",
    note: "Multi-device quote",
    description: "For landlords, hotels, and property teams who need multiple devices and rollout planning.",
    features: [
      "Bulk device pricing",
      "Deployment planning",
      "Multi-site recommendations",
      "Dedicated sales follow-up",
    ],
    accent: "border-amber-400/50 bg-amber-500/10",
  },
] as const;

const highlightCards = [
  {
    title: "Stop leaks faster",
    description: "Monitor water flow in real time and trigger shutoff before damage spreads.",
    icon: ShieldCheck,
  },
  {
    title: "Track usage from anywhere",
    description: "Give customers a simple dashboard to check activity, history, and alerts.",
    icon: Smartphone,
  },
  {
    title: "Built for homes and properties",
    description: "From one apartment to multi-unit rollout, AquaPulse scales with the need.",
    icon: Home,
  },
];

const steps = [
  {
    title: "Install on the water line",
    description: "AquaPulse connects to the incoming supply and starts reading flow immediately.",
    icon: Wrench,
  },
  {
    title: "Detect unusual behavior",
    description: "The system watches for spikes, continuous flow, and signs of a hidden leak.",
    icon: Gauge,
  },
  {
    title: "Alert and act",
    description: "Customers receive notifications, and AquaPulse can shut off water automatically when needed.",
    icon: Bell,
  },
];

const includedFeatures = [
  "Real-time flow monitoring",
  "Instant leak alerts",
  "Automatic shutoff response",
  "Mobile dashboard access",
  "Usage analytics for households",
  "Support for property-scale deployments",
];

const appStoreBadges = [
  {
    id: "apple",
    name: "App Store",
    href: import.meta.env.VITE_AQUAPULSE_APP_STORE_URL || "",
    status: "Coming soon for iPhone and iPad",
    imageSrc: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
    imageAlt: "Download on the App Store",
  },
  {
    id: "google",
    name: "Google Play",
    href: import.meta.env.VITE_AQUAPULSE_GOOGLE_PLAY_URL || "",
    status: "Coming soon for Android",
    imageSrc: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
    imageAlt: "Get it on Google Play",
  },
] as const;

const AquaPulsePage = () => {
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[number]["id"]>("connected");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quantity: "1",
    address: "",
    message: "",
  });

  const activePlan = plans.find((plan) => plan.id === selectedPlan) ?? plans[1];

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("AquaPulse order request sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        quantity: "1",
        address: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send your request. Please try again.");
    },
  });

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlanSelect = (planId: (typeof plans)[number]["id"]) => {
    setSelectedPlan(planId);
    window.setTimeout(scrollToOrder, 50);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const quantity = Number.parseInt(formData.quantity, 10);
    const safeQuantity = Number.isNaN(quantity) || quantity < 1 ? 1 : quantity;

    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      subject: `AquaPulse order request - ${activePlan.name}`,
      message: [
        `Selected plan: ${activePlan.name}`,
        `Requested quantity: ${safeQuantity}`,
        `Installation address: ${formData.address || "Not provided"}`,
        "",
        "Customer notes:",
        formData.message || "No extra notes provided.",
      ].join("\n"),
    });
  };

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#071329_48%,#020617_100%)] pt-28 pb-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.32)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="mb-5 border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-cyan-200">
                AquaPulse AP-100 | Smart water protection
              </Badge>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-6xl">
                A customer-ready AquaPulse page built to help people order devices with confidence.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                AquaPulse watches water flow in real time, detects leaks early, and helps homes respond before small problems become expensive damage.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={scrollToOrder}>
                  Start an Order
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-400/40 text-cyan-100 hover:bg-cyan-400/10"
                  asChild
                >
                  <a href="#pricing">View Packages</a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-slate-200 hover:bg-white/5 hover:text-white"
                  asChild
                >
                  <Link href="/portfolio/aquapulse-smartwater">See Portfolio Case Study</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <a href="#features" className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 transition hover:border-cyan-400/50 hover:text-white">
                  Features
                </a>
                <a href="#how-it-works" className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 transition hover:border-cyan-400/50 hover:text-white">
                  How it works
                </a>
                <a href="#pricing" className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 transition hover:border-cyan-400/50 hover:text-white">
                  Pricing
                </a>
                <a href="#order" className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 transition hover:border-cyan-400/50 hover:text-white">
                  Order form
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <Card className="border-cyan-500/20 bg-slate-950/70">
                  <CardContent className="p-5">
                    <div className="text-2xl font-bold text-cyan-300">&lt; 1 sec</div>
                    <p className="mt-2 text-sm text-slate-400">Fast response once abnormal water flow is detected.</p>
                  </CardContent>
                </Card>
                <Card className="border-cyan-500/20 bg-slate-950/70">
                  <CardContent className="p-5">
                    <div className="text-2xl font-bold text-cyan-300">24/7</div>
                    <p className="mt-2 text-sm text-slate-400">Continuous monitoring for homes, rentals, and managed properties.</p>
                  </CardContent>
                </Card>
                <Card className="border-cyan-500/20 bg-slate-950/70">
                  <CardContent className="p-5">
                    <div className="text-2xl font-bold text-cyan-300">Mobile-first</div>
                    <p className="mt-2 text-sm text-slate-400">Customers can review alerts and water activity from their phone.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="overflow-hidden border-cyan-500/20 bg-slate-950/70 shadow-2xl shadow-cyan-950/40">
                <CardContent className="p-3">
                  <img
                    src="/showcase/AquaDevices.png"
                    alt="AquaPulse device dashboard preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="overflow-hidden border-slate-700 bg-slate-950/70">
                  <CardContent className="p-3">
                    <img
                      src="/showcase/AquaDashboard.png"
                      alt="AquaPulse dashboard"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-slate-700 bg-slate-950/70">
                  <CardContent className="p-3">
                    <img
                      src="/showcase/AquaMenu.png"
                      alt="AquaPulse mobile menu"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200">Why AquaPulse</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Everything a customer needs to understand before buying.</h2>
            <p className="mt-4 text-lg text-slate-400">
              This page packages the product story, trust signals, and order flow in one place so visitors can move from curiosity to action.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {highlightCards.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2 xl:grid-cols-3">
            {includedFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-300" />
                <span className="text-sm text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-slate-900/40 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">A simple buying story with a clear technical payoff.</h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <Card key={title} className="border-slate-800 bg-slate-950/70">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 rounded-[2rem] border border-cyan-500/20 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-8 shadow-2xl shadow-cyan-950/20 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <Badge className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200">AquaPulse App</Badge>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Mobile app launch coming soon.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-400">
                The AquaPulse mobile experience is being prepared for release. Once available, customers will be able to download the app from the App Store and Google Play to activate devices, monitor status, and manage alerts.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {appStoreBadges.map((store) => {
                const isReady = Boolean(store.href);

                return (
                  <a
                    key={store.id}
                    href={isReady ? store.href : undefined}
                    target={isReady ? "_blank" : undefined}
                    rel={isReady ? "noopener noreferrer" : undefined}
                    aria-disabled={!isReady}
                    className={`group block rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4 transition ${
                      isReady
                        ? "hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900"
                        : "cursor-default opacity-90"
                    }`}
                    onClick={(event) => {
                      if (!isReady) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <div className="rounded-2xl bg-black p-3">
                      <img
                        src={store.imageSrc}
                        alt={store.imageAlt}
                        className={`h-14 w-auto ${store.id === "google" ? "rounded-xl" : ""}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{store.name}</p>
                        <p className="text-xs text-slate-500">{store.status}</p>
                      </div>
                      <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                        {isReady ? "Live" : "Soon"}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-28 bg-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge className="border-amber-400/30 bg-amber-500/10 text-amber-200">Packages</Badge>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Choose the package that matches the customer's property.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-400">
              These packages are designed to make the page feel purchase-ready now, while still leaving room for final pricing updates later.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = plan.id === selectedPlan;

              return (
                <Card
                  key={plan.id}
                  className={`border-slate-800 bg-slate-900/70 transition hover:-translate-y-1 ${isSelected ? plan.accent : ""}`}
                >
                  <CardContent className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{plan.note}</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">{plan.name}</h3>
                      </div>
                      {isSelected ? (
                        <Badge className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200">Selected</Badge>
                      ) : null}
                    </div>

                    <div className="mt-6 text-4xl font-black text-white">{plan.price}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{plan.description}</p>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-300" />
                          <span className="text-sm text-slate-200">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="mt-8 w-full bg-white text-slate-950 hover:bg-slate-100"
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      Choose {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-28 bg-[linear-gradient(180deg,#08111f_0%,#020617_100%)] py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <Badge className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200">Order request</Badge>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Capture device orders with the package already selected.</h2>
              <p className="text-lg leading-8 text-slate-400">
                This form uses the existing contact workflow, so every request lands in the same inbox and backend process you already have.
              </p>

              <Card className="border-slate-800 bg-slate-900/70">
                <CardContent className="p-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Current selection</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Droplets className="h-6 w-6 text-cyan-300" />
                    <div>
                      <div className="text-xl font-semibold text-white">{activePlan.name}</div>
                      <div className="text-sm text-slate-400">{activePlan.price}</div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {activePlan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/70">
                  <CardContent className="p-5">
                    <Clock3 className="h-5 w-5 text-cyan-300" />
                    <p className="mt-3 text-sm text-slate-300">Fast follow-up on new order requests and quote discussions.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-900/70">
                  <CardContent className="p-5">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                    <p className="mt-3 text-sm text-slate-300">Strong positioning for leak prevention, cost savings, and peace of mind.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6 sm:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Customer full name"
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="customer@email.com"
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 7 00 00 00 00"
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white">
                        Company or property name
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-[0.55fr_1.45fr]">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-white">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">
                        Installation address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="City, property, or installation location"
                        className="border-slate-700 bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-cyan-300" />
                      <div>
                        <p className="font-medium text-white">Selected package</p>
                        <p className="text-sm text-slate-300">{activePlan.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      Notes
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Anything the customer wants to tell you about the property, expected installation, or timeline."
                      className="min-h-36 border-slate-700 bg-slate-950 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending order request..." : "Send AquaPulse Order Request"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Need a custom rollout? Use the Property Partner package or reach out through the{" "}
                    <Link href="/contact">
                      <a className="text-cyan-300 hover:text-cyan-200">contact page</a>
                    </Link>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AquaPulsePage;
