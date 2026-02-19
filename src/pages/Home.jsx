import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="page">

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ✨ Fake Job Detection System
        </motion.h2>

        <textarea placeholder="Paste job description here..." />

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Analyze Job
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ✅ Genuine Job
        </motion.p>

      </motion.div>

    </div>
  );
}
