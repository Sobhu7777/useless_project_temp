import { pipeline } from "@huggingface/transformers";
import { useEffect, useRef, useState } from "react";
import { useImage } from "../context/ImageContext";
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function EmoModel() {
  const { image, setImage } = useImage();
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Initializing...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const detector = useRef(null);
  const modelLoadingStarted = useRef(false);

  useEffect(() => {
    if (modelLoadingStarted.current) return;
    modelLoadingStarted.current = true;

    const loadModel = async () => {
      try {
        setStatus("Loading model...");
        detector.current = await pipeline(
          "image-classification",
          "Xenova/facial_emotions_image_detection",
          {
            progress_callback: (data) => {
              if (data.status === "progress") {
                const progress = Math.round(data.progress);
                setLoadingProgress(progress);
                setStatus(`Loading model... ${progress}%`);
              } else if (data.status === "done") {
                setStatus("Model loaded. Ready to analyze.");
              } else {
                const formattedStatus =
                  data.status.charAt(0).toUpperCase() +
                  data.status.slice(1).replace(/_/g, " ");
                setStatus(formattedStatus + "...");
              }
            },
          }
        );
        setIsModelReady(true);
        setStatus("Model loaded. Please upload an image.");
      } catch (error) {
        console.error("Failed to load model:", error);
        setStatus("Error: Could not load the model.");
      }
    };
    loadModel();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setResults([]);
      setStatus("No image selected.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setResults([]);
      setStatus('Image loaded. Click "Detect Emotions" to analyze.');
    };
    reader.readAsDataURL(file);
  };

  const handleDetect = async () => {
    if (!image || !detector.current) {
      setStatus("Please upload an image first.");
      return;
    }

    setIsDetecting(true);
    setStatus("Analyzing image...");
    setResults([]);

    try {
      const emotions = await detector.current(image);
      if (emotions && emotions.length > 0) {
        setResults(emotions);
        setStatus("Detection complete.");
      } else {
        setStatus("Could not detect any emotions. Please try another image.");
      }
    } catch (error) {
      console.error("Detection failed:", error);
      setStatus("An error occurred during detection.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Facial Emotion Detector
          </h1>
          <p className="text-gray-400">{status}</p>

          {!isModelReady && loadingProgress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-white h-2.5 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}
        </header>

        <main className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center">
              <label
                htmlFor="file-upload"
                className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"
                      />
                    </svg>
                    <p>Click to upload an image</p>
                  </div>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!isModelReady}
              />
              <button
                onClick={handleDetect}
                disabled={!image || isDetecting || !isModelReady}
                className="w-full mt-4 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDetecting ? <Spinner /> : null}
                {isDetecting ? "Detecting..." : "Detect Emotions"}
              </button>
            </div>

            <div className="flex flex-col justify-center min-h-[20rem]">
              <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
                Results
              </h2>
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map(({ label, score }) => (
                    <div key={label} className="w-full">
                      <div className="flex justify-between mb-1 text-gray-300">
                        <span className="text-base font-medium capitalize">
                          {label}
                        </span>
                        <span className="text-sm font-medium">
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-white h-2.5 rounded-full"
                          style={{ width: `${score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-lg p-10 flex items-center justify-center h-full">
                  <p>Analysis results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
