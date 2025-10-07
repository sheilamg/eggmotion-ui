import { Variants } from "framer-motion";

export const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3,
      },
    },
  };

export const glowItem: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: [0,1,0.85,1],
      textShadow: [
        "0 0 0px #B094FF",
        "0 0 6px #B094FF",
        "0 0 12px #B094FF",
        "0 0 8px #B094FF, 0 0 24px #C9AFFF",
      ],
      transition: {
        duration: 1.8,
        ease: "easeIn" 
    },
    },
  };