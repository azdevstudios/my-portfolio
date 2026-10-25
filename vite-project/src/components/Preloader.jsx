
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(
      () => setVisible(false),
      reduceMotion ? 0 : 650
    );

    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0 : 0.55 },
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white"
        >
          <div className="flex flex-col items-center">
            {/* AZ Logo */}
            <motion.h1
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 20, filter: "blur(8px)" }
              }
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-6xl font-bold tracking-[-0.08em] sm:text-7xl"
            >
              AZ<span className="text-blue-600">.</span>
            </motion.h1>

            {/* Loading Line */}
            <div className="mt-8 h-0.5 w-28 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "left" }}
                className="h-full w-full bg-blue-600"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.5 }}
              className="mt-5 text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-400"
            >
              Full-Stack Developer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
