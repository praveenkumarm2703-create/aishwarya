import { motion } from 'framer-motion';
import { vibrate } from '../lib/effects.js';

/** Primary glowing pill button with hover / tap animation. */
export default function GlowButton({ children, onClick, variant = 'primary', className = '', icon, disabled, ...rest }) {
  return (
    <motion.button
      type="button"
      className={`btn btn--${variant} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      onClick={(e) => {
        if (disabled) return;
        vibrate(12);
        onClick?.(e);
      }}
      disabled={disabled}
      {...rest}
    >
      <span className="btn__label">{children}</span>
      {icon && <span className="btn__icon">{icon}</span>}
    </motion.button>
  );
}
