import Tesseract from "tesseract.js";
import type { ActaUploadDataRequest, CandidatoRequest } from "../models/request/acta-upload";

export interface OcrProgress {
    status: string;
    progress: number;
}

export interface OcrResult {
    rawText: string;
    parsed: ActaUploadDataRequest;
}

const KNOWN_CANDIDATES = [
    { id: "CAND-01", nombre: "Candidato 1" },
    { id: "CAND-02", nombre: "Candidato 2" },
    { id: "CAND-03", nombre: "Candidato 3" },
    { id: "CAND-04", nombre: "Candidato 4" },
];

const num = (s: string | undefined) => {
    if (!s) return 0;
    const cleaned = s.replace(/[^\d-]/g, "");
    const n = parseInt(cleaned, 10);
    return Number.isFinite(n) ? n : 0;
};

const findValueByLabel = (text: string, labels: string[]): string => {
    for (const label of labels) {
        const re = new RegExp(`${label}\\s*[:\\-]?\\s*([^\\n\\r]+)`, "i");
        const m = text.match(re);
        if (m && m[1]) return m[1].trim().replace(/[|]+$/, "").trim();
    }
    return "";
};

const findNumberByLabel = (text: string, labels: string[]): number => {
    for (const label of labels) {
        const re = new RegExp(`${label}\\s*[:\\-]?\\s*([\\d.,]+)`, "i");
        const m = text.match(re);
        if (m && m[1]) return num(m[1]);
    }
    return 0;
};

export const parseActaText = (raw: string): ActaUploadDataRequest => {
    const text = raw.replace(/\r/g, "");

    const actaIdMatch =
        text.match(/ACTA[\s:#-]*([A-Z0-9-]{6,})/i) ||
        text.match(/C[oó]digo\s*Acta\s*[:\-]?\s*([A-Z0-9-]+)/i);
    const acta_id = actaIdMatch ? actaIdMatch[1].trim() : "";

    const departamento = findValueByLabel(text, ["Departamento", "DEPARTAMENTO", "DEP"]);
    const municipio = findValueByLabel(text, ["Municipio", "MUNICIPIO", "MUN"]);
    const recinto = findValueByLabel(text, ["Recinto", "RECINTO", "REC"]);
    const mesa =
        findValueByLabel(text, ["Mesa", "MESA", "Nro Mesa", "N° Mesa"]) ||
        (acta_id.match(/(\d{13})/)?.[1] ?? "");

    const candidatos: CandidatoRequest[] = KNOWN_CANDIDATES.map((c, i) => {
        const idx = i + 1;
        const labels = [
            `C${idx}`,
            `P${idx}`,
            `Candidato\\s*${idx}`,
            `${c.nombre.replace(/\s/g, "\\s*")}`,
        ];
        return {
            candidato_id: c.id,
            nombre: c.nombre,
            votos: findNumberByLabel(text, labels),
        };
    });

    const votos_nulos = findNumberByLabel(text, ["Votos\\s*Nulos", "NULOS", "Nulos"]);
    const votos_blancos = findNumberByLabel(text, ["Votos\\s*Blancos", "BLANCOS", "Blancos"]);
    let total_votos = findNumberByLabel(text, [
        "Total\\s*Votos",
        "TOTAL",
        "Papeletas\\s*Anfora",
        "Papeletas\\s*Ánfora",
    ]);
    if (!total_votos) {
        total_votos =
            candidatos.reduce((acc, c) => acc + c.votos, 0) + votos_nulos + votos_blancos;
    }

    return {
        acta_id,
        departamento,
        municipio,
        recinto,
        mesa,
        candidatos,
        votos_nulos,
        votos_blancos,
        total_votos,
    };
};

export const runOcrOnImage = async (
    image: File | Blob | string,
    onProgress?: (p: OcrProgress) => void,
): Promise<OcrResult> => {
    const result = await Tesseract.recognize(image, "spa+eng", {
        logger: (m) => {
            if (onProgress && typeof m.progress === "number") {
                onProgress({ status: m.status, progress: m.progress });
            }
        },
    });
    const rawText = result.data.text || "";
    return { rawText, parsed: parseActaText(rawText) };
};

export const emptyActaData = (): ActaUploadDataRequest => ({
    acta_id: "",
    departamento: "",
    municipio: "",
    recinto: "",
    mesa: "",
    candidatos: KNOWN_CANDIDATES.map((c) => ({
        candidato_id: c.id,
        nombre: c.nombre,
        votos: 0,
    })),
    votos_nulos: 0,
    votos_blancos: 0,
    total_votos: 0,
});
