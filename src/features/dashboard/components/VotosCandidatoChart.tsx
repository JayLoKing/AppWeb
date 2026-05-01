import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const VotosCandidatoChart = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["votosCandidato"],
        queryFn: () => dashboardService.getVotosCandidato().then((r) => r.data),
        refetchInterval: 30000,
    });

    if (isLoading) return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (isError || !data) return (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-red-500 text-sm">
            Error cargando votos por candidato
        </div>
    );

    const rrvDataset = data.datasets.find((d) => d.label === "RRV");
    const oficialDataset = data.datasets.find((d) => d.label === "Oficial");

    const chartData = data.labels.map((label, i) => ({
        candidato: label,
        RRV: rrvDataset?.data[i] ?? 0,
        Oficial: oficialDataset?.data[i] ?? 0,
    }));

    if (chartData.length === 0) return (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sin datos de candidatos disponibles</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Votos por Candidato (RRV vs Oficial)</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="candidato" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#9CA3AF" tickFormatter={(v) => new Intl.NumberFormat("es-BO", { notation: "compact" }).format(v)} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: "8px" }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => new Intl.NumberFormat("es-BO").format(Number(value))}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar dataKey="RRV" fill="#f97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Oficial" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
