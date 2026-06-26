import { FadeIn } from "@/components/animations/FadeIn";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
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
                  {"static" in metric && metric.static ? (
                    metric.value
                  ) : (
                    <AnimatedCounter
                      end={metric.value as number}
                      suffix={"suffix" in metric ? metric.suffix : ""}
                      duration={1.8}
                    />
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-400 md:text-base">{metric.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default MetricsStrip;
