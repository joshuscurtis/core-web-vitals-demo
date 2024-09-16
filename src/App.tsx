import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onCLS, onLCP, onTTFB, onINP, Metric } from "web-vitals";
import { RefreshCw } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import { CWVMetrics } from "./types";
import { CLSLevel, CLSLevels } from "./components/CLSDemo";

const THRESHOLDS = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  ttfb: 600,
  inp: 200,
};

const DEFAULT_LCP_DELAY = 2000;
const MAX_DELAY = 8000;

const App: React.FC = () => {
  const [lcpDelay, setLcpDelay] = useState<number>(DEFAULT_LCP_DELAY);
  const [clsLevel, setClsLevel] = useState<CLSLevel>(CLSLevels.high);
  const [cwvMetrics, setCWVMetrics] = useState<CWVMetrics>({
    lcp: 0,
    cls: 0,
    ttfb: 0,
    inp: 0,
  });
  const [key, setKey] = useState<number>(0);

  const updateMetric = useCallback(
    (metricName: keyof CWVMetrics, value: number) => {
      setCWVMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metricName]: value,
      }));
    },
    []
  );

  useEffect(() => {
    const reportCallback = ({ name, value }: Metric) => {
      updateMetric(name.toLowerCase() as keyof CWVMetrics, value);
    };

    onCLS(reportCallback, { reportAllChanges: true });
    onLCP(reportCallback, { reportAllChanges: true });
    onTTFB(reportCallback);
    onINP(reportCallback, { reportAllChanges: true });
  }, [updateMetric]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lcpDelayParam = params.get("lcpDelay");
    const clsLevelParam = params.get("clsLevel");

    if (lcpDelayParam) {
      const parsedDelay = parseInt(lcpDelayParam, 10);
      if (!isNaN(parsedDelay) && parsedDelay >= 0 && parsedDelay <= MAX_DELAY) {
        setLcpDelay(parsedDelay);
      }
    }
    if (clsLevelParam) {
      if (clsLevelParam in CLSLevels) {
        setClsLevel(clsLevelParam as CLSLevel);
      }
    }
  }, []);

  const handleReload = () => {
    setKey((prevKey) => prevKey + 1);
    setCWVMetrics({
      lcp: 0,
      cls: 0,
      ttfb: 0,
      inp: 0,
    });
    const params = new URLSearchParams();
    params.set("lcpDelay", lcpDelay.toString());
    params.set("clsLevel", clsLevel);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />
      <MainContent
        lcpDelay={lcpDelay}
        setLcpDelay={setLcpDelay}
        cwvMetrics={cwvMetrics}
        key={key}
        MAX_DELAY={MAX_DELAY}
        THRESHOLDS={THRESHOLDS}
      />
      <Footer />
      <AnimatePresence>
        <motion.button
          key="reload-button"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReload}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center space-x-2"
        >
          <RefreshCw size={20} />
          <span>Reload Demo</span>
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default App;
