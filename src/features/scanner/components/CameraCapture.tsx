import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Upload, X } from "lucide-react";

interface CameraCaptureProps {
    onCapture: (file: File, previewUrl: string) => void;
    disabled?: boolean;
}

export const CameraCapture = ({ onCapture, disabled }: CameraCaptureProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [active, setActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setActive(false);
    }, []);

    const startStream = useCallback(async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setActive(true);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "No se pudo acceder a la cámara";
            setError(msg);
            setActive(false);
        }
    }, []);

    useEffect(() => () => stopStream(), [stopStream]);

    const handleSnapshot = useCallback(() => {
        if (!videoRef.current || !active) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], `acta-${Date.now()}.jpg`, { type: "image/jpeg" });
                const previewUrl = URL.createObjectURL(blob);
                stopStream();
                onCapture(file, previewUrl);
            },
            "image/jpeg",
            0.92,
        );
    }, [active, onCapture, stopStream]);

    const handleFile = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const previewUrl = URL.createObjectURL(file);
            onCapture(file, previewUrl);
            e.target.value = "";
        },
        [onCapture],
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative">
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`w-full h-full object-contain ${active ? "block" : "hidden"}`}
                />
                {!active && (
                    <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                        <Camera size={48} />
                        <span>Cámara desactivada</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
                {!active ? (
                    <button
                        type="button"
                        onClick={startStream}
                        disabled={disabled}
                        className="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Camera size={18} />
                        Activar Cámara
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={handleSnapshot}
                            disabled={disabled}
                            className="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Camera size={18} />
                            Capturar Acta
                        </button>
                        <button
                            type="button"
                            onClick={stopStream}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                        >
                            <X size={18} />
                            Detener
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
                >
                    <Upload size={18} />
                    Subir Imagen
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
        </div>
    );
};

export const PreviewImage = ({
    url,
    onRetake,
}: {
    url: string;
    onRetake: () => void;
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
            <img src={url} alt="Acta capturada" className="w-full h-full object-contain" />
        </div>
        <button
            type="button"
            onClick={onRetake}
            className="mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
        >
            <RotateCcw size={16} />
            Volver a capturar
        </button>
    </div>
);
