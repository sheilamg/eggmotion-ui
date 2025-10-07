import { motion } from "framer-motion";
import styles from "./LavaBackground.module.css";

const LavaBackground = () => {
    const floatAnimation = {
        x: ["0%", "20%", "-15%", "0%"],
        y: ["0%", "-10%", "15%", "0%"],
        scale: [1, 1.05, 0.95, 1],
        rotate: [0, 2, -2, 0], // ligera rotación para más naturalidad
        transition: {
          duration: 40,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        },
      };
    
      const colorAnimation = {
        background: [
          "radial-gradient(circle, rgba(201,175,255,0.6) 0%, rgba(201,175,255,0) 70%)",
          "radial-gradient(circle, rgba(255,150,255,0.5) 0%, rgba(201,175,255,0) 70%)",
          "radial-gradient(circle, rgba(201,175,255,0.6) 0%, rgba(255,200,255,0) 70%)",
        ],
        transition: {
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      };
    
      const colorAnimation2 = {
        background: [
          "radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(0,255,255,0) 70%)",
          "radial-gradient(circle, rgba(0,200,255,0.4) 0%, rgba(0,255,255,0) 70%)",
          "radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(150,255,255,0) 70%)",
        ],
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
            animate={{ ...floatAnimation, ...colorAnimation }}
          />
          <motion.div
            className={styles.ball2}
            animate={{ ...floatAnimation, ...colorAnimation2 }}
            transition={{ ...floatAnimation.transition, duration: 50 }}
          />
        </div>
      );
};

export default LavaBackground;
