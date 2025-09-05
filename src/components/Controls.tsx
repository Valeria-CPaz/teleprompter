interface ControlsProps {
    isPlaying: boolean;
    togglePlay: () => void;
    speed: number;
    changeSpeed: (delta: number) => void;
    enterFullscreen: () => void;
    mirror: boolean;
    toggleMirror: () => void;
}

export default function Controls({
    isPlaying,
    togglePlay,
    speed,
    changeSpeed,
    enterFullscreen,
    mirror,
    toggleMirror,
}: ControlsProps) {
    return (
        <div className="controls">
            <button onClick={togglePlay}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={() => changeSpeed(-0.5)}>-</button>
            <span>Velocidade: {speed}</span>
            <button onClick={() => changeSpeed(0.5)}>+</button>
            <button onClick={toggleMirror}>
                {mirror ? "Desespelhar" : "Espelhar"}
            </button>
            <button onClick={enterFullscreen}>
                Tela cheia
            </button>
        </div>
    );
}
