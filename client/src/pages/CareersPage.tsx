import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { enterpriseCareers, enterpriseFooter } from "@/content/enterprise";

const CareersPage = () => {
  return (
    <PageLayout>
      <section className="bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 border-[var(--hopstec-teal)] text-[var(--hopstec-teal)]"
            >
              {enterpriseCareers.title}
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-[var(--hopstec-teal)] via-cyan-300 to-blue-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
              {enterpriseCareers.headline}
            </h1>
            <p className="text-lg leading-7 text-gray-300 md:text-xl">
              {enterpriseCareers.intro}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4 text-[var(--hopstec-teal)]" />
              {enterpriseFooter.address}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {enterpriseCareers.pathsTitle}
            </h2>
            <p className="text-base leading-7 text-gray-300 md:text-lg">
              {enterpriseCareers.pathsIntro}
            </p>
          </FadeIn>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {enterpriseCareers.paths.map((path, index) => (
              <FadeIn key={path.title} delay={index * 0.08}>
                <Card className="h-full border-slate-800 bg-slate-900/50 text-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-gray-300 md:text-base">
                      {path.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-slate-900/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {enterpriseCareers.openRolesTitle}
            </h2>
            <p className="mb-6 text-base leading-7 text-gray-300 md:text-lg">
              {enterpriseCareers.openRolesIntro}
            </p>
            <Card className="border-slate-800 bg-slate-900/50 text-left">
              <CardHeader>
                <CardDescription className="text-gray-400">
                  {enterpriseCareers.openRolesNote}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{enterpriseCareers.ctaHint}</p>
                <Link href={enterpriseCareers.ctaHref}>
                  <Button className="bg-[var(--hopstec-teal)] text-slate-950 hover:bg-[var(--hopstec-teal)]/90">
                    {enterpriseCareers.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default CareersPage;
