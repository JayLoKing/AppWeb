import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { ActaPayload } from "../models/acta";
import { emptyActa } from "../models/acta";

interface Props {
    initial?: ActaPayload | null;
    onSubmit: (acta: ActaPayload) => void;
    submitting?: boolean;
    submitLabel?: string;
}

const numberField = (key: keyof ActaPayload, label: string, min = 0) => ({ key, label, min });

const FIELDS_VOTOS = [
    numberField("p1", "P1"),
    numberField("p2", "P2"),
    numberField("p3", "P3"),
    numberField("p4", "P4"),
    numberField("votosValidos", "Votos válidos"),
    numberField("votosNulos", "Votos nulos"),
    numberField("votosBlanco", "Votos blancos"),
    numberField("papeletasAnfora", "Papeletas en ánfora"),
    numberField("papeletasNoUsadas", "Papeletas no usadas"),
];

const FIELDS_HORARIO = [
    numberField("aperturaHora", "Apertura - Hora"),
    numberField("aperturaMinutos", "Apertura - Min"),
    numberField("cierreHora", "Cierre - Hora"),
    numberField("cierreMinutos", "Cierre - Min"),
];

export const ActaForm = ({ initial, onSubmit, submitting, submitLabel = "Enviar transcripción" }: Props) => {
    const [form, setForm] = useState<ActaPayload>(() => initial ?? emptyActa());

    useEffect(() => {
        if (initial) setForm(initial);
    }, [initial]);

    const update = <K extends keyof ActaPayload>(key: K, value: ActaPayload[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validation = useMemo(() => {
        const errors: string[] = [];
        if (!form.codigoActa || form.codigoActa <= 0) errors.push("El código de acta es obligatorio.");
        const sumaP = form.p1 + form.p2 + form.p3 + form.p4;
        if (form.votosValidos > 0 && sumaP !== form.votosValidos) {
            errors.push(`P1+P2+P3+P4 (${sumaP}) debe coincidir con votos válidos (${form.votosValidos}).`);
        }
        return errors;
    }, [form]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validation.length) return;
        onSubmit(form);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código del acta <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={form.codigoActa || ""}
                    onChange={(e) => update("codigoActa", Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm text-gray-900 dark:text-gray-100"
                    placeholder="1010200001001"
                    required
                />
            </div>

            <fieldset>
                <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Conteo de votos</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FIELDS_VOTOS.map(({ key, label }) => (
                        <div key={key}>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                            <input
                                type="number"
                                min={0}
                                value={form[key] as number}
                                onChange={(e) => update(key, Number(e.target.value) as never)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm"
                            />
                        </div>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Horarios</legend>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FIELDS_HORARIO.map(({ key, label }) => (
                        <div key={key}>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                            <input
                                type="number"
                                min={0}
                                value={form[key] as number}
                                onChange={(e) => update(key, Number(e.target.value) as never)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm"
                            />
                        </div>
                    ))}
                </div>
            </fieldset>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observaciones</label>
                <textarea
                    rows={3}
                    value={form.observaciones}
                    onChange={(e) => update("observaciones", e.target.value)}
                    placeholder="Si hay observaciones, el acta se marcará como observada y no contará en resultados oficiales."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm"
                />
            </div>

            {validation.length > 0 && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-3 text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    {validation.map((msg) => (
                        <div key={msg} className="flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {msg}
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || validation.length > 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-lg text-sm"
            >
                {submitting ? "Enviando..." : submitLabel}
            </button>
        </form>
    );
};
