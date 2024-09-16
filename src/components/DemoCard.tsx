import { motion } from "framer-motion";

interface DemoCardProps {
  title: React.ReactNode;
  gradientClasses: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const DemoCard: React.FC<DemoCardProps> = ({
  title,
  gradientClasses,
  children,
  icon,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-gray-800 bg-opacity-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
  >
    <div className={`bg-gradient-to-r ${gradientClasses} p-6`}>
      <h2 className="text-2xl font-bold text-white flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </h2>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

export default DemoCard;
