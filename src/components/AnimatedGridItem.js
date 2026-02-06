'use client';

import { motion } from 'framer-motion';

export default function AnimatedGridItem({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.21, 0.45, 0.32, 0.9] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
