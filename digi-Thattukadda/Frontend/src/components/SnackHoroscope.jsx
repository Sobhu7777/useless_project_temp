import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import foodList from "../data/food_list.json";
import "./SnackHoroscope.css";

export default function SnackHoroscope() {
  const location = useLocation();
  const [displayText, setDisplayText] = useState("");
  const [bgm] = useState(new Audio("/sounds/horoscope-bgm.mp3")); // put your file in public/sounds/
  const mood = location.state?.mood || "unknown";

  useEffect(() => {
    if (!mood || !foodList[mood]) return;

    // Pick a random horoscope from the JSON
    const horoscopes = foodList[mood].snackHoroscope;
    const randomText =
      horoscopes[Math.floor(Math.random() * horoscopes.length)];

    // Start playing BGM
    bgm.volume = 0.7;
    bgm.play().catch(() => {}); // avoid autoplay restrictions

    // Typewriter effect
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + randomText.charAt(index));
      index++;
      if (index === randomText.length) {
        clearInterval(interval);
      }
    }, 50); // typing speed

    return () => {
      clearInterval(interval);
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [mood]);

  return (
    <div className="horoscope-container">
      <div className="horoscope-frame">
        <h2 className="horoscope-title">🥟 Your Snack Horoscope 🥟</h2>
        <p className="horoscope-text">{displayText}</p>
      </div>
    </div>
  );
}
