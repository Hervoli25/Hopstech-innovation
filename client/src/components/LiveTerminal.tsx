import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { FadeIn } from './animations/FadeIn';
import { Terminal, Sparkles } from 'lucide-react';

interface TerminalLine {
  type: 'command' | 'output' | 'ai-suggestion' | 'success' | 'error';
  content: string;
  delay?: number;
}

const demoScript: TerminalLine[] = [
  { type: 'command', content: '$ npm run build', delay: 0 },
  { type: 'output', content: '> Building production bundle...', delay: 800 },
  { type: 'output', content: '✓ TypeScript compilation successful', delay: 1200 },
  { type: 'output', content: '✓ Vite build complete', delay: 1600 },
  { type: 'success', content: '✨ Build completed in 2.3s', delay: 2000 },
  { type: 'command', content: '$ npm test', delay: 3000 },
  { type: 'output', content: 'Running test suites...', delay: 3500 },
  { type: 'ai-suggestion', content: '💡 AI: Consider adding integration tests for the new API endpoints', delay: 4000 },
  { type: 'output', content: 'PASS  src/components/Button.test.tsx', delay: 4500 },
  { type: 'output', content: 'PASS  src/utils/validation.test.ts', delay: 5000 },
  { type: 'success', content: '✓ All tests passed (25/25)', delay: 5500 },
  { type: 'command', content: '$ git commit -m "feat: Add new feature"', delay: 6500 },
  { type: 'ai-suggestion', content: '💡 AI: Commit message follows conventional commits ✓', delay: 7000 },
  { type: 'success', content: '[main abc123d] feat: Add new feature', delay: 7500 },
  { type: 'command', content: '$ npm run deploy', delay: 8500 },
  { type: 'output', content: 'Deploying to production...', delay: 9000 },
  { type: 'success', content: '🚀 Deployed successfully to https://hopstech.dev', delay: 9800 },
];

export function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= demoScript.length) {
      // Reset after completion
      const resetTimer = setTimeout(() => {
        setVisibleLines([]);
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = demoScript[currentIndex];
    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, currentLine]);
      setCurrentIndex((prev) => prev + 1);
    }, currentLine.delay || 0);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'output':
        return 'text-gray-300';
      case 'ai-suggestion':
        return 'text-purple-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="h-8 w-8 text-blue-400" />
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI-Powered Development Workflow
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch how AI assists in real-time during development, testing, and deployment
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="max-w-4xl mx-auto">
          <Card className="bg-slate-900 border-slate-700 overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm text-gray-400 ml-4">terminal — bash</span>
            </div>

            {/* Terminal Content */}
            <CardContent className="p-0">
              <div
                ref={terminalRef}
                className="h-[500px] overflow-y-auto p-6 font-mono text-sm bg-slate-950"
                style={{ scrollBehavior: 'smooth' }}
              >
                {visibleLines.map((line, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${getLineColor(line.type)} animate-in fade-in slide-in-from-left-2 duration-300`}
                  >
                    {line.type === 'ai-suggestion' && (
                      <span className="inline-block bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1 mb-1">
                        {line.content}
                      </span>
                    )}
                    {line.type !== 'ai-suggestion' && line.content}
                  </div>
                ))}
                {currentIndex < demoScript.length && (
                  <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse"></span>
                )}
              </div>
            </CardContent>

            {/* Terminal Footer */}
            <div className="bg-slate-800 border-t border-slate-700 px-4 py-2">
              <p className="text-xs text-gray-400 text-center">
                ⚡ Real-time AI suggestions • Automated testing • Continuous deployment
              </p>
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

