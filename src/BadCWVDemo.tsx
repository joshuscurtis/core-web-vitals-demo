import { useState, useEffect } from "react";

const BadCLSDemo = () => {
  const [showImage, setShowImage] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Bad CLS Demo
      </h1>

      <div
        style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #ef4444",
          borderRadius: "0.375rem",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p style={{ fontWeight: "bold", color: "#dc2626" }}>Warning</p>
        <p style={{ color: "#dc2626" }}>
          This demo intentionally showcases poor Cumulative Layout Shift (CLS).
        </p>
      </div>

      <div>
        <p>The image below will load after a delay, causing a layout shift:</p>

        {showImage && (
          <img
            src="https://placehold.co/600x1000"
            alt="Placeholder"
            style={{ width: "100%", height: "auto" }}
          />
        )}

        <div
          style={{
            padding: "1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => setCount((prevCount) => prevCount + 1)}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Count is {count}
          </button>
        </div>

        <p
          style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "1rem" }}
        >
          Notice how the content below the image shifts when it loads.
        </p>
      </div>
    </div>
  );
};

export default BadCLSDemo;
