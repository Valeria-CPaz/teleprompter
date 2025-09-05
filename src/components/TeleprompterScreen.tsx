import React, { useEffect, useRef, forwardRef } from "react";

interface TeleprompterScreenProps {
    texto: string;
    isPlaying: boolean;
    speed: number;
    mirror: boolean;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    bgColor: string;
}

const TeleprompterScreen = forwardRef<HTMLDivElement, TeleprompterScreenProps>(
    (
        { texto, isPlaying, speed, mirror, fontFamily, fontSize, fontColor, bgColor },
        ref
    ) => {
        const containerRef = useRef<HTMLDivElement>(null);

        // Reseta scrollTop SÓ quando o texto muda
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;
            container.scrollTop = 0;
        }, [texto]);

        // Inicia/para scroll automático
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            let interval: any = null;

            // Só scrolla se estiver em play E texto for grande o suficiente
            if (texto.trim() && isPlaying && container.scrollHeight > container.clientHeight) {
                interval = setInterval(() => {
                    // Só scrolla se não chegou no fim
                    if (container.scrollTop + container.clientHeight < container.scrollHeight) {
                        container.scrollTop += speed;
                    }
                }, 40);
            }

            return () => {
                if (interval) clearInterval(interval);
            };
        }, [texto, isPlaying, speed]);

        // Passa a ref pra fullscreen
        useEffect(() => {
            if (!ref || typeof ref !== "object") return;
            // @ts-ignore
            ref.current = containerRef.current;
        }, [ref]);

        useEffect(() => {
            if (document.fullscreenElement && containerRef.current) {
                containerRef.current.focus();
            }
        }, [document.fullscreenElement]);

        return (
            <div className="teleprompter-container">
                <div
                    ref={containerRef}
                    className={`teleprompter${mirror ? " mirror" : ""}`}
                    tabIndex={0}
                    style={{
                        fontFamily,
                        fontSize: `${fontSize}px`,
                        color: fontColor,
                        backgroundColor: bgColor,
                    }}
                >
                    {texto
                        ? texto.split("\n").map((linha, i) => <div key={i}>{linha}</div>)
                        : (
                            <div style={{ opacity: 0.5 }}>
                                Carregue um texto para ver aqui!
                            </div>
                        )}
                </div>
            </div>
        );
    }
);

export default TeleprompterScreen;
