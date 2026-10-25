
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ContactCta() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section
      id="contact-cta"
      className="bg-white px-6 py-20 text-neutral-950 dark:bg-neutral-950 dark:text-white"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            staggerChildren: reduceMotion ? 0 : 0.12,
          }}
          className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 px-7 py-16 sm:px-12 md:px-16 md:py-20 dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* Decorative outlines */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-neutral-200 transition-transform duration-700 group-hover:scale-110 dark:border-neutral-800" />
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-neutral-200 dark:border-neutral-800" />

          {/* Subtle blue accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />

          <div className="relative z-10 max-w-3xl">
            <motion.div
              variants={reveal}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                Have a project in mind?
              </p>
            </motion.div>

            <motion.h2
              variants={reveal}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl"
            >
              Let's build something
              <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
                remarkable together.
              </span>
            </motion.h2>

            <motion.p
              variants={reveal}
              transition={{ duration: 0.6 }}
              className="mt-6 max-w-xl text-base leading-7 text-neutral-500 dark:text-neutral-400"
            >
              Have an idea, a project, or something exciting in mind?
              Let's turn it into a digital experience worth remembering.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 0.6 }}
              className="mt-9"
            >
              <Link
                to="/contact"
                className="group/button inline-flex items-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/15 dark:bg-white dark:text-neutral-950 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                Start a Conversation

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
                />
              </Link>
            </motion.div>
          </div>
            </motion.div>
      </div>
    </section>
  );
}
