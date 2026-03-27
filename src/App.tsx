import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [message, setMessage] = useState("Checking camera...");

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
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Motion Rehab</h1>
      <p>{message}</p>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "400px",
          marginTop: "20px",
          background: "#ddd",
          borderRadius: "12px",
        }}
      />
    </main>
  );
}

export default App;