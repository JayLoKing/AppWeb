import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const VotosCandidatoChart = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["votosCandidato"],
        queryFn: () => dashboardService.getVotosCandidato(),
    });

    if (isLoading) return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Votos por Candidato (RRV vs Oficial)</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="candidato" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: "8px" }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar dataKey="rrv" name="RRV" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="oficial" name="Oficial" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
