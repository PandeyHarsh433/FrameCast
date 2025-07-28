
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      className="w-full py-8 md:py-16 px-4 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-tight"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
      >
        FrameCast
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Curated collection of visually stunning and unique animations
      </motion.p>
    </motion.header>
  );
};

export default Header;
