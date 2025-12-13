import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ComponentProps } from 'react';

export function AnimatedButton({ children, ...props }: ComponentProps<typeof Button>) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
}

