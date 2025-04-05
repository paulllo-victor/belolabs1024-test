import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import LevelSelectModal from "../components/LevelSelectModal";
import backgroundGif from "../assets/images/play.gif";
import calmBackground from "../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../assets/audio/background-music.mp3";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import buttonClickSound from "../assets/audio/button-click.mp3";
import { X } from "lucide-react";
import "./Play.css";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const Play = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isCalmMode, setIsCalmMode] = useState(false);
  
  const [bgVolume, setBgVolume] = useState(
    localStorage.getItem("bgVolume") !== null ? parseInt(localStorage.getItem("bgVolume"), 10) : 50
  );
  const [sfxVolume, setSfxVolume] = useState(
    localStorage.getItem("sfxVolume") !== null ? parseInt(localStorage.getItem("sfxVolume"), 10) : 50
  );

  const [mutedBg, setMutedBg] = useState(false);
  const [mutedSfx, setMutedSfx] = useState(false);

  const bgAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic);
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);

    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true;
    bgAudio.volume = bgVolume / 100;

    const startMusic = () => {
      bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
    };

    document.addEventListener("click", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume / 100;
    }
    localStorage.setItem("bgVolume", bgVolume);
  }, [bgVolume]);

  useEffect(() => {
    hoverAudioRef.current.volume = sfxVolume / 100;
    clickAudioRef.current.volume = sfxVolume / 100;
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

  const handleBgVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setBgVolume(newVolume);
    setMutedBg(newVolume === 0);
  };

  const handleSfxVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setSfxVolume(newVolume);
    setMutedSfx(newVolume === 0);
  };

  const toggleCalmMode = () => {
    setIsCalmMode((prev) => !prev);
    playClickSound();
  };

  const playHoverSound = () => {
    if (!mutedSfx) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch((error) =>
        console.error("Hover sound playback failed:", error)
      );
    }
  };

  const playClickSound = () => {
    if (!mutedSfx) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch((error) =>
        console.error("Click sound playback failed:", error)
      );
    }
  };

  const handlePlayClick = () => {
    playClickSound();
    setIsLevelSelectOpen(true);
  };

  const handleHistoryClick = () => {
    playClickSound();
    navigate('/history');
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
      }}
    >
      <h1 className="game-title">Memory Game</h1>

      <div className="button-container">
        <button
          className="play-button"
          onClick={handlePlayClick}
          onMouseEnter={playHoverSound}
        >
          Play Game
        </button>
        <button
          className="history-button"
          onClick={handleHistoryClick}
          onMouseEnter={playHoverSound}
        >
          History
        </button>
        <button
          className="settings-button"
          onClick={() => {
            playClickSound();
            setIsSettingsOpen(true);
          }}
          onMouseEnter={playHoverSound}
        >
          Settings
        </button>
      </div>

      <Modal
        isOpen={isSettingsOpen}
        onRequestClose={() => setIsSettingsOpen(false)}
        style={modalStyles}
        contentLabel="Settings Modal"
      >
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-h2">Settings</h2>
            <div className="settings-content">
              <div className="volume-control">
                <label>Background Music</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgVolume}
                  onChange={handleBgVolumeChange}
                />
              </div>
              <div className="volume-control">
                <label>Sound Effects</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={handleSfxVolumeChange}
                />
              </div>
              <div className="calm-mode-toggle">
                <label className="calm-mode-label">Calm Mode</label>
                <div className="toggle-container">
                  <span className="toggle-label">OFF</span>
                  <button
                    className={`toggle-button ${isCalmMode ? "active" : ""}`}
                    onClick={toggleCalmMode}
                  >
                    <span className="toggle-handle"></span>
                  </button>
                  <span className="toggle-label">ON</span>
                </div>
              </div>
            </div>
            <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>
              <X />
            </button>
          </div>
        </div>
      </Modal>

      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
      />
    </div>
  );
};

export default Play;
