import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import foodList from "../data/food_list.json";
import "./SnackReincarnation.css";

export default function SnackReincarnation() {
  const location = useLocation();
  const mood = location.state?.mood || "neutral";

  const [line, setLine] = useState("");
  const [bgm] = useState(new Audio("/sounds/reincarnation-bgm.mp3")); // place file in public/sounds/

  useEffect(() => {
    if (!foodList[mood]) return;

    const lines = foodList[mood].snackReincarnation;
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    setLine(randomLine);

    bgm.volume = 0.7;
    bgm.play().catch(() => {}); // ignore autoplay restriction

    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [mood]);

  return (
    <div className="reincarnation-container">
      <div className="scroll-frame">
        <h2 className="scroll-title">📜 Your Past Snack Life 📜</h2>
        <p className="scroll-text">{line}</p>
      </div>
    </div>
  );
}
