import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Lock,
  MessageSquare,
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { enterpriseClientVisibility } from "@/content/enterprise";

const featureIcons = [Lock, BarChart3, MessageSquare, FileText];

const ClientVisibilitySection = () => {
  return (
    <section id="client-portal" className="bg-slate-900/50 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
          <Badge className="mb-4 border-[var(--hopstec-teal)]/30 bg-[var(--hopstec-teal)]/10 text-[var(--hopstec-teal)]">
            {enterpriseClientVisibility.badge}
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseClientVisibility.title}
          </h2>
          <p className="text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseClientVisibility.intro}
          </p>
        </FadeIn>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <FadeIn delay={0.2}>
            <Card className="overflow-hidden border-[var(--hopstec-teal)]/20 bg-gradient-to-br from-[var(--hopstec-teal)]/10 to-blue-600/10">
              <CardContent className="p-8">
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.png"
                        alt="Hopstec Innovation"
                        className="h-10 w-10 rounded-full ring-2 ring-[var(--hopstec-teal)]/40"
                      />
                      <div>
                        <p className="font-medium text-white">Client Dashboard</p>
                        <p className="text-xs text-gray-400">portal.hopstecinnovation.com</p>
                      </div>
                    </div>
                    <Badge className="border-[var(--hopstec-teal)]/30 bg-[var(--hopstec-teal)]/10 text-[var(--hopstec-teal)]">
                      Active
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded bg-slate-800 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          Platform Development
                        </p>
                        <span className="text-xs text-[var(--hopstec-teal)]">68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-700">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "68%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-2 rounded-full bg-[var(--hopstec-teal)]"
                        />
                      </div>
                    </div>

                    <div className="rounded bg-slate-800 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          Integration Phase
                        </p>
                        <span className="text-xs text-blue-400">42%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-700">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "42%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-2 rounded-full bg-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 rounded bg-slate-800 p-3 text-center">
                        <p className="text-2xl font-bold text-[var(--hopstec-teal)]">3</p>
                        <p className="text-xs text-gray-400">Open milestones</p>
                      </div>
                      <div className="flex-1 rounded bg-slate-800 p-3 text-center">
                        <p className="text-2xl font-bold text-blue-400">12</p>
                        <p className="text-xs text-gray-400">Activity updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4} className="space-y-6">
            {enterpriseClientVisibility.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="rounded-lg border border-[var(--hopstec-teal)]/30 bg-[var(--hopstec-teal)]/10 p-3">
                    <Icon className="h-6 w-6 text-[var(--hopstec-teal)]" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}

            <Link href="/client-portal">
              <Button
                size="lg"
                className="mt-4 w-full bg-[var(--hopstec-teal)] text-slate-950 hover:bg-[var(--hopstec-teal)]/90"
              >
                {enterpriseClientVisibility.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ClientVisibilitySection;
