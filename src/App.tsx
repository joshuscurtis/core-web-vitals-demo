import React, { useState, useEffect } from "react";
import DelayedImage from "./components/DelayedImage";
import BadINPButton from "./components/BadInpButton";
import FloatingMetricsWidget from "./components/FloatingWidget";
import { onCLS, onLCP, onTTFB, onINP } from "web-vitals";

const App: React.FC = () => {
  const [imageDelay, setImageDelay] = useState<number>(2000);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [thresholds, setThresholds] = useState({
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    ttfb: 600,
    inp: 200,
  });

  const [cwvMetrics, setcwvMetrics] = useState({
    lcp: 0,
    cls: 0,
    ttfb: 0,
    inp: 0,
  });

  useEffect(() => {
    const updateMetric = (
      metricName: keyof typeof cwvMetrics,
      value: number
    ) => {
      setcwvMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metricName]: value,
      }));
    };

    onCLS((metric: { value: number }) => updateMetric("cls", metric.value), {
      reportAllChanges: true,
    });
    onLCP((metric: { value: number }) => updateMetric("lcp", metric.value), {
      reportAllChanges: true,
    });
    onTTFB((metric: { value: number }) => updateMetric("ttfb", metric.value));
    onINP((metric: { value: number }) => updateMetric("inp", metric.value), {
      reportAllChanges: true,
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageDelayParam = params.get("imageDelay");
    const skeletonParam = params.get("skeleton");

    if (imageDelayParam) {
      const parsedDelay = parseInt(imageDelayParam, 10);
      if (!isNaN(parsedDelay) && parsedDelay >= 0) {
        setImageDelay(parsedDelay);
      }
    }
    setShowSkeleton(skeletonParam === "true");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Web Vitals Demo for SiteSpeedTest Workshop
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
              <h2 className="text-2xl font-bold text-white">CLS & LCP Demo</h2>
            </div>
            <div className="p-6">
              <DelayedImage delay={imageDelay} showSkeleton={showSkeleton} />
              <p className="mt-4 text-center text-white">
                Image delay: {imageDelay}ms
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-4">
              <h2 className="text-2xl font-bold text-white">INP Demo</h2>
            </div>

            <div className="p-6 space-y-4">
              <BadINPButton
                testId="inp-button-low"
                delay={50}
                label="Good INP (50ms)"
              />
              <BadINPButton
                testId="inp-button-med"
                delay={300}
                label="Needs Improvement INP (300ms)"
              />
              <BadINPButton
                testId="inp-button-high"
                delay={600}
                label="Poor INP (600ms)"
              />
            </div>
            <p className="text-sm p-4 text-gray-400 max-w-md text-center mx-auto">
              These buttons demonstrate different levels of INP. When clicked,
              they will freeze the UI for the specified duration before
              responding.
            </p>
          </div>
        </div>
        <div className="p-6">
          <FloatingMetricsWidget metrics={cwvMetrics} thresholds={thresholds} />
        </div>

        <div className="mt-8 text-center text-white">
          <p>Adjust delays using URL parameters:</p>
          <code className="bg-gray-700 px-2 py-1 rounded">
            ?imageDelay=3000&skeleton=true
          </code>
        </div>
      </div>
    </div>
  );
};

export default App;
