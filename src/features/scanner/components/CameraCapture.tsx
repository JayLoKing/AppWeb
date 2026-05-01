import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Check } from "lucide-react";

interface Props {
    onCapture: (file: File) => void;
}

export const CameraCapture = ({ onCapture }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        setError(null);
        setSnapshot(null);
        try {
            const s = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false,
            });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
                await videoRef.current.play();
            }
        } catch (e: any) {
            setError(e?.message ?? "No se pudo acceder a la cámara. Verifica los permisos del navegador.");
        }
    };

    const stopCamera = () => {
        stream?.getTracks().forEach((t) => t.stop());
        setStream(null);
    };

    useEffect(() => () => stopCamera(), []); // cleanup on unmount

    const takeSnapshot = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setSnapshot(dataUrl);
        stopCamera();
    };

    const useSnapshot = async () => {
        if (!snapshot) return;
        const blob = await (await fetch(snapshot)).blob();
        const file = new File([blob], `acta-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
    };

    return (
        <div className="space-y-4">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                {snapshot ? (
                    <img src={snapshot} alt="Captura" className="w-full h-full object-contain" />
                ) : stream ? (
                    <video ref={videoRef} className="w-full h-full object-contain" playsInline muted />
                ) : (
                    <div className="text-center text-gray-300">
                        <Camera size={48} className="mx-auto mb-3 opacity-60" />
                        <p className="text-sm">Cámara desactivada</p>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                {!stream && !snapshot && (
                    <button
                        onClick={startCamera}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                    >
                        <Camera size={18} /> Activar cámara
                    </button>
                )}
                {stream && (
                    <button
                        onClick={takeSnapshot}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                    >
                        <Camera size={18} /> Capturar
                    </button>
                )}
                {snapshot && (
                    <>
                        <button
                            onClick={useSnapshot}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                        >
                            <Check size={18} /> Usar esta captura
                        </button>
                        <button
                            onClick={startCamera}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium"
                        >
                            <RotateCcw size={18} /> Reintentar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
