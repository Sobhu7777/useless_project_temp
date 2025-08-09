import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import foodList from "../data/food_list.json";
import "./TtsModel.css";

export default function TtsModel({
  initialMood = "neutral",
  onFinished = () => {},
}) {
  const mood = (initialMood || "neutral").toLowerCase();
  const audioRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const [scriptText, setScriptText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(
    "Preparing your Thatukkada broadcast..."
  );
  const [error, setError] = useState(null);

  // Helper: pick random element
  const rnd = (arr) =>
    Array.isArray(arr) && arr.length
      ? arr[Math.floor(Math.random() * arr.length)]
      : "";

  // Compose a short multi-speaker script from local JSON
  const buildScript = (moodKey) => {
    const data = foodList[moodKey] || {};
    const snack = rnd(data.snacks) || "some tasty snack";
    const horoscopeLine =
      rnd(data.snackHoroscope) || `The stars say: eat ${snack}.`;
    const reincLine = rnd(data.snackReincarnation) || "";
    const speakerA = `Thattukada Karan: ${horoscopeLine}`;
    const speakerB = `Ammaavan: You need ${snack} right now — trust me, it's destiny. ${reincLine}`;
    return `${speakerA}\n${speakerB}`;
  };

  useEffect(() => {
    let cancelled = false;

    const generateAndPlay = async () => {
      // ... (rest of the logic remains the same)
      try {
        setLoading(true);
        setError(null);
        setStatusMsg("Building your Thatukkada script...");

        const textToSpeak = buildScript(mood);
        setScriptText(textToSpeak);
        setDisplayText("");

        setStatusMsg("Summoning the radio ghosts...");

        const resp = await axios.post(
          "http://localhost:3000/generate-tts",
          { mood, text: textToSpeak },
          { responseType: "blob", timeout: 30000 }
        );

        if (cancelled) return;

        const audioBlob = resp.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.preload = "metadata";

        audio.onloadedmetadata = () => {
          if (cancelled) return;
          const duration = audio.duration || 3;
          const charCount = Math.max(1, textToSpeak.length);
          let perChar = (duration * 1000) / charCount;
          perChar = Math.max(18, Math.min(120, Math.round(perChar)));

          const START_DELAY_MS = 500;
          setStatusMsg("Broadcast starting...");

          setTimeout(async () => {
            if (cancelled) return;
            try {
              await audio.play();
            } catch (playErr) {
              console.warn("Autoplay blocked:", playErr);
              setError("Autoplay blocked — playing text only.");
            }

            let idx = 0;
            typingIntervalRef.current = setInterval(() => {
              if (cancelled) return;
              setDisplayText((prev) => prev + textToSpeak.charAt(idx));
              idx++;
              if (idx >= textToSpeak.length) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
              }
            }, perChar);
          }, START_DELAY_MS);
        };

        audio.onended = () => {
          if (cancelled) return;
          setStatusMsg("Broadcast complete.");
          setLoading(false);
          setTimeout(() => {
            onFinished();
          }, 400);
        };

        setTimeout(() => {
          if (cancelled) return;
          if (!audioRef.current || isNaN(audioRef.current.duration)) {
            const fallbackPerChar = 35;
            let idx = 0;
            if (!typingIntervalRef.current) {
              typingIntervalRef.current = setInterval(() => {
                if (cancelled) return;
                setDisplayText((prev) => prev + textToSpeak.charAt(idx));
                idx++;
                if (idx >= textToSpeak.length) {
                  clearInterval(typingIntervalRef.current);
                  typingIntervalRef.current = null;
                  setTimeout(() => onFinished(), 600);
                }
              }, fallbackPerChar);
            }
            setLoading(false);
            setStatusMsg("Playing (fallback)...");
          }
        }, 4000);
      } catch (err) {
        console.error("TTS generation failed:", err);
        if (!cancelled) {
          setError("Could not generate TTS audio. Showing text only.");
          setLoading(false);
          setStatusMsg("Fallback: showing script text.");
          const fallbackText = buildScript(mood);
          setScriptText(fallbackText);
          setDisplayText("");
          let i = 0;
          const fallbackSpeed = 30;
          typingIntervalRef.current = setInterval(() => {
            setDisplayText((prev) => prev + fallbackText.charAt(i));
            i++;
            if (i >= fallbackText.length) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
              setTimeout(() => onFinished(), 800);
            }
          }, fallbackSpeed);
        }
      }
    };

    generateAndPlay();

    return () => {
      cancelled = true;
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch (e) {}
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tts-root">
      <div className="tts-card">
        <div className="tts-radio-wrapper">
          <div className="tts-bubble">
            <h3 className="tts-title">Thatukkada Radio</h3>
            <p className="tts-sub">Broadcasting your mood — {mood.toUpperCase()}</p>
          </div>
        </div>

        <div className="tts-content-right">
          <div className={`tts-typing ${loading ? "loading" : ""}`}>
            <pre className="tts-pre">
              {displayText}
              <span className="tts-cursor">▌</span>
            </pre>
          </div>

          <div className="tts-status">
            <small>{statusMsg}</small>
            {error && <div className="tts-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}