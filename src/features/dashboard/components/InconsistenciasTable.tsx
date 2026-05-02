import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

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

export const InconsistenciasTable = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["inconsistencias"],
        queryFn: () => dashboardService.getInconsistencias(),
    });

    if (isLoading)
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (!data) return null;

    const rows = data.inconsistencias ?? [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Inconsistencias detectadas{" "}
                    {rows.length > 0 && (
                        <span className="text-gray-400 font-normal">({rows.length})</span>
                    )}
                </h3>
            </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                    No hay inconsistencias detectadas.
                                </td>
                            </tr>
                        )}
                        {rows.map((row, i) => {
                            const color = ESTADO_COLOR[row.estado_comparacion] ?? "#888";
                            const sev = row.inconsistencias?.[0]?.severidad;
                            const sevColor = sev ? SEVERIDAD_COLOR[sev] : null;
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
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {row.diferencias?.diferencia_total_votos ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {sev && sevColor ? <Pill value={sev} color={sevColor} /> : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
