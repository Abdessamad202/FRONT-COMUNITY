import { Outlet } from "react-router"; // React Router hooks for dynamic routing
import { motion } from "framer-motion";
const RegisterLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
        initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and slightly down
        animate={{ opacity: 1, y: 0 }}   // Animate to opacity 1 and original position
        transition={{ duration: 0.6 }}    // Set the duration of the animation
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default RegisterLayout;
