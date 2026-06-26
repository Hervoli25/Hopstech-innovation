import { Star } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { enterpriseTestimonials } from "@/content/enterprise";
import { trpc } from "@/lib/trpc";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = trpc.testimonials.getFeatured.useQuery();

  const items = testimonials?.slice(0, 3) ?? [];

  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="border-y border-white/5 bg-slate-900/30 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseTestimonials.title}
          </h2>
          <p className="text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseTestimonials.intro}
          </p>
        </FadeIn>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading testimonials...</p>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <FadeIn key={testimonial.id} delay={index * 0.08}>
                <Card className="h-full border-slate-800 bg-slate-900/50 text-white">
                  <CardHeader>
                    <div className="mb-2 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[var(--hopstec-teal)] text-[var(--hopstec-teal)]"
                        />
                      ))}
                    </div>
                    <CardTitle className="text-lg text-white">{testimonial.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm italic leading-6 text-gray-300">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
