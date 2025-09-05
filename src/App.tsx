import FileInput from "./components/FileInput";
import TeleprompterScreen from "./components/TeleprompterScreen";
import Controls from "./components/Controls";
import { useState, useEffect, useRef, useCallback } from "react";

const App = () => {
  const [texto, setTexto] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mirror, setMirror] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState("#F5E3E0");
  const [bgColor, setBgColor] = useState("#33282e");

  const teleprompterRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    console.log("Cliquei no Play!");
    setIsPlaying((prev) => !prev);
  };
  const changeSpeed = (delta: number) =>
    setSpeed((prev) => Math.max(0.5, Math.min(prev + delta, 10)));
  const toggleMirror = () => setMirror((prev) => !prev);

  const enterFullscreen = () => {
    const el = teleprompterRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen();
      setTimeout(() => el.focus && el.focus(), 100);
    }
  };
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      setSpeed((prev) => Math.max(0.5, Math.min(prev + 0.5, 10)));
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      setSpeed((prev) => Math.max(0.5, Math.min(prev - 0.5, 10)));
    }
    if (e.code === "KeyM") {
      e.preventDefault();
      setMirror((prev) => !prev);
    }
    if (e.code === "KeyF") {
      e.preventDefault();
      enterFullscreen();
    }
    if (e.code === "Escape") {
      e.preventDefault();
      exitFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    function onFullscreenChange() {
      const el = teleprompterRef.current;
      if (document.fullscreenElement && el) {
        // Foca o elemento E adiciona listener SÓ nele
        el.focus && el.focus();
        el.addEventListener("keydown", handleKeyDown);
        // Remove o do window pra não duplicar
        window.removeEventListener("keydown", handleKeyDown);
      } else {
        // Saiu do fullscreen, volta pro window
        window.addEventListener("keydown", handleKeyDown);
        const el = teleprompterRef.current;
        el && el.removeEventListener("keydown", handleKeyDown);
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      const el = teleprompterRef.current;
      el && el.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="container">
      <h1>Teleprompter</h1>
      <FileInput onTextLoaded={setTexto} />
      <div className="font-controls-row">
        <label className="fancy-label">
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
            className="fancy-select"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </label>
        <label className="fancy-label">
          <input
            type="number"
            min={16}
            max={120}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="fancy-select"
            style={{ width: 80 }}
          />
        </label>
        <label className="fancy-label">
          <input
            type="color"
            value={fontColor}
            onChange={e => setFontColor(e.target.value)}
            className="fancy-select"
            style={{ width: 44, padding: 3 }}
          />
        </label>
        <label className="fancy-label">
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="fancy-select"
            style={{ width: 44, padding: 3 }}
          />
        </label>
      </div>
      <TeleprompterScreen
        texto={texto}
        isPlaying={isPlaying}
        speed={speed}
        mirror={mirror}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontColor={fontColor}
        bgColor={bgColor}
        ref={teleprompterRef}
      />
      <Controls
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        speed={speed}
        changeSpeed={changeSpeed}
        enterFullscreen={enterFullscreen}
        mirror={mirror}
        toggleMirror={toggleMirror}
      />
      <div style={{ opacity: 0.7, fontSize: 14, marginTop: 18 }}>
        <strong>Atalhos: </strong>
        Espaço = Play/Pause &nbsp;&nbsp;
        ↑↓ = Velocidade &nbsp;&nbsp;
        <b>M</b> = Espelhar Texto &nbsp;&nbsp;
        <b>F</b> = Tela cheia &nbsp;&nbsp;
        <b>ESC</b> = Sair da tela cheia
      </div>
    </div>
  );
};

export default App;
