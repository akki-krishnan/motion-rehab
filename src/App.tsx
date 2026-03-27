import { useEffect, useRef, useState } from "react";

function getHipY(landmarks: any) {
  if (!landmarks) return null;

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  return (leftHip.y + rightHip.y) / 2;
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [message, setMessage] = useState("Checking camera...");
  const [exercise] = useState("Glute Bridge");
  const [status, setStatus] = useState("Ready");
  const [reps, setReps] = useState(0);

  useEffect(() => {
    async function setupPose() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMessage("Camera API is not available.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const pose = new (window as any).Pose({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
        });

        pose.onResults((results: any) => {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas?.getContext("2d");

          if (!canvas || !ctx || !video) return;

          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.poseLandmarks) {
            for (const lm of results.poseLandmarks) {
              ctx.beginPath();
              ctx.arc(
                lm.x * canvas.width,
                lm.y * canvas.height,
                5,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = "red";
              ctx.fill();
            }

            const hipY = getHipY(results.poseLandmarks);
            console.log("Hip Y:", hipY);
          }
        });

        async function detect() {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            await pose.send({ image: videoRef.current });
          }
          requestAnimationFrame(detect);
        }

        detect();
        setMessage("Pose system ready.");
      } catch (err) {
        console.error(err);
        setMessage("No camera available (desktop is fine).");
      }
    }

    setupPose();
  }, []);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Motion Rehab</h1>
      <p>{message}</p>

      <div style={{ position: "relative", width: "400px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            background: "#dbe4ee",
            borderRadius: "12px",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Exercise:</strong> {exercise}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Reps:</strong> {reps}
        </p>

        <button
          onClick={() => {
            setStatus("Session started");
            setReps(0);
          }}
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
    </main>
  );
}

export default App;