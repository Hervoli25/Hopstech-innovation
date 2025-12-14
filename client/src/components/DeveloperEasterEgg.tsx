import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Terminal, Coffee, Code2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeveloperEasterEgg() {
  const [isActivated, setIsActivated] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === konamiCode[konamiIndex].toLowerCase()) {
        setKonamiIndex(konamiIndex + 1);
        
        if (konamiIndex + 1 === konamiCode.length) {
          setIsActivated(true);
          setKonamiIndex(0);
          
          // Auto-hide after 10 seconds
          setTimeout(() => setIsActivated(false), 10000);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  const devStats = [
    { icon: <Coffee className="h-5 w-5" />, label: 'Coffee Consumed', value: '∞', color: 'text-amber-400' },
    { icon: <Code2 className="h-5 w-5" />, label: 'Lines of Code', value: '100K+', color: 'text-blue-400' },
    { icon: <Terminal className="h-5 w-5" />, label: 'Terminal Sessions', value: '9999', color: 'text-green-400' },
    { icon: <Zap className="h-5 w-5" />, label: 'Bugs Squashed', value: '404', color: 'text-purple-400' },
  ];

  const devQuotes = [
    "// TODO: Remove this before production",
    "It works on my machine ¯\\_(ツ)_/¯",
    "99 little bugs in the code...",
    "Powered by caffeine and Stack Overflow",
    "console.log('Hello, fellow developer!')",
  ];

  return (
    <AnimatePresence>
      {isActivated && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 max-w-md"
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Terminal className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Developer Mode Activated!</h3>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                    Konami Code Detected
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {devStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 rounded-lg p-3 text-center"
                  >
                    <div className={`${stat.color} mb-1 flex justify-center`}>
                      {stat.icon}
                    </div>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <pre className="text-xs text-green-400 font-mono">
                  {devQuotes[Math.floor(Math.random() * devQuotes.length)]}
                </pre>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400 italic">
                  "Thanks for checking out the code! 🚀"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This message will self-destruct in 10 seconds...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

