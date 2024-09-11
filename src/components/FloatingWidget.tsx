import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BarChart2, Info, X } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface Metrics {
  lcp: number;
  cls: number;
  ttfb: number;
  inp: number;
}

interface FloatingMetricsWidgetProps {
  metrics: Metrics;
  thresholds: Metrics;
}

const metricInfo = {
  lcp: {
    name: "Largest Contentful Paint",
    description: "Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.",
    reporting: "Reported once per page load, but may update several times as larger elements are rendered."
  },
  cls: {
    name: "Cumulative Layout Shift",
    description: "Measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1 or less.",
    reporting: "Updated throughout the entire page lifecycle, accumulating all layout shifts. Final value reported when the page is unloaded."
  },
  ttfb: {
    name: "Time to First Byte",
    description: "Measures the time between the request for a resource and when the first byte of a response begins to arrive.",
    reporting: "Reported once, very early in the page load. Measures time from request start to first byte received."
  },
  inp: {
    name: "Interaction to Next Paint",
    description: "Measures responsiveness. A good INP score is 200 milliseconds or less.",
    reporting: "Updated periodically throughout the page session. Considers all user interactions and then reports the worst interaction (98th percentile)."
  }
};

const MetricItem: React.FC<{
  name: string;
  value: number;
  threshold: number;
}> = ({ name, value, threshold }) => {
  const getStatusColor = (value: number, threshold: number) => {
    if (value === 0) return "bg-gray-500";
    if (value <= threshold) return "bg-green-500";
    if (value <= threshold * 1.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatValue = (name: string, value: number) => {
    if (name === "cls") return value.toFixed(3);
    return value.toFixed(0);
  };

  const info = metricInfo[name as keyof typeof metricInfo];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <span className="text-white font-medium">{name.toUpperCase()}</span>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="text-gray-400 hover:text-white focus:outline-none">
              <Info size={14} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="rounded p-3 w-72 bg-white shadow-md z-[100]"
              sideOffset={5}
            >
              <h4 className="font-semibold text-sm mb-2">{info.name}</h4>
              <p className="text-xs text-gray-700 mb-2">{info.description}</p>
              <h5 className="font-semibold text-xs mb-1">How it's reported:</h5>
              <p className="text-xs text-gray-700">{info.reporting}</p>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-300">
          {formatValue(name, value)}
        </span>
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor(value, threshold)}`}
        ></div>
      </div>
    </div>
  );
};

const FloatingMetricsWidget: React.FC<FloatingMetricsWidgetProps> = ({
  metrics,
  thresholds,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ top: '50%', bottom: 'auto' });

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const widgetHeight = 300; // Approximate height of the widget
      if (windowHeight < widgetHeight) {
        setPosition({ top: 'auto', bottom: '0' });
      } else {
        setPosition({ top: '50%', bottom: 'auto' });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <motion.div
      className="fixed right-0 z-50 flex items-center"
      style={{
        top: position.top,
        bottom: position.bottom,
        transform: position.top === '50%' ? 'translateY(-50%)' : 'none',
      }}
      animate={{ x: isVisible ? (isExpanded ? 0 : 270) : 290 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {!isVisible && (
        <button
          onClick={toggleVisibility}
          className="bg-gray-700 p-2 rounded-l-md text-white hover:bg-gray-600 focus:outline-none"
        >
          <BarChart2 size={24} />
        </button>
      )}
      {isVisible && (
        <button
          onClick={toggleExpand}
          className="bg-gray-700 p-2 rounded-l-md text-white hover:bg-gray-600 focus:outline-none"
        >
          {isExpanded ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      )}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-l-lg shadow-lg overflow-hidden"
          >
            <div className="p-3 w-64 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Web Vitals</h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Core Web Vitals measure the user experience of web pages.
              </p>
              <div className="space-y-2 mb-3">
                {Object.entries(metrics).map(([key, value]) => (
                  <MetricItem
                    key={key}
                    name={key}
                    value={value}
                    threshold={thresholds[key as keyof Metrics]}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingMetricsWidget;