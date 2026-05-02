import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

const Stat = ({ label, value }: { label: string; value: number | string }) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
        </div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</div>
    </div>
);

export const ResultadosOficialesPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["resultadosOficiales"],
        queryFn: () => dashboardService.getResultadosOficiales(),
    });

    if (isLoading)
        return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;

    if (!data)
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Resultados oficiales
                </h3>
                <p className="text-sm text-gray-400">Sin resultados oficiales.</p>
            </div>
        );

    const resumen = data.resumen ?? {};
    const comparativa = data.comparativa ?? [];
    const departamentos = (data.porDepartamento ?? []).slice(0, 5);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Resultados oficiales
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <Stat label="Total actas" value={resumen.totalActas ?? 0} />
                <Stat label="Transcritas" value={resumen.actasTranscritas ?? 0} />
                <Stat label="Observadas" value={resumen.actasObservadas ?? 0} />
            </div>

            {comparativa.length > 0 && (
                <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                <th className="px-3 py-2 text-left font-bold">Candidato</th>
                                <th className="px-3 py-2 text-left font-bold">Votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparativa.map((item, i) => (
                                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                                        {item.candidato}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {item.votos.toLocaleString("es-BO")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {departamentos.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                <th className="px-3 py-2 text-left font-bold">Departamento</th>
                                <th className="px-3 py-2 text-left font-bold">Actas</th>
                                <th className="px-3 py-2 text-left font-bold">Válidos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departamentos.map((item, i) => (
                                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                                        {item.ubicacion}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {item.totalActas}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {item.votosValidos.toLocaleString("es-BO")}
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
