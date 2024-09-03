import { useState, useEffect } from "react";

const DelayedImage = (props: { delay: number; showSkeleton: boolean }) => {
  const { delay, showSkeleton } = props;
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const ImageSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-auto bg-gray-700 rounded-lg" style={{ aspectRatio: "600/800" }}></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-gray-300">
        The image below will load after a delay, causing a layout shift:
      </p>

      {!showImage && showSkeleton ? (
        <ImageSkeleton />
      ) : (
        showImage && (
          <img
            src="600x800.svg"
            alt="Placeholder"
            className="w-full h-auto rounded-lg shadow-md"
            data-testid="delayed-image"
            width={600}
            height={800}
          />
        )
      )}

      <p className="text-sm text-gray-400 italic">
        {showImage
          ? "Notice how the content below the image shifts when it loads."
          : "The image is still loading..."}
      </p>
    </div>
  );
};

export default DelayedImage;
