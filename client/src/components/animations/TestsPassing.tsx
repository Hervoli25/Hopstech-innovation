import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Test {
  name: string;
  duration: string;
}

const tests: Test[] = [
  { name: 'Authentication flow', duration: '245ms' },
  { name: 'API endpoints', duration: '189ms' },
  { name: 'Database queries', duration: '312ms' },
  { name: 'UI components', duration: '156ms' },
  { name: 'Integration tests', duration: '428ms' },
];

export function TestsPassing() {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={ref}
      className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4 text-green-400">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-semibold">Test Suites: 5 passed, 5 total</span>
      </div>

      <div className="space-y-2">
        {tests.map((test, index) => (
          <motion.div
            key={test.name}
            initial={{ opacity: 0, x: -20 }}
            animate={
              isIntersecting
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -20 }
            }
            transition={{
              delay: index * 0.15,
              duration: 0.3,
            }}
            className="flex items-center gap-2 text-gray-300"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isIntersecting ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: index * 0.15 + 0.2,
                type: 'spring',
                stiffness: 500,
                damping: 15,
              }}
            >
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </motion.div>
            <span className="text-gray-400">✓</span>
            <span>{test.name}</span>
            <span className="text-gray-500 ml-auto">{test.duration}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isIntersecting ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: tests.length * 0.15 + 0.3 }}
        className="mt-4 pt-4 border-t border-slate-700 text-gray-400"
      >
        <div className="flex justify-between">
          <span>Tests: <span className="text-green-400">25 passed</span>, 25 total</span>
          <span>Time: 1.33s</span>
        </div>
      </motion.div>
    </div>
  );
}

