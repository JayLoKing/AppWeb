import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { CameraCapture, PreviewImage } from "../components/CameraCapture";
import { ActaForm } from "../components/ActaForm";
import { emptyActaData, runOcrOnImage, type OcrProgress } from "../services/ocr.service";
import { scannerService } from "../services/scanner.service";
import type { ActaUploadDataRequest } from "../models/request/acta-upload";
import type {
    ActaUploadErrorResponse,
    ActaUploadResponse,
} from "../models/response/acta-upload-response";
import type { AxiosError } from "axios";

type Stage = "capture" | "ocr" | "review" | "submitting" | "done";

export const ScannerPage = () => {
    const [stage, setStage] = useState<Stage>("capture");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
    const [actaData, setActaData] = useState<ActaUploadDataRequest>(emptyActaData());
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [result, setResult] = useState<ActaUploadResponse | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleCapture = useCallback(async (captured: File, url: string) => {
        setFile(captured);
        setPreviewUrl(url);
        setErrorMsg(null);
        if (!captured.type.startsWith("image/")) {
            setActaData(emptyActaData());
            setErrorMsg("OCR sólo procesa imágenes. Llena los campos manualmente.");
            setStage("review");
            return;
        }
        setStage("ocr");
        try {
            const { parsed } = await runOcrOnImage(captured, (p) => setOcrProgress(p));
            setActaData((prev) => mergeWithDefaults(parsed, prev));
            setStage("review");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error procesando OCR";
            setErrorMsg(`OCR falló: ${msg}. Puedes llenar el formulario manualmente.`);
            setStage("review");
        } finally {
            setOcrProgress(null);
        }
    }, []);

    const handleRetake = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        setActaData(emptyActaData());
        setErrorMsg(null);
        setResult(null);
        setStage("capture");
    }, [previewUrl]);

    const handleSubmit = useCallback(async () => {
        if (!file) {
            setErrorMsg("Falta la imagen del acta.");
            return;
        }
        setErrorMsg(null);
        setStage("submitting");
        const { call, controller } = scannerService.uploadActa(file, actaData);
        try {
            const response = await call;
            setResult(response.data);
            setStage("done");
        } catch (err) {
            const ax = err as AxiosError<ActaUploadErrorResponse>;
            const backendMsg = ax.response?.data?.error;
            const detail = ax.response?.data?.acta_id
                ? ` (acta_id: ${ax.response.data.acta_id})`
                : "";
            setErrorMsg(
                backendMsg
                    ? `Error del servidor: ${backendMsg}${detail}`
                    : ax.message || "Error al enviar el acta",
            );
            setStage("review");
        }
        return () => controller.abort();
    }, [file, actaData]);

    return (
        <div className="p-6 md:p-8 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Escanear Acta
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Captura el acta con la cámara, revisa los datos extraídos y envíala al sistema RRV.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {stage === "capture" && (
                            <CameraCapture onCapture={handleCapture} />
                        )}

                        {stage !== "capture" && previewUrl && (
                            <PreviewImage url={previewUrl} onRetake={handleRetake} />
                        )}

                        {stage === "ocr" && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 flex items-center gap-3 text-blue-800 dark:text-blue-300">
                                <Loader2 className="animate-spin" size={20} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        Procesando OCR... {ocrProgress?.status ?? ""}
                                    </p>
                                    {ocrProgress && (
                                        <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5 mt-2 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-full transition-all"
                                                style={{
                                                    width: `${Math.round(ocrProgress.progress * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {(stage === "review" || stage === "submitting") && (
                            <ActaForm
                                value={actaData}
                                onChange={setActaData}
                                onSubmit={handleSubmit}
                                submitting={stage === "submitting"}
                            />
                        )}

                        {errorMsg && stage !== "submitting" && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 flex items-start gap-3 text-red-800 dark:text-red-300">
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm">{errorMsg}</p>
                            </div>
                        )}

                        {stage === "done" && result && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 space-y-3">
                                <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                                    <CheckCircle2 size={28} />
                                    <h3 className="text-lg font-semibold">Acta registrada</h3>
                                </div>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-gray-500 dark:text-gray-400">ID interno</dt>
                                    <dd className="font-mono text-gray-900 dark:text-gray-100 truncate">
                                        {result.id}
                                    </dd>
                                    <dt className="text-gray-500 dark:text-gray-400">Acta ID</dt>
                                    <dd className="font-mono text-gray-900 dark:text-gray-100">
                                        {result.acta_id}
                                    </dd>
                                    <dt className="text-gray-500 dark:text-gray-400">Estado</dt>
                                    <dd>
                                        <span
                                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                result.estado === "PROCESADA"
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                            }`}
                                        >
                                            {result.estado}
                                        </span>
                                    </dd>
                                    <dt className="text-gray-500 dark:text-gray-400">Total votos</dt>
                                    <dd className="text-gray-900 dark:text-gray-100">
                                        {result.total_votos}
                                    </dd>
                                </dl>
                                <button
                                    type="button"
                                    onClick={handleRetake}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5"
                                >
                                    Escanear otra acta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mergeWithDefaults = (
    parsed: ActaUploadDataRequest,
    fallback: ActaUploadDataRequest,
): ActaUploadDataRequest => ({
    acta_id: parsed.acta_id || fallback.acta_id,
    departamento: parsed.departamento || fallback.departamento,
    municipio: parsed.municipio || fallback.municipio,
    recinto: parsed.recinto || fallback.recinto,
    mesa: parsed.mesa || fallback.mesa,
    candidatos: parsed.candidatos.map((c, i) => ({
        candidato_id: c.candidato_id || fallback.candidatos[i]?.candidato_id || `CAND-0${i + 1}`,
        nombre: c.nombre || fallback.candidatos[i]?.nombre || `Candidato ${i + 1}`,
        votos: c.votos || fallback.candidatos[i]?.votos || 0,
    })),
    votos_nulos: parsed.votos_nulos || fallback.votos_nulos,
    votos_blancos: parsed.votos_blancos || fallback.votos_blancos,
    total_votos: parsed.total_votos || fallback.total_votos,
});
