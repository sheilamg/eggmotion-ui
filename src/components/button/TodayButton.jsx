import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { container } from "./todayButtonAnimation";

const TodayButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setOpen(!open)}
        className="px-4 py-1 bg-transparent border-2 border-pink-400 rounded-full text-pink-300 
        hover:shadow-[0_0_10px_#ff85c0] transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        variants={container}
      >
        Hoy
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 bg-[#111] border border-pink-400
            rounded-2xl p-3 shadow-[0_0_15px_#ff85c0] flex flex-col gap-2"
          >
            <button className="text-pink-200 hover:text-pink-100">
              Otro Día
            </button>
            <button className="text-pink-200 hover:text-pink-100">
              Mañana
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodayButton;