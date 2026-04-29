import { useMemo } from "react";
import { Send } from "lucide-react";
import type { ActaUploadDataRequest } from "../models/request/acta-upload";

interface ActaFormProps {
    value: ActaUploadDataRequest;
    onChange: (next: ActaUploadDataRequest) => void;
    onSubmit: () => void;
    submitting: boolean;
    disabled?: boolean;
}

const inputClass =
    "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

export const ActaForm = ({
    value,
    onChange,
    onSubmit,
    submitting,
    disabled,
}: ActaFormProps) => {
    const sumaCalculada = useMemo(
        () =>
            value.candidatos.reduce((acc, c) => acc + (c.votos || 0), 0) +
            (value.votos_nulos || 0) +
            (value.votos_blancos || 0),
        [value],
    );

    const inconsistente = sumaCalculada !== value.total_votos;

    const setField = <K extends keyof ActaUploadDataRequest>(
        key: K,
        v: ActaUploadDataRequest[K],
    ) => onChange({ ...value, [key]: v });

    const setCandidatoVotos = (idx: number, votos: number) => {
        const next = value.candidatos.map((c, i) => (i === idx ? { ...c, votos } : c));
        onChange({ ...value, candidatos: next });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5"
        >
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Registro de Acta RRV
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revisa los datos extraídos por OCR y corrige lo necesario antes de enviar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Código de Acta</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={value.acta_id}
                        onChange={(e) => setField("acta_id", e.target.value)}
                        placeholder="ACTA-1010200001001"
                    />
                </div>
                <div>
                    <label className={labelClass}>Mesa</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={value.mesa}
                        onChange={(e) => setField("mesa", e.target.value)}
                        placeholder="1010200001001"
                    />
                </div>
                <div>
                    <label className={labelClass}>Departamento</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={value.departamento}
                        onChange={(e) => setField("departamento", e.target.value)}
                    />
                </div>
                <div>
                    <label className={labelClass}>Municipio</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={value.municipio}
                        onChange={(e) => setField("municipio", e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Recinto</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={value.recinto}
                        onChange={(e) => setField("recinto", e.target.value)}
                    />
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Votos por candidato
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {value.candidatos.map((c, idx) => (
                        <div key={c.candidato_id}>
                            <label className={labelClass}>
                                {c.nombre}{" "}
                                <span className="text-gray-400 font-normal">({c.candidato_id})</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                className={inputClass}
                                value={c.votos}
                                onChange={(e) =>
                                    setCandidatoVotos(idx, Number(e.target.value) || 0)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Votos Nulos</label>
                    <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={value.votos_nulos}
                        onChange={(e) =>
                            setField("votos_nulos", Number(e.target.value) || 0)
                        }
                    />
                </div>
                <div>
                    <label className={labelClass}>Votos Blancos</label>
                    <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={value.votos_blancos}
                        onChange={(e) =>
                            setField("votos_blancos", Number(e.target.value) || 0)
                        }
                    />
                </div>
                <div>
                    <label className={labelClass}>Total Votos</label>
                    <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={value.total_votos}
                        onChange={(e) =>
                            setField("total_votos", Number(e.target.value) || 0)
                        }
                    />
                </div>
            </div>

            <div
                className={`rounded-lg p-3 text-sm border ${
                    inconsistente
                        ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/40 dark:text-amber-300"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/40 dark:text-emerald-300"
                }`}
            >
                Suma calculada: <strong>{sumaCalculada}</strong> · Total declarado:{" "}
                <strong>{value.total_votos}</strong>
                {inconsistente
                    ? " — los valores no coinciden, el backend marcará el acta como INCONSISTENTE."
                    : " — los totales cuadran."}
            </div>

            <button
                type="submit"
                disabled={submitting || disabled}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors"
            >
                <Send size={18} />
                {submitting ? "Enviando..." : "Registrar Acta"}
            </button>
        </form>
    );
};
