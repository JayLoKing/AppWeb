import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { MapPin } from "lucide-react";

type GroupBy = "departamento" | "municipio" | "recinto";

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
    { value: "departamento", label: "Departamento" },
    { value: "municipio", label: "Municipio" },
    { value: "recinto", label: "Recinto" },
];

export const GeograficoPanel = () => {
    const [groupBy, setGroupBy] = useState<GroupBy>("departamento");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["geografico", groupBy],
        queryFn: () => dashboardService.getGeografico(groupBy).then((r) => r.data),
        refetchInterval: 30000,
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <MapPin className="text-blue-500" size={22} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avance Geográfico</h3>
                </div>
                <div className="flex gap-1">
                    {GROUP_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setGroupBy(opt.value)}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${
                                groupBy === opt.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="space-y-3 animate-pulse">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                </div>
            )}

            {isError && (
                <p className="text-red-500 text-sm">Error cargando datos geográficos</p>
            )}

            {data && (
                <>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                        Total actas: <span className="font-medium text-gray-600 dark:text-gray-300">{new Intl.NumberFormat("es-BO").format(data.total)}</span>
                    </p>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                        {data.items.map((item, i) => {
                            const pct = data.total > 0 ? Math.round((item.consistentes / (item.total_actas || 1)) * 100) : 0;
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[55%]">{item.nombre}</span>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                                            {item.consistentes}/{item.total_actas} actas ({pct}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    {item.inconsistentes > 0 && (
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                                            {item.inconsistentes} inconsistentes · {item.solo_rrv} solo RRV · {item.solo_oficial} solo oficial
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};
