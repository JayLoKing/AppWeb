import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { Activity, Database, Server, Shield } from "lucide-react";

const StatusBadge = ({ estado }: { estado: string }) => {
    const ok = estado === "connected";
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ok ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
            {ok ? "Conectado" : estado}
        </span>
    );
};

export const TecnicoPanel = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tecnico"],
        queryFn: () => dashboardService.getTecnico().then((r) => r.data),
        refetchInterval: 30000,
    });

    if (isLoading) return <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />;
    if (isError || !data) return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-red-500 text-sm">Error cargando métricas técnicas</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-purple-500" size={22} />
                Salud del Sistema
            </h3>

            <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="text-blue-500" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">MongoDB (RRV)</p>
                            <p className="text-sm font-medium dark:text-white">
                                {new Intl.NumberFormat("es-BO").format(data.fuentes.mongodb.total_actas)} actas
                            </p>
                        </div>
                    </div>
                    <StatusBadge estado={data.fuentes.mongodb.estado} />
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Server className="text-green-500" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PostgreSQL (Oficial)</p>
                            <p className="text-sm font-medium dark:text-white">
                                {new Intl.NumberFormat("es-BO").format(data.fuentes.postgresql.total_actas)} actas
                            </p>
                        </div>
                    </div>
                    <StatusBadge estado={data.fuentes.postgresql.estado} />
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-2">
                    <Shield className="text-indigo-500" size={18} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Seguridad</p>
                        <p className="text-sm font-medium dark:text-white">
                            JWT {data.seguridad.jwt_required ? "requerido" : "opcional"} · HTTPS {data.seguridad.https_requerido ? "sí" : "no requerido"}
                        </p>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-center gap-2">
                    <Activity className="text-purple-500" size={18} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Módulo Comparación</p>
                        <p className="text-sm font-medium dark:text-white">
                            v{data.modulo_comparacion.version} · {data.modulo_comparacion.cqrs_mode}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
