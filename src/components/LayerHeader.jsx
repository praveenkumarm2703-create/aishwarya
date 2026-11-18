import { motion } from 'framer-motion';

export default function LayerHeader({ number, label, title, subtitle }) {
  return (
    <header className="layer-header">
      <motion.span
        className="chip"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Layer {number} · {label}
      </motion.span>
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
