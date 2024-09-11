import React, { useState, useEffect } from "react";

interface BadINPButtonProps {
  delay: number;
  testId: string;
  label: string;
}

const BadINPButton: React.FC<BadINPButtonProps> = ({
  delay,
  testId,
  label,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  const handleClick = () => {
    setIsLoading(true);
    setResult("");

    // Simulate a heavy computation
    const startTime = performance.now();
    while (performance.now() - startTime < delay) {
      // Intentionally empty to simulate busy work
    }

    setIsLoading(false);
    setResult("Operation completed!");
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const getButtonColor = () => {
    if (delay <= 100)
      return "bg-green-500 hover:bg-green-600 active:bg-green-700";
    if (delay <= 300)
      return "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700";
    return "bg-red-500 hover:bg-red-600 active:bg-red-700";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        data-testid={testId}
        className={`w-full px-4 py-2 rounded-md text-white font-semibold transition-colors duration-150 ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : getButtonColor()
        }`}
      >
        {isLoading ? "Processing..." : label}
      </button>
      {result && <p className="text-green-500 text-sm">{result}</p>}
    </div>
  );
};

export default BadINPButton;
