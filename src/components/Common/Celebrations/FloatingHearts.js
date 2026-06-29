import { motion } from "framer-motion";

const hearts = Array.from({ length: 10 });

const FloatingHearts = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {hearts.map((_, i) => {
        const size = Math.random() * 50 + 50;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 12;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "-20%", opacity: [0, 1, 0.6] }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${left}%`,
              fontSize: size,
              color: "rgba(255, 120, 150, 0.4)",
            }}
          >
            ❤️
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingHearts;
