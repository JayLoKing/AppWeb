import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { useState } from "react";
import { AnimatedCard } from "../../../components/AnimatedCard";

type GroupBy = "departamento" | "municipio" | "recinto";

const Badge = ({ value, color }: { value: number; color: string }) => (
    <span
        className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: `${color}20`, color }}
    >
        {value}
    </span>
);

export const GeograficoPanel = () => {
    const [groupBy, setGroupBy] = useState<GroupBy>("departamento");
    const { data, isLoading } = useQuery({
        queryKey: ["geografico", groupBy],
        queryFn: () => dashboardService.getGeografico(groupBy),
    });

    return (
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4 gap-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Distribución geográfica
                </h3>
                <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="departamento">Por departamento</option>
                    <option value="municipio">Por municipio</option>
                    <option value="recinto">Por recinto</option>
                </select>
            </div>

            {isLoading ? (
                <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
            ) : !data?.items?.length ? (
                <p className="text-sm text-gray-400 py-6 text-center">Sin datos geográficos.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                <th className="px-3 py-2 text-left font-bold">
                                    {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                                </th>
                                <th className="px-3 py-2 text-left font-bold">Total</th>
                                <th className="px-3 py-2 text-left font-bold">Consistentes</th>
                                <th className="px-3 py-2 text-left font-bold">Inconsistentes</th>
                                <th className="px-3 py-2 text-left font-bold">Solo RRV</th>
                                <th className="px-3 py-2 text-left font-bold">Solo Oficial</th>
                                <th className="px-3 py-2 text-left font-bold">Dif. Votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, i) => (
                                <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                                        {item.nombre}
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {item.total_actas}
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge value={item.consistentes} color="#22c55e" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge value={item.inconsistentes} color="#ef4444" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge value={item.solo_rrv} color="#f97316" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Badge value={item.solo_oficial} color="#94a3b8" />
                                    </td>
                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                        {item.diferencia_total_votos}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AnimatedCard>
    );
};
