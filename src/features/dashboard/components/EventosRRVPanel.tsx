import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const EventosRRVPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["eventosRRV"],
        queryFn: () => dashboardService.getEventosRRV(),
    });

    if (isLoading)
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;

    const eventos = data?.eventos ?? [];
    const total = data?.total_eventos ?? eventos.length;
    const coleccion = data?.coleccion ?? "rrv_eventos";

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Eventos RRV</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {total} eventos en {coleccion}
            </p>

            {eventos.length === 0 ? (
                <p className="text-sm text-gray-400">Sin eventos RRV.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                <th className="px-3 py-2 text-left font-bold">Tipo</th>
                                <th className="px-3 py-2 text-left font-bold">Acta</th>
                                <th className="px-3 py-2 text-left font-bold">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.slice(0, 6).map((evento, i) => (
                                <tr
                                    key={`${evento.acta_id ?? "evento"}-${i}`}
                                    className="border-t border-gray-100 dark:border-gray-700"
                                >
                                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                                        {evento.tipo_evento}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {evento.acta_id || "—"}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {evento.fecha_evento
                                            ? new Date(evento.fecha_evento).toLocaleString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
