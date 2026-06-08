import { FadeIn } from "@/components/animations/FadeIn";
import { enterpriseAbout } from "@/content/enterprise";

const AboutSection = () => {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_55%,transparent_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />

      <div className="container relative z-10 mx-auto px-4">
        <FadeIn className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
            {enterpriseAbout.title}
          </h2>
          <div className="space-y-6 text-base leading-7 text-gray-300 md:text-lg md:leading-8">
            {enterpriseAbout.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
