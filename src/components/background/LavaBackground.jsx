import { motion } from "framer-motion";
import styles from "./LavaBackground.module.css";

const LavaBackground = () => {
  const animationProps = {
    animate: {
      x: ["0%", "80%", "0%"],
      y: ["0%", "20%", "0%"],
    },
    transition: {
      duration: 30,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.ball1}
        {...animationProps}
        transition={{ ...animationProps.transition, duration: 35 }}
      />
      <motion.div
        className={styles.ball2}
        {...animationProps}
        transition={{ ...animationProps.transition, duration: 45 }}
      />
    </div>
  );
};

export default LavaBackground;
