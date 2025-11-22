import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface AnimatedRouteProps {
  children: ReactNode;
}

// Define the order of routes for determining animation direction
const routeOrder = ["/", "/leaderboard", "/benchmarks", "/pricing"];

const getRouteIndex = (path: string): number => {
  const index = routeOrder.findIndex((route) => route === path);
  return index === -1 ? 0 : index;
};

const AnimatedRoute = ({ children }: AnimatedRouteProps) => {
  const location = useLocation();

  // Get current and previous route indices
  const currentIndex = getRouteIndex(location.pathname);

  // Determine direction based on route order
  const getDirection = () => {
    const prevIndex = Number(sessionStorage.getItem("prevRouteIndex")) || 0;
    sessionStorage.setItem("prevRouteIndex", String(currentIndex));

    return currentIndex > prevIndex ? 1 : -1; // 1 for forward, -1 for backward
  };

  const direction = getDirection();

  const variants = {
    initial: {
      opacity: 0,
      x: direction > 0 ? 50 : -50,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: direction > 0 ? -50 : 50,
      scale: 0.98,
    },
  };

  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "tween",
        ease: [0.4, 0.0, 0.2, 1],
        duration: 0.35,
      }}
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100vh",
        top: 0,
        left: 0,
      }}
      className="bg-background"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
