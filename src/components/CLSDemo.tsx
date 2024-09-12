import React, { useState, useEffect } from "react";

interface CLSDemoProps {
  delay: number;
  showSkeleton: boolean;
  severity: number; // 0 to 100
}

const CLSDemo: React.FC<CLSDemoProps> = ({ delay, showSkeleton, severity }) => {
  const [loadedContent, setLoadedContent] = useState<number[]>([]);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const contentTimers = [0, 1].map((_, index) =>
      setTimeout(() => {
        setLoadedContent(prev => [...prev, index]);
      }, delay + index * 1000)
    );

    const adTimer = setTimeout(() => {
      setShowAd(false);
    }, delay + 2500); // Ad appears after 2.5 seconds of content loading

    return () => {
      contentTimers.forEach(clearTimeout);
      clearTimeout(adTimer);
    };
  }, [delay]);

  const SkeletonContent = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-600 rounded w-5/6"></div>
    </div>
  );

  const paragraphs = [
    "Breaking news: Cats are actually aliens!",
    "Scientists shocked by feline origins.",
    "Global reaction: #CatsAreAliens trending.",
    "Expert advice: Watch for signs of alien tech.",
    "Government silent on extraterrestrial cats.",
  ];

  const getImageSize = (index: number) => {
    const baseSize = 100 + index * 50;
    const maxAdditionalSize = 100;
    const additionalSize = (severity / 100) * maxAdditionalSize;
    return baseSize + additionalSize;
  };

  const getRandomPosition = () => {
    const positions = ['left', 'right'];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  const getAdSize = () => {
    const baseSize = 200;
    const maxAdditionalSize = 200;
    const additionalSize = (severity / 100) * maxAdditionalSize;
    return baseSize + additionalSize;
  };

  const getAdPosition = () => {
    if (severity < 33) return 'top-0 right-0';
    if (severity < 66) return 'top-1/4 left-1/4';
    return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">CLS Demo</h3>
      <p className="text-gray-300">
        This demo will cause layout shifts after {delay}ms. 
        Current severity: {severity}%
      </p>
      <div className="bg-gray-700 p-4 rounded-lg relative">
        {showSkeleton && loadedContent.length === 0 && (
          <div className="p-4 bg-gray-600 rounded-lg">
            <SkeletonContent />
          </div>
        )}
        <div className="relative">
          {loadedContent.map((_, index) => (
            <div key={index} className="mb-8">
              <p className="mb-2 text-white text-lg">{paragraphs[index]}</p>
              {index < 4 && (
                <img
                  src={`https://placehold.co/${getImageSize(index)}x${getImageSize(index)}`}
                  alt={`Placeholder ${index + 1}`}
                  className={`mb-4 rounded-lg transition-all duration-300 ease-in-out ${getRandomPosition() === 'left' ? 'float-left mr-4' : 'float-right ml-4'}`}
                  style={{
                    width: `${getImageSize(index)}px`,
                    height: `${getImageSize(index)}px`,
                    objectFit: "cover",
                  }}
                />
              )}
              <div className="clearfix"></div>
            </div>
          ))}
        </div>
        {showAd && (
          <div 
            className={`absolute bg-red-500 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${getAdPosition()}`}
            style={{
              width: `${getAdSize()}px`,
              height: `${getAdSize()}px`,
              zIndex: 10,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-center font-bold">
                Surprise Ad!<br />This causes CLS
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-800 p-4 rounded-lg mt-4">
        <h4 className="text-lg font-semibold text-white mb-2">Content Below CLS Demo</h4>
        <p className="text-gray-300">
          This content is placed below the CLS demo to show how layout shifts can affect the entire page.
          As new elements are added above, this section will be pushed down, potentially causing Cumulative Layout Shift.
        </p>
      </div>
      <p className="text-sm text-gray-400 italic">
        {loadedContent.length > 0
          ? `${loadedContent.length} piece(s) of content loaded, causing layout shifts.${showAd ? ' An advertisement has also appeared.' : ''}`
          : showSkeleton
          ? "Skeleton content is shown, reducing perceived layout shift."
          : "Waiting for content to load..."}
      </p>
    </div>
  );
};

export default CLSDemo;
