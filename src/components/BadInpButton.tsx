import { useState } from "react";

const BadINPButton = (props: { delay: number }) => {
  const { delay } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleClick = () => {
    setIsLoading(true);
    setResult("");

    // Simulate a heavy computation
    const startTime = Date.now();
    while (Date.now() - startTime < delay) {
      // Busy wait for 3 seconds
    }

    setIsLoading(false);
    setResult("Operation completed!");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        data-testid="inp-button"
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing..." : "Click me (Bad INP)"}
      </button>
      {result && <p className="text-green-500">{result}</p>}
      <p className="text-sm text-gray-500 max-w-md text-center">
        This button demonstrates bad INP. When clicked, it will freeze the UI
        for {delay} ms before responding.
      </p>
    </div>
  );
};

export default BadINPButton;
