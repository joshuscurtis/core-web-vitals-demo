import React, { useState, useEffect } from "react";

export type CLSLevel = "low" | "medium" | "high";

export const CLSLevels: Record<CLSLevel, CLSLevel> = {
  low: "low",
  medium: "medium",
  high: "high",
};

interface CLSDemoProps {
  initialLevel: CLSLevel;
}

const CLSDemo: React.FC<CLSDemoProps> = ({ initialLevel }) => {
  const [clsLevel, setClsLevel] = useState<CLSLevel>(initialLevel);
  const [imageSize, setImageSize] = useState<number>(50);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("clsLevel") as CLSLevel;
    if (level && CLSLevels[level]) {
      setClsLevel(level);
    } else {
      setClsLevel(initialLevel);
    }
  }, [initialLevel]);

  useEffect(() => {
    const initialSize = getImageSize(true);
    setImageSize(initialSize);

    const timer = setTimeout(() => {
      const updatedSize = getImageSize(false);
      setImageSize(updatedSize);
    }, 300);

    return () => clearTimeout(timer);
  }, [clsLevel]);

  const updateClsLevel = (level: CLSLevel) => {
    setClsLevel(level);
    updateUrlParam("clsLevel", level);
  };

  const updateUrlParam = (param: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.replaceState({}, "", url.toString());
  };

  const getImageSize = (initial: boolean): number => {
    const baseSize = 50;
    switch (clsLevel) {
      case CLSLevels.low:
        return initial ? baseSize : 50;
      case CLSLevels.medium:
        return initial ? baseSize : 200;
      case CLSLevels.high:
        return initial ? baseSize : 400;
      default:
        return baseSize;
    }
  };

  const getLevelColor = () => {
    switch (clsLevel) {
      case CLSLevels.low:
        return "text-green-500";
      case CLSLevels["medium"]:
        return "text-yellow-500";
      case CLSLevels.high:
        return "text-red-500";
    }
  };

  return (
    <div className="space-y-4" id="cls-demo">
      <p className="text-gray-300">
        This demo demonstrates layout shifts. Current CLS level:{" "}
        <span className={`font-bold ${getLevelColor()}`}>{clsLevel}</span>
      </p>
      <div className="space-x-2 mb-4">
        <button
          onClick={() => updateClsLevel(CLSLevels.low)}
          data-testid="cls-low"
          className={`px-4 py-2 rounded ${
            clsLevel === CLSLevels.low ? "bg-green-600" : "bg-green-800"
          } text-white`}
        >
          low
        </button>
        <button
          onClick={() => updateClsLevel(CLSLevels["medium"])}
          data-testid="cls-medium"
          className={`px-4 py-2 rounded ${
            clsLevel === CLSLevels["medium"] ? "bg-yellow-600" : "bg-yellow-800"
          } text-white`}
        >
          medium
        </button>
        <button
          onClick={() => updateClsLevel(CLSLevels.high)}
          data-testid="cls-high"
          className={`px-4 py-2 rounded ${
            clsLevel === CLSLevels.high ? "bg-red-600" : "bg-red-800"
          } text-white`}
        >
          high
        </button>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg relative">
        <div className="relative">
          <div className="mb-8">
            <p className="mb-2 text-white text-lg">
              <b id="cls">Breaking news:</b> Dogs are better than cats!
            </p>
            <img
              src={`https://placedog.net/${imageSize}/${imageSize}?random`}
              alt="Random Dog"
              className="mb-4 rounded-lg transition-all duration-300 ease-in-out"
              style={{
                width: `${imageSize}px`,
                height: `${imageSize}px`,
                objectFit: "cover",
              }}
            />
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg mt-4">
        <h4 className="text-lg font-semibold text-white mb-2">
          Content Below CLS Demo
        </h4>
        <p className="text-gray-300">
          This content is placed below the CLS demo to show how layout shifts
          can affect the entire page. As you change the CLS level, you may
          notice this section shift due to changes in image sizes above.
        </p>
      </div>
    </div>
  );
};

export default CLSDemo;
