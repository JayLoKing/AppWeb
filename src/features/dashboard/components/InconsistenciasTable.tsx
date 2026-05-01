import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const InconsistenciasTable = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["inconsistencias"],
        queryFn: () => dashboardService.getInconsistencias(),
    });

    if (isLoading) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Actas Inconsistentes Recientes ({data.length})
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3">Acta</th>
                            <th className="px-6 py-3">Departamento</th>
                            <th className="px-6 py-3">Recinto</th>
                            <th className="px-6 py-3">Diferencia</th>
                            <th className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-6 text-center text-gray-400">
                                    Sin inconsistencias detectadas.
                                </td>
                            </tr>
                        )}
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.acta}</td>
                                <td className="px-6 py-4">{item.departamento}</td>
                                <td className="px-6 py-4">{item.recinto}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.diferencia > 0
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                : item.diferencia < 0
                                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {item.diferencia > 0 ? `+${item.diferencia}` : item.diferencia}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.estado === "Resuelto"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {item.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
