import { useState } from "react";

const BadINPButton = (props: { delay: number; testId: string }) => {
  const { delay, testId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleClick = () => {
    setIsLoading(true);
    setResult("");

    // Simulate a heavy computation
    const startTime = Date.now();
    while (Date.now() - startTime < delay) {
      console.log("waiting...");
    }

    setIsLoading(false);
    setResult("Operation completed!");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        data-testid={testId}
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing..." : `Click me (testId: ${testId})`}
      </button>
      {result && <p className="text-green-500">{result}</p>}
    </div>
  );
};

export default BadINPButton;
