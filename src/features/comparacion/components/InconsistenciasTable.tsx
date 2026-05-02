import type { ActaComparada } from "../../dashboard/services/dashboardService";

const ESTADO_COLOR: Record<string, string> = {
    CONSISTENTE: "#22c55e",
    INCONSISTENTE: "#ef4444",
    SOLO_RRV: "#f97316",
    SOLO_OFICIAL: "#94a3b8",
};
const SEVERIDAD_COLOR: Record<string, string> = {
    ALTA: "#ef4444",
    MEDIA: "#f97316",
    BAJA: "#eab308",
};

const Pill = ({ value, color }: { value: string; color: string }) => (
    <span
        className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
        style={{ backgroundColor: `${color}20`, color }}
    >
        {value}
    </span>
);

interface Props {
    rows: ActaComparada[];
    total: number;
    pagina: number;
    porPagina: number;
    onPageChange: (page: number) => void;
    onVerDetalle: (actaId: string) => void;
}

export const InconsistenciasTable = ({
    rows,
    total,
    pagina,
    porPagina,
    onPageChange,
    onVerDetalle,
}: Props) => {
    const totalPages = Math.max(1, Math.ceil(total / porPagina));

    if (!rows.length) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center text-gray-500">
                No hay inconsistencias con los filtros actuales.
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            <th className="px-4 py-3 text-left font-bold">Acta ID</th>
                            <th className="px-4 py-3 text-left font-bold">Departamento</th>
                            <th className="px-4 py-3 text-left font-bold">Municipio</th>
                            <th className="px-4 py-3 text-left font-bold">Recinto</th>
                            <th className="px-4 py-3 text-left font-bold">Mesa</th>
                            <th className="px-4 py-3 text-left font-bold">Estado</th>
                            <th className="px-4 py-3 text-left font-bold">Dif. Votos</th>
                            <th className="px-4 py-3 text-left font-bold">Severidad</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const color = ESTADO_COLOR[row.estado_comparacion] ?? "#888";
                            const sev = row.inconsistencias?.[0]?.severidad;
                            const sevColor = sev ? SEVERIDAD_COLOR[sev] : null;
                            const dif = row.diferencias?.diferencia_total_votos ?? "—";
                            return (
                                <tr
                                    key={row.acta_id || i}
                                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                >
                                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                        {row.acta_id}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {row.departamento || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {row.municipio || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {row.recinto || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {row.mesa || "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Pill value={row.estado_comparacion} color={color} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{dif}</td>
                                    <td className="px-4 py-3">
                                        {sev && sevColor ? <Pill value={sev} color={sevColor} /> : "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => onVerDetalle(row.acta_id)}
                                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1 text-xs font-semibold"
                                        >
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {total} resultados — pág. {pagina} de {totalPages}
                    </span>
                    <button
                        disabled={pagina === 1}
                        onClick={() => onPageChange(pagina - 1)}
                        className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                    >
                        ‹
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1 rounded-md border text-sm ${
                                p === pagina
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        disabled={pagina >= totalPages}
                        onClick={() => onPageChange(pagina + 1)}
                        className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};
