import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { Activity, Database, Server, ShieldCheck } from "lucide-react";

const StatusPill = ({ status }: { status: string }) => {
    const ok = status === "connected";
    return (
        <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                ok
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            }`}
        >
            {ok ? "OK" : status}
        </span>
    );
};

export const TecnicoPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["tecnico"],
        queryFn: () => dashboardService.getTecnico(),
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
                    <Database className="text-green-500 dark:text-green-400" size={20} />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            PostgreSQL <StatusPill status={data.postgres} />
                        </p>
                        <p className="text-sm font-semibold dark:text-white">{data.totalActasPg.toLocaleString()} actas</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <Database className="text-blue-500 dark:text-blue-400" size={20} />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            MongoDB (RRV) <StatusPill status={data.mongo} />
                        </p>
                        <p className="text-sm font-semibold dark:text-white">{data.totalActasRrv.toLocaleString()} actas</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500 dark:text-emerald-400" size={20} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Seguridad</p>
                        <p className="text-sm font-semibold dark:text-white">JWT activo</p>
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
