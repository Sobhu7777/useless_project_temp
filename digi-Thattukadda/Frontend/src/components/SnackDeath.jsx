import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import foodList from "../data/food_list.json";
import "./SnackDeath.css";

export default function SnackDeath() {
  const location = useLocation();
  const mood = location.state?.mood || "neutral";

  const [line, setLine] = useState("");
  const [bgm] = useState(new Audio("/sounds/reincarnation-bgm.mp3")); // put in public/sounds/

  useEffect(() => {
    if (!foodList[mood]) return;

    const lines = foodList[mood].snackDeath;
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    setLine(randomLine);

    bgm.volume = 0.7;
    bgm.play().catch(() => {}); // ignore autoplay restrictions

    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [mood]);

  return (
    <div className="death-container">
      <div className="death-frame">
        <h2 className="death-title">☠ Cause of Death ☠</h2>
        <p className="death-text">{line}</p>
      </div>
    </div>
  );
}
