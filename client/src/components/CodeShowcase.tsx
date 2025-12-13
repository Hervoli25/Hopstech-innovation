import { FadeIn } from './animations/FadeIn';
import { CodeBlock } from './CodeBlock';
import { TypewriterCode } from './animations/TypewriterCode';
import { TestsPassing } from './animations/TestsPassing';

const dockerCode = `# Multi-stage Docker build for optimized production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]`;

const cicdCode = `name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: ./deploy.sh`;

export function CodeShowcase() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Code That Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Clean, efficient, and production-ready code with comprehensive testing
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <FadeIn delay={0.2} direction="left">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                🐳 Optimized Docker Builds
              </h3>
              <CodeBlock
                code={dockerCode}
                language="dockerfile"
                title="Dockerfile"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.4} direction="right">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                🚀 CI/CD Automation
              </h3>
              <TypewriterCode
                code={cicdCode}
                language="yaml"
                speed={20}
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6} className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            ✅ Comprehensive Testing
          </h3>
          <TestsPassing />
        </FadeIn>
      </div>
    </section>
  );
}

