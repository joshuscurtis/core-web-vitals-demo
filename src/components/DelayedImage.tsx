import React, { useState, useEffect } from "react";
import DelayedImage from "./components/DelayedImage";
import BadINPButton from "./components/BadINPButton";

interface DelayedImageProps {
  delay: number;
  showSkeleton: boolean;
}

const App: React.FC = () => {
  const [imageDelay, setImageDelay] = useState<number>(2000);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

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
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Web Vitals Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                testId="inp-button-good"
                delay={50}
                label="Good INP (50ms)"
              />
              <BadINPButton
                testId="inp-button-needs-improvement"
                delay={200}
                label="Needs Improvement INP (200ms)"
              />
              <BadINPButton
                testId="inp-button-poor"
                delay={500}
                label="Poor INP (500ms)"
              />
            </div>
            <p className="text-sm p-4 text-gray-400 max-w-md text-center mx-auto">
              These buttons demonstrate different levels of INP. When clicked,
              they will freeze the UI for the specified duration before
              responding.
            </p>
          </div>
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
