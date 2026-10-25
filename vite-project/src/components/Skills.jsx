
import { motion, useReducedMotion } from "motion/react";
import { FaCss3Alt } from "react-icons/fa";
import {
  SiHtml5,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

const skills = [
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
{ name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", icon: SiExpress, color: "#777777" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
];

export default function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-white px-6 py-24 text-neutral-950 dark:bg-neutral-950 dark:text-white"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-blue-600">
            Expertise / 02
          </p>

          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            My Skills<span className="text-blue-600">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-neutral-500 dark:text-neutral-400">
            Technologies and tools I use to build modern digital experiences.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.09,
              },
            },
          }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {skills.map((skill) => {
            const Icon = skill.icon;

            return (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 35, scale: 0.94 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -7, scale: 1.025 }
                }
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-7 transition-colors duration-300 hover:border-blue-500/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900"
              >
                {/* Subtle spotlight */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/0 blur-3xl transition-colors duration-500 group-hover:bg-blue-500/10" />

                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { rotate: -8, scale: 1.12 }
                  }
                  transition={{ type: "spring", stiffness: 260 }}
                  className="relative mb-8 inline-flex"
                >
                  <Icon
                    size={43}
                    style={{ color: skill.color }}
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="relative flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold sm:text-base">
                    {skill.name}
                  </h3>
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-colors duration-300 group-hover:bg-blue-600 dark:bg-neutral-700" />
                </div>

                <div className="mt-5 h-px w-full bg-neutral-200 dark:bg-neutral-800">
                  <div className="h-px w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
