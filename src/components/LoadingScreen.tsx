
import { motion } from 'framer-motion';
import { CameraIcon } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear"
          }}
          className="relative flex items-center justify-center"
        >
          <CameraIcon size={64} className="text-primary" />
        </motion.div>

        {/* Add pulsating circles for more visual interest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 2]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            repeatType: "loop"
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          style={{ left: -10, top: -10, right: -10, bottom: -10 }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold font-display mb-2">FrameCast</h1>
        <p className="text-xl text-muted-foreground">Loading your visual experience...</p>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          delay: 0.6,
          duration: 2,
          ease: "easeInOut"
        }}
        className="w-48 h-1 bg-primary mt-8 origin-left"
      />

      {/* Add shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['100%', '-100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
        style={{ width: '200%' }}
      />
    </div>
  );
};

export default LoadingScreen;
