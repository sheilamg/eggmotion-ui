import { Variants } from "framer-motion";
export const container: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px #B094FF, 0 0 30px #C9AFFF",
      textShadow: "0 0 12px #C9AFFF, 0 0 24px #B094FF",
      transition: { duration: 0.4 },
    },
}