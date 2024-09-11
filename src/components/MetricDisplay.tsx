import React, { useState, useEffect } from "react";
import { onCLS, onFID, onLCP, onTTFB, onINP } from "web-vitals";

interface Metrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  inp: number;
}

interface MetricsDisplayProps {
  thresholds: Metrics;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ thresholds }) => {
  const [metrics, setMetrics] = useState<Metrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    inp: 0,
  });

  useEffect(() => {
    const updateMetric = (metricName: keyof Metrics, value: number) => {
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        [metricName]: value,
      }));
    };

    onCLS((metric) => updateMetric("cls", metric.value), {
      reportAllChanges: true,
    });
    onFID((metric) => updateMetric("fid", metric.value));
    onLCP((metric) => updateMetric("lcp", metric.value));
    onTTFB((metric) => updateMetric("ttfb", metric.value));
    onINP((metric) => updateMetric("inp", metric.value), {
      reportAllChanges: true,
    });
  }, []);

  const getStatusColor = (value: number, threshold: number) => {
    if (value === 0) return "text-gray-500"; // Not measured yet
    if (value <= threshold) return "text-green-500";
    if (value <= threshold * 1.5) return "text-yellow-500";
    return "text-red-500";
  };

  const formatMetricValue = (key: string, value: number) => {
    if (value === 0) return "Not measured";
    if (key === "cls") return value.toFixed(3);
    return value.toFixed(0);
  };

  const getMetricUnit = (key: string, value: number) => {
    if (value === 0) return "";
    if (key === "cls") return "";
    return "ms";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Current Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-white">
              {key.toUpperCase()}
            </h4>
            <p
              className={`text-2xl font-bold ${getStatusColor(
                value,
                thresholds[key as keyof Metrics]
              )}`}
            >
              {formatMetricValue(key, value)} {getMetricUnit(key, value)}
            </p>
            <p className="text-sm text-gray-400">
              Threshold: {thresholds[key as keyof Metrics]}{" "}
              {getMetricUnit(key, value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsDisplay;
