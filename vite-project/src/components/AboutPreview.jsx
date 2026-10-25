
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function AboutPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about-preview"
      className="border-t border-neutral-200 bg-neutral-50 px-6 py-20 text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-blue-600">
            Introduction / 03
          </p>

          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Beyond the <span className="text-blue-600">Code.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300 md:text-xl">
            I'm Ali Zain, a Full-Stack Web Developer who enjoys
            transforming ideas into modern, interactive and
            thoughtfully designed websites.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
            My focus is on creating responsive interfaces,
            smooth user experiences and functional web applications.
          </p>

          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-3 border-b border-neutral-900 pb-2 text-sm font-semibold transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-white dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            More About Me
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
