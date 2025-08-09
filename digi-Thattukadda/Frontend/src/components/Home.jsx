import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useImage } from "../context/ImageContext";

export default function Home() {
  const { image, setImage } = useImage();
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [mode, setMode] = useState(null); // "upload" or "webcam"

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setMode("preview-upload");
    };
    reader.readAsDataURL(file);
  };

  // Webcam Capture Handler
  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      setMode("preview-webcam");
    }
  }, [webcamRef, setImage]);

  // Proceed to Detecting Screen
  const handleProceed = () => {
    navigate("/detecting");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-8 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 font-serif tracking-wide">
            Thatukkada Mood Scanner
          </h1>
          <p className="mt-2 text-lg text-gray-400 italic font-medium">
            “Chaaya ready aayi, selfie edukkan ready aano?”
          </p>
        </div>

        {/* Action Buttons / Main Content */}
        {!mode && (
          <div className="flex flex-col gap-5 w-full">
            <label
              htmlFor="file-upload"
              className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl cursor-pointer text-white font-bold text-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="absolute left-6">📂</span>
              Upload Selfie
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setMode("webcam")}
            >
              <span className="absolute left-6">📸</span>
              Open Webcam
            </button>
          </div>
        )}

        {/* Webcam View */}
        {mode === "webcam" && (
          <div className="flex flex-col items-center w-full">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-xl border-4 border-gray-600 shadow-md w-full mb-4"
              videoConstraints={{
                facingMode: "user",
              }}
            />
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={capture}
            >
              📷 Take Photo
            </button>
          </div>
        )}

        {/* Preview for Upload & Webcam */}
        {(mode === "preview-upload" || mode === "preview-webcam") && image && (
          <div className="flex flex-col items-center w-full">
            <img
              src={image}
              alt="Preview"
              className="rounded-xl border-4 border-yellow-400 shadow-lg w-full mb-6"
            />
            <p className="text-xl text-center font-semibold text-gray-200 mb-4">
              {mode === "preview-upload"
                ? "Ithu thanne vaa! Proceed cheyyatte?"
                : "Super click! Onnu proceed cheyyatte?"}
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors"
                onClick={() =>
                  mode === "preview-upload"
                    ? document.querySelector("input[type='file']").click()
                    : setMode("webcam")
                }
              >
                🙅‍♂️ Illa vere nokaam
              </button>
              <button
                className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition-colors"
                onClick={handleProceed}
              >
                ✅ Aan chambiko
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}