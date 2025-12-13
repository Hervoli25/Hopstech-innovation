import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export function ScrollProgress() {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
      style={{
        scaleX: scrollProgress / 100,
      }}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.1 }}
    />
  );
}

