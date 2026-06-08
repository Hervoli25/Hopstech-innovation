import { FadeIn } from "@/components/animations/FadeIn";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { enterpriseServices } from "@/content/enterprise";

const ServicesSection = () => {
  return (
    <section id="services" className="border-y border-white/5 bg-slate-950 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseServices.title}
          </h2>
          <p className="text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseServices.intro}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enterpriseServices.items.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeIn key={service.title} delay={index * 0.08}>
                <Card className="h-full border-slate-800 bg-slate-900/50 text-white">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--hopstec-teal)]/30 bg-[var(--hopstec-teal)]/10">
                      <Icon className="h-5 w-5 text-[var(--hopstec-teal)]" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-gray-300 md:text-base">
                      {service.body}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
