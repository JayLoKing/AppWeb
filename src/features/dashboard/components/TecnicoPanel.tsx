import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { Activity, Database, Server, Wifi } from "lucide-react";

export const TecnicoPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['tecnico'],
        queryFn: async () => {
            const { call } = dashboardService.getTecnico();
            const res = await call;
            return res.data;
        }
    });

    if (isLoading) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-purple-500" size={24} />
                Salud del Sistema (Técnico)
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <Wifi className="text-blue-500 dark:text-blue-400" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Latencia SMS</p>
                        <p className="text-sm font-semibold dark:text-white">{data.latenciaSms} s</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <Database className="text-green-500 dark:text-green-400" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Latencia DB</p>
                        <p className="text-sm font-semibold dark:text-white">{data.latenciaDb} ms</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <Activity className="text-red-500 dark:text-red-400" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Errores API</p>
                        <p className="text-sm font-semibold dark:text-white">{data.erroresApi}%</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <Server className="text-indigo-500 dark:text-indigo-400" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                        <p className="text-sm font-semibold dark:text-white">{data.uptime}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
