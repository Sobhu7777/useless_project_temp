import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TtsModel from "../models/TTsModel";
import './Result.css';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mood = location.state?.mood || "unknown";
  const [showTts, setShowTts] = useState(true);

  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    fear: "😨",
    neutral: "😐",
    disgusted: "🤢",
    surprised: "😮",
  };

  const sampleMessages = {
    happy: "Your smile is shinier than fresh pazham pori oil. Stay slippery.",
    sad: "Tears won’t refill your chaya glass, but I respect the drama.",
    angry: "Simmer down, kuzhi mandi. The world isn’t ready for your spice level.",

    fear: "You’re shaking like a steel tumbler on a bus ride to Munnar.",

    neutral: "You’re as exciting as day-old appam. No offence. Or maybe offence.",
    disgusted: "You look like you just saw watery chutney. Deep condolences.",
    surprised: "That face screams ‘free snacks?!’ — embrace the shock.",
  };

  const moodColors = {
    happy: "#2ecc71",
    sad: "#3498db",
    angry: "#e74c3c",
    fearful: "#f1c40f",
    neutral: "#95a5a6",
    disgusted: "#7f8c8d",
    surprised: "#e67e22",
    unknown: "#bdc3c7",
  };

  const handleTtsFinished = () => {
    setShowTts(false);
  };

  return (
    <div className="result-container">
      {showTts ? (
        <TtsModel initialMood={mood} onFinished={handleTtsFinished} />
      ) : (
        <div className="result-card">
          <h1 className="result-header">Your Mood, Your Snack</h1>
          
          <div className="mood-display" style={{ backgroundColor: moodColors[mood] }}>
            <span className="mood-emoji">{moodEmojis[mood] || "❓"}</span>
            <h2 className="mood-title">{mood.toUpperCase()}</h2>
          </div>

          <p className="mood-message">
            {sampleMessages[mood] || "Snack mood unidentified, but definitely snackable."}
          </p>

          <p className="motivation-text">
            Ready to unlock your <strong>Thatukkada Fate</strong>? Choose your destiny below and prepare for nonsense.
          </p>

          <div className="snack-dropdown-container">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  navigate(e.target.value, { state: { mood: mood.toLowerCase() } });
                }
              }}
              defaultValue=""
              className="snack-dropdown"
            >
              <option value="" disabled>
                Choose your snack prophecy
              </option>
              <option value="/snack-horoscope">Snack Horoscope</option>
              <option value="/snack-reincarnation">Snack Reincarnation</option>
              <option value="/snack-death">Snack Death</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;