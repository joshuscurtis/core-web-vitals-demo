import React from "react";

interface Thresholds {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  inp: number;
}

interface ThresholdConfiguratorProps {
  thresholds: Thresholds;
  setThresholds: React.Dispatch<React.SetStateAction<Thresholds>>;
}

const ThresholdConfigurator: React.FC<ThresholdConfiguratorProps> = ({
  thresholds,
  setThresholds,
}) => {
  const handleThresholdChange = (metric: keyof Thresholds, value: string) => {
    setThresholds((prev) => ({ ...prev, [metric]: parseFloat(value) }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Configure Thresholds</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(thresholds).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="text-sm font-medium text-gray-300 mb-1"
            >
              {key.toUpperCase()}
            </label>
            <input
              type="number"
              id={key}
              value={value}
              onChange={(e) =>
                handleThresholdChange(key as keyof Thresholds, e.target.value)
              }
              className="bg-gray-700 text-white px-3 py-2 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThresholdConfigurator;
