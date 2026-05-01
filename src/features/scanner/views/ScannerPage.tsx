import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Camera, Upload, FilePlus2, CheckCircle2, AlertTriangle, Loader2, ScanLine, LogIn } from "lucide-react";
import { CameraCapture } from "../components/CameraCapture";
import { FileDropzone } from "../components/FileDropzone";
import { ActaForm } from "../components/ActaForm";
import { scannerService } from "../services/scannerService";
import { type ActaPayload, ocrToActa } from "../models/acta";
import { useAuthStore } from "../../auth/hooks/useAuthStore";

type Mode = "camera" | "upload" | "manual";

interface FlowState {
    file: File | null;
    ocrLoading: boolean;
    ocrError: string | null;
    extracted: ActaPayload | null;
    sending: boolean;
    sendError: string | null;
    result: { ok: boolean; message: string; estado?: string } | null;
}

const initialFlow: FlowState = {
    file: null,
    ocrLoading: false,
    ocrError: null,
    extracted: null,
    sending: false,
    sendError: null,
    result: null,
};

const TABS: { id: Mode; label: string; icon: typeof Camera; desc: string }[] = [
    { id: "camera", label: "Cámara", icon: Camera, desc: "Captura un acta usando la cámara del dispositivo." },
    { id: "upload", label: "Subir archivo", icon: Upload, desc: "PDF, JPG o PNG hasta 10 MB." },
    { id: "manual", label: "Manual", icon: FilePlus2, desc: "Ingresa los datos a mano si el OCR falla." },
];

export const ScannerPage = () => {
    const [mode, setMode] = useState<Mode>("camera");
    const [flow, setFlow] = useState<FlowState>(initialFlow);

    const reset = () => setFlow(initialFlow);

    const handleFile = async (file: File) => {
        setFlow({ ...initialFlow, file, ocrLoading: true });
        try {
            const ocr = await scannerService.transcribirArchivo(file);
            setFlow((prev) => ({
                ...prev,
                ocrLoading: false,
                extracted: ocrToActa(ocr),
            }));
        } catch (err) {
            const msg =
                axios.isAxiosError(err) && (err.response?.data as { error?: string })?.error
                    ? (err.response?.data as { error: string }).error
                    : "No se pudo procesar el archivo. Puedes editar manualmente los datos a continuación.";
            setFlow((prev) => ({
                ...prev,
                ocrLoading: false,
                ocrError: msg,
                extracted: { ...((prev.extracted as ActaPayload) ?? ({} as ActaPayload)) } as ActaPayload,
            }));
        }
    };

    const handleSubmit = async (payload: ActaPayload) => {
        setFlow((prev) => ({ ...prev, sending: true, sendError: null, result: null }));
        try {
            const resp = await scannerService.enviarTranscripcion(payload);
            setFlow((prev) => ({
                ...prev,
                sending: false,
                result: {
                    ok: resp.ok,
                    estado: resp.estado,
                    message: `Acta #${resp.id} registrada como ${resp.estado.toUpperCase()}.`,
                },
            }));
        } catch (err) {
            const msg =
                axios.isAxiosError(err) && (err.response?.data as { error?: string })?.error
                    ? (err.response?.data as { error: string }).error
                    : "No se pudo enviar al webhook de transcripción. Verifica la configuración del endpoint.";
            setFlow((prev) => ({ ...prev, sending: false, sendError: msg }));
        }
    };

    const showForm = Boolean(flow.extracted || flow.ocrError);
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            {/* Top bar (sustituye al MainLayout) */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            CE
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">Cómputo Electoral</span>
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            to="/dashboard"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Ir al dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/auth/login"
                            className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg"
                        >
                            <LogIn size={16} /> Ingresar
                        </Link>
                    )}
                </div>
            </nav>

            <div className="p-6 md:p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                <ScanLine className="text-blue-600" /> Escanear Acta
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Captura, sube o ingresa el acta. La transcripción se envía al webhook configurado.
                            </p>
                        </div>
                        {flow.result && (
                            <button
                                onClick={reset}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
                            >
                                Nueva acta
                            </button>
                        )}
                    </header>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const active = mode === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setMode(t.id);
                                    reset();
                                }}
                                className={`flex flex-col md:flex-row items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                <Icon size={18} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">{TABS.find((t) => t.id === mode)?.desc}</p>

                {/* Resultado final */}
                {flow.result && (
                    <div
                        className={`rounded-xl p-5 border flex items-start gap-3 ${
                            flow.result.ok
                                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                        }`}
                    >
                        <CheckCircle2 className="mt-0.5" />
                        <div>
                            <p className="font-semibold">Transcripción registrada</p>
                            <p className="text-sm">{flow.result.message}</p>
                        </div>
                    </div>
                )}

                {/* Captura */}
                {!flow.result && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        {mode === "camera" && <CameraCapture onCapture={handleFile} />}
                        {mode === "upload" && <FileDropzone onFile={handleFile} />}
                        {mode === "manual" && (
                            <ActaForm
                                onSubmit={handleSubmit}
                                submitting={flow.sending}
                                submitLabel="Enviar al webhook de transcripción"
                            />
                        )}
                    </div>
                )}

                {/* Estado OCR */}
                {flow.ocrLoading && (
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-4 rounded-xl">
                        <Loader2 className="animate-spin" />
                        <span className="text-sm">Procesando archivo en el servicio de OCR…</span>
                    </div>
                )}

                {flow.ocrError && (
                    <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 p-4 rounded-xl">
                        <AlertTriangle className="mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium">Falló la transcripción automática.</p>
                            <p>{flow.ocrError}</p>
                            <p className="mt-1">Continúa completando los datos a mano para enviarlos al webhook.</p>
                        </div>
                    </div>
                )}

                {/* Preview / edit post-OCR */}
                {!flow.result && mode !== "manual" && showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Revisa y confirma los datos
                        </h2>
                        <ActaForm
                            initial={flow.extracted}
                            onSubmit={handleSubmit}
                            submitting={flow.sending}
                            submitLabel="Confirmar y enviar"
                        />
                    </div>
                )}

                {flow.sendError && (
                    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl">
                        <AlertTriangle className="mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium">Error al enviar la transcripción.</p>
                            <p>{flow.sendError}</p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};
