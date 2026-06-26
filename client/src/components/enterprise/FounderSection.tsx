import { Linkedin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { enterpriseFounder } from "@/content/enterprise";

const FounderSection = () => {
  return (
    <section id="founder" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto max-w-3xl">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--hopstec-teal)]/20 to-blue-600/20 ring-2 ring-[var(--hopstec-teal)]/40">
                <BrandLogo size="lg" showRing={false} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--hopstec-teal)]">
                  Leadership
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">{enterpriseFounder.name}</h2>
                <p className="mt-1 text-sm text-[var(--hopstec-teal)]">{enterpriseFounder.role}</p>
                <p className="mt-4 text-base leading-7 text-gray-300">{enterpriseFounder.bio}</p>
                <a
                  href={enterpriseFounder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[var(--hopstec-teal)]"
                >
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
};

export default FounderSection;
