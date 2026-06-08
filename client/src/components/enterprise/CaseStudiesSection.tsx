import { ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { enterpriseCaseStudies } from "@/content/enterprise";

const CaseStudiesSection = () => {
  return (
    <section id="case-studies" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseCaseStudies.title}
          </h2>
          <p className="text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseCaseStudies.intro}
          </p>
        </FadeIn>

        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {enterpriseCaseStudies.items.map((study, index) => (
            <FadeIn key={study.id} delay={index * 0.08}>
              <Card
                className={
                  study.isGuardian
                    ? "border-slate-700 bg-slate-900/80 text-white"
                    : "border-slate-800 bg-slate-900/50 text-white"
                }
              >
                <CardHeader>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-[var(--hopstec-teal)]/40 text-[var(--hopstec-teal)]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl text-white">
                    {study.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    Tech Stack: {study.techStack}
                    {study.deployment ? ` · ${study.deployment}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base leading-7 text-gray-300">
                    {study.summary}
                  </p>

                  {study.url && (
                    <a
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--hopstec-teal)] transition-colors hover:text-[var(--hopstec-teal)]/80"
                    >
                      Visit project
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value={`details-${study.id}`}
                      className="border-slate-700"
                    >
                      <AccordionTrigger className="text-[var(--hopstec-teal)] hover:no-underline">
                        Read more
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-5 pt-2">
                          {study.details.map((detail) => (
                            <div key={detail.heading}>
                              <h4 className="mb-2 font-semibold text-white">
                                {detail.heading}
                              </h4>
                              <p className="text-sm leading-6 text-gray-300 md:text-base">
                                {detail.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
