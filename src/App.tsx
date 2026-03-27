import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("Checking camera...");
  const [exercise] = useState("Glute Bridge");

  useEffect(() => {
    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMessage("Camera API is not available in this browser.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setMessage("Camera is working.");
      } catch (error) {
        console.error("Error accessing camera:", error);
        setMessage(
          "No camera found or permission denied. This is okay for now on desktop."
        );
      }
    }

    startCamera();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>Motion Rehab</h1>
        <p style={{ fontSize: "18px", color: "#475569", marginBottom: "24px" }}>
          AI-assisted rehab coaching for better exercise form.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Camera Preview</h2>
            <p style={{ color: "#475569" }}>{message}</p>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                marginTop: "16px",
                background: "#dbe4ee",
                borderRadius: "12px",
              }}
            />
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Session</h2>
            <p>
              <strong>Exercise:</strong> {exercise}
            </p>
            <p>
              <strong>Status:</strong> Ready
            </p>
            <p>
              <strong>Reps:</strong> 0
            </p>
            <p>
              <strong>Form score:</strong> --
            </p>

            <button
              style={{
                marginTop: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#0f172a",
                color: "white",
                cursor: "pointer",
              }}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;