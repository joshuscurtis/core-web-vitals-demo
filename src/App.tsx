import { useState, useEffect } from "react";
import DelayedImage from "./components/DelayedImage";
import BadINPButton from "./components/BadInpButton";

function App() {
  const [imageDelay, setImageDelay] = useState(2000);
  const [buttonDelay, setButtonDelay] = useState(250);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageDelay = params.get("imageDelay");
    const buttonDelay = params.get("buttonDelay");
    const skeleton = params.get("skeleton");

    if (imageDelay) {
      const parsedDelay = parseInt(imageDelay, 10);
      if (!isNaN(parsedDelay) && parsedDelay >= 0) {
        setImageDelay(parsedDelay);
      }
    }
    if (buttonDelay) {
      const parsedDelay = parseInt(buttonDelay, 10);
      if (!isNaN(parsedDelay) && parsedDelay >= 0) {
        setButtonDelay(parsedDelay);
      }
    }
    setShowSkeleton(skeleton === "true");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Web Vitals Demo</h1>
        
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
            <div className="p-6">
              <BadINPButton delay={buttonDelay} />
              <p className="mt-4 text-center text-white">
                Button delay: {buttonDelay}ms
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white">
          <p>Adjust delays using URL parameters:</p>
          <code className="bg-gray-700 px-2 py-1 rounded">
            ?imageDelay=3000&buttonDelay=500&skeleton=true
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;