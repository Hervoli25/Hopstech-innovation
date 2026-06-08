import { FadeIn } from "@/components/animations/FadeIn";
import { enterpriseMetrics } from "@/content/enterprise";

const MetricsStrip = () => {
  return (
    <section className="border-y border-white/5 bg-[var(--hopstec-footer-bg)] py-10">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {enterpriseMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-3xl font-bold text-[var(--hopstec-teal)] md:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-gray-400 md:text-base">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default MetricsStrip;
