import { ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enterpriseProducts } from "@/content/enterprise";

const ProductsSpotlightSection = () => {
  return (
    <section id="products" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {enterpriseProducts.title}
          </h2>
          <p className="text-base leading-7 text-gray-300 md:text-lg">
            {enterpriseProducts.intro}
          </p>
        </FadeIn>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {enterpriseProducts.items.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.08}>
              <Card className="h-full border-slate-800 bg-slate-900/50 text-white transition-colors hover:border-[var(--hopstec-teal)]/30">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="mb-3 w-fit border-[var(--hopstec-teal)]/40 text-[var(--hopstec-teal)]"
                  >
                    {product.status}
                  </Badge>
                  <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-400">{product.tagline}</p>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--hopstec-teal)] transition-colors hover:text-[var(--hopstec-teal)]/80"
                  >
                    View product
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSpotlightSection;
