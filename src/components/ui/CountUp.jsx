import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

export default function CountUp({ value, prefix = "Rp ", suffix = "" }) {
  const count = useMotionValue(0);
  
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return `${prefix}${num.toLocaleString('id-ID')}${suffix}`;
  });

  useEffect(() => {
    const animation = animate(count, value || 0, {
      duration: 1.5,
      ease: "easeOut"
    });
    
    return () => animation.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}