"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");

  const [status, setStatus] = useState("Initializing...");
  const [images, setImages] = useState<string[]>([]);

  // Timelapse specific states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(2); // Frames per second

  // 1. Polling Logic (keeps your exact backend communication)
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/job_status/${jobId}`,
        );
        const data = await response.json();

        if (data.error) {
          setStatus(data.error);
          clearInterval(interval);
          return;
        }

        setStatus(data.status);

        if (data.result && Array.isArray(data.result)) {
          setImages(data.result);
        }

        if (data.status === "completed") {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // 2. Timelapse Playback Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && images.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1000 / fps);
    }
    return () => clearInterval(timer);
  }, [isPlaying, fps, images.length]);

  return (
    <main className="page-shell results-shell">
      <section className="glass-panel results-panel">
        <header className="results-header">
          <p className="eyebrow">Observation Results</p>
          <h1>TIME-LAPSE VIEWER</h1>
        </header>

        {/* Status Box */}
        <div className="results-status" role="status">
          <p>
            Status:{" "}
            <span className="results-status-value">
              {status}
            </span>
          </p>
          {(status === "processing" || status === "queued") && (
            <span className="results-spinner" aria-label="Processing" />
          )}
        </div>

        {/* Timelapse Player UI */}
        {images.length > 0 ? (
          <div className="results-player">
            {/* Main Active Frame */}
            <div className="results-frame">
              <img
                src={images[currentIndex]}
                alt={`Frame ${currentIndex + 1}`}
              />
              <span className="results-frame-counter">
                Frame {currentIndex + 1} of {images.length}
              </span>
            </div>

            {/* Scrubber Timeline Slider */}
            <div className="results-scrubber">
              <input
                type="range"
                min={0}
                max={images.length - 1}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false); // Pause on manual scrub
                  setCurrentIndex(Number(e.target.value));
                }}
                aria-label="Select frame"
              />
            </div>

            {/* Playback Controls */}
            <div className="results-controls">
              <div className="results-playback-buttons">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(0);
                  }}
                  className="results-control-button"
                >
                  Start
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="results-control-button results-primary-button"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>

              {/* Speed Selector */}
              <label className="results-speed">
                <span>Speed:</span>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                >
                  <option value={1}>1 fps (Slow)</option>
                  <option value={2}>2 fps</option>
                  <option value={5}>5 fps (Fast)</option>
                  <option value={10}>10 fps (Turbo)</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <div className="results-empty">
            {status === "processing" || status === "queued" ? (
              <p className="results-pulse">
                Generating timelapse frames... Please wait.
              </p>
            ) : (
              <p>
                No frames found or job encountered an error.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<main className="page-shell results-shell"><p className="results-loading">Loading timelapse...</p></main>}>
      <ResultsContent />
    </Suspense>
  );
}
