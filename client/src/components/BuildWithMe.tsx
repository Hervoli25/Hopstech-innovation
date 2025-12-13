import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FadeIn } from './animations/FadeIn';
import { ChevronLeft, ChevronRight, Code, Rocket, CheckCircle2, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BuildStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  code?: string;
  preview?: string;
  tags: string[];
}

const buildSteps: BuildStep[] = [
  {
    id: 1,
    title: 'Project Planning',
    description: 'Define requirements, choose tech stack, and plan architecture',
    icon: <Wrench className="h-8 w-8" />,
    tags: ['Requirements', 'Architecture', 'Tech Stack'],
    preview: '📋 Requirements gathering\n🏗️ System design\n⚙️ Technology selection',
  },
  {
    id: 2,
    title: 'Database Schema',
    description: 'Design and implement database structure with Drizzle ORM',
    icon: <Code className="h-8 w-8" />,
    tags: ['PostgreSQL', 'Drizzle ORM', 'TypeScript'],
    code: `export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('client'),
  createdAt: timestamp('created_at').defaultNow(),
});`,
  },
  {
    id: 3,
    title: 'API Development',
    description: 'Build RESTful APIs with tRPC for type-safe communication',
    icon: <Code className="h-8 w-8" />,
    tags: ['tRPC', 'Express', 'Type Safety'],
    code: `export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(users);
  }),
  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return await db.insert(users).values(input);
    }),
});`,
  },
  {
    id: 4,
    title: 'Frontend Components',
    description: 'Create reusable React components with Tailwind CSS',
    icon: <Code className="h-8 w-8" />,
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    code: `export function UserCard({ user }: { user: User }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <Badge>{user.role}</Badge>
      </CardContent>
    </Card>
  );
}`,
  },
  {
    id: 5,
    title: 'Testing & QA',
    description: 'Write comprehensive tests and ensure code quality',
    icon: <CheckCircle2 className="h-8 w-8" />,
    tags: ['Vitest', 'Testing', 'Quality Assurance'],
    code: `describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = { name: 'John', email: 'john@example.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});`,
  },
  {
    id: 6,
    title: 'Deployment',
    description: 'Deploy to production with CI/CD pipeline',
    icon: <Rocket className="h-8 w-8" />,
    tags: ['Docker', 'GitHub Actions', 'Production'],
    preview: '🐳 Docker containerization\n🚀 Automated deployment\n✅ Health checks\n📊 Monitoring',
  },
];

export function BuildWithMe() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = buildSteps[currentStep];

  const nextStep = () => {
    if (currentStep < buildSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Build with Me: Step-by-Step
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow along as I walk you through building a full-stack application from scratch
          </p>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {buildSteps.map((s, index) => (
                <div
                  key={s.id}
                  className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">
              Step {currentStep + 1} of {buildSteps.length}
            </p>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {step.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-500/10 text-blue-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {step.code && (
                    <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-300 font-mono">{step.code}</pre>
                    </div>
                  )}

                  {step.preview && (
                    <div className="bg-slate-950 rounded-lg p-6">
                      <pre className="text-gray-300 whitespace-pre-line">{step.preview}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === buildSteps.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

