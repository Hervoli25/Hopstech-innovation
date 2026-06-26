import { FadeIn } from "@/components/animations/FadeIn";
import { enterpriseTrustedBy } from "@/content/enterprise";

const LogoStrip = () => {
  return (
    <section className="border-b border-white/5 bg-slate-950 py-10">
      <div className="container mx-auto px-4">
        <FadeIn>
          <p className="mb-6 text-center text-xs uppercase tracking-[0.24em] text-gray-500">
            {enterpriseTrustedBy.title}
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {enterpriseTrustedBy.clients.map((client) => (
              <div
                key={client.label}
                className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-5 text-center transition-colors hover:border-[var(--hopstec-teal)]/30 hover:bg-slate-900/70"
              >
                <p className="text-sm font-medium text-gray-200">{client.label}</p>
                <p className="mt-1 text-xs text-[var(--hopstec-teal)]/80">{client.sector}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default LogoStrip;
