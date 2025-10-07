import { motion } from "framer-motion";
import TodayButton from "../button/TodayButton";
import { container, glowItem } from "./textRevealHomeAnimation";
import styles from "./TextRevealHome.module.css";

const text = ["¿","Cómo", "me", "siento", "hoy", "?"];

const TextRevealHome = ({isMenuOpen, setIsMenuOpen, setSelection, onComplete}) => {
  
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className={styles.title}
      onAnimationComplete={onComplete}
    >
      {text.map((word, i) => (
        <motion.span 
         key={i} 
         variants={glowItem}
         className={styles.text}
         >
          {word === "hoy" ? <motion.span className={styles.buttonWrapper}><TodayButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setSelection={setSelection}/></motion.span> : word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default TextRevealHome;