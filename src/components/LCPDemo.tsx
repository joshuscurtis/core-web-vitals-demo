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
    <div className="space-y-4" id="lcp">
      <p className="text-gray-300">
        This image will load after a {delay}ms delay, simulating a slow LCP:
      </p>
      {showImage ? (
        <img
          src="/400x500.svg"
          alt="Large Contentful Paint Example"
          className="rounded-lg shadow-md"
          style={{ width: "400px", height: "500px" }}
        />
      ) : (
        <div
          className="bg-gray-700 rounded-lg animate-pulse"
          style={{ width: "400px", height: "500px" }}
        ></div>
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
