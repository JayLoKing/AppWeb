import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { Users } from "lucide-react";

export const ParticipacionPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["participacion"],
        queryFn: () => dashboardService.getParticipacion().then((r) => r.data),
        refetchInterval: 60000,
    });

    if (isLoading) return <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />;
    if (!data) return null;

    if (!data.available) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                    <Users size={20} className="text-teal-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Participación Electoral</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {data.message ?? "Datos de participación no disponibles aún"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
                <Users size={20} className="text-teal-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Participación Electoral</h3>
            </div>
            <div className="flex flex-wrap gap-4">
                {data.labels.map((label, i) => (
                    <div key={label} className="flex flex-col items-center bg-teal-50 dark:bg-teal-900/20 rounded-lg px-4 py-2">
                        <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                            {data.datasets[0]?.data[i]?.toFixed(1) ?? "—"}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                    </div>
                ))}
                {data.raw && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 self-center">
                        {new Intl.NumberFormat("es-BO").format(data.raw.total_votos)} votos de {new Intl.NumberFormat("es-BO").format(data.raw.total_habilitados)} habilitados
                    </div>
                )}
            </div>
        </div>
    );
};
