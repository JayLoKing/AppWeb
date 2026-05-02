import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-100 dark:border-gray-700">
        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {label}
        </div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{children}</div>
    </div>
);

const Dot = ({ ok }: { ok: boolean }) => (
    <span
        className={`inline-block w-2 h-2 rounded-full mr-2 ${ok ? "bg-green-500" : "bg-red-500"}`}
    />
);

export const TecnicoPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["tecnico"],
        queryFn: () => dashboardService.getTecnico(),
    });

    if (isLoading)
        return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (!data) return null;

    const pgOk = data.fuentes?.postgresql?.estado === "connected";
    const mgOk = data.fuentes?.mongodb?.estado === "connected";

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Estado técnico del sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Item label="PostgreSQL (Oficial)">
                    <Dot ok={pgOk} />
                    {pgOk ? "Conectado" : "Error"}
                    {data.fuentes?.postgresql?.total_actas != null && (
                        <span className="text-gray-500 dark:text-gray-400 font-normal">
                            {" "}
                            — {data.fuentes.postgresql.total_actas.toLocaleString()} actas
                        </span>
                    )}
                </Item>
                <Item label="MongoDB (RRV)">
                    <Dot ok={mgOk} />
                    {mgOk ? "Conectado" : "Error"}
                    {data.fuentes?.mongodb?.total_actas != null && (
                        <span className="text-gray-500 dark:text-gray-400 font-normal">
                            {" "}
                            — {data.fuentes.mongodb.total_actas.toLocaleString()} actas
                        </span>
                    )}
                </Item>
                <Item label="Autenticación">
                    {data.seguridad?.jwt_required ? "JWT requerido" : "Sin autenticación"}
                </Item>
                <Item label="Módulo comparación">
                    {data.modulo_comparacion?.cqrs_mode === "query_only"
                        ? "CQRS — Solo lectura"
                        : data.modulo_comparacion?.cqrs_mode || "—"}
                </Item>
                <Item label="Latencia">
                    {data.latencia_ms != null ? `${data.latencia_ms} ms` : "No disponible"}
                </Item>
                <Item label="Throughput">
                    {data.throughput_actas_min != null
                        ? `${data.throughput_actas_min} actas/min`
                        : "No disponible"}
                </Item>
            </div>
        </div>
    );
};
