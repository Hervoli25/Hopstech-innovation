import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { enterpriseCta } from "@/content/enterprise";

const CtaBandSection = () => {
  return (
    <section className="border-t border-white/5 bg-[var(--hopstec-footer-bg)] py-20">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseCta.title}
          </h2>
          <p className="mb-8 text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseCta.intro}
          </p>
          <Link href={enterpriseCta.href}>
            <Button
              size="lg"
              className="bg-[var(--hopstec-teal)] text-slate-950 hover:bg-[var(--hopstec-teal)]/90"
            >
              {enterpriseCta.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};

export default CtaBandSection;
