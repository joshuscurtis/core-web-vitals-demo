import React, { useState, useEffect } from "react";

interface LCPDemoProps {
  delay: number;
}

const LCPDemo: React.FC<LCPDemoProps> = ({ delay }) => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">LCP Demo</h3>
      <p className="text-gray-300">
        This image will load after a {delay}ms delay, simulating a slow LCP:
      </p>
      {showImage ? (
        <img
          src="/600x800.svg"
          alt="Large Contentful Paint Example"
          className="w-full h-auto rounded-lg shadow-md"
          width={800}
          height={600}
        />
      ) : (
        <div className="w-full h-[600px] bg-gray-700 rounded-lg animate-pulse"></div>
      )}
      <p className="text-sm text-gray-400 italic">
        {showImage
          ? "Image loaded. This is likely your LCP element."
          : "Image is still loading..."}
      </p>
    </div>
  );
};

export default LCPDemo;
