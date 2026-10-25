import { profile } from "../data/profile";

import { motion, useReducedMotion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const reduceMotion = useReducedMotion();

  // Replace with your WhatsApp number (country code + number)
  // Example format: 923001234567
const phoneNumber = profile.whatsapp.replace(/\D/g, "");

  const message =
    "Hi Ali Zain! I came across your portfolio and would like to discuss a project.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Avoid opening an invalid WhatsApp link before configuration
  if (phoneNumber === "YOUR_WHATSAPP_NUMBER") {
    return null;
  }

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, scale: 0.7, y: 20 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: reduceMotion ? 0 : 2.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
    >
      {/* Hover Tooltip */}
      <span
        className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-900 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 md:block dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
      >
        Let's chat on WhatsApp
      </span>

      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ali Zain on WhatsApp"
        title="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-500"
      >
        <FaWhatsapp size={29} />
      </a>
    </motion.div>
  );
}
