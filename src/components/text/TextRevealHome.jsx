import { motion } from "framer-motion";
import TodayButton from "../button/TodayButton";
import { container, glowItem } from "./textRevealHomeAnimation";
import styles from "./TextRevealHome.module.css";

const text = ["¿","Cómo", "me", "siento", "hoy", "?"];

const TextRevealHome = () => {
  
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      //className="flex gap-2 text-4xl text-neonPink font-light"
      className={styles.title}
    >
      {text.map((word, i) => (
        <motion.span 
         key={i} 
         variants={glowItem}
         className={styles.text}
         >
          {word === "hoy" ? <motion.span className={styles.buttonWrapper}><TodayButton /></motion.span> : word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default TextRevealHome;