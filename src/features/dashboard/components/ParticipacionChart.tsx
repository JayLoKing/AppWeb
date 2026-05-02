import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AnimatedCard } from "../../../components/AnimatedCard";

export const ParticipacionChart = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["participacion"],
        queryFn: () => dashboardService.getParticipacion(),
    });

    if (isLoading)
        return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (!data) return null;

    return (
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Participación electoral</h3>
            {!data.available ? (
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400">
                    {data.message ?? "Datos de participación no disponibles."}
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.labels.map((label, i) => ({
                                label,
                                "Participación %": Number(data.datasets[0]?.data[i] ?? 0),
                            }))}
                            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                            <Tooltip
                                cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                                contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: 8 }}
                                itemStyle={{ color: "#E5E7EB" }}
                                formatter={(value) => `${value}%`}
                            />
                            <Legend />
                            <Bar
                                dataKey="Participación %"
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                                isAnimationActive
                                animationBegin={150}
                                animationDuration={1000}
                                animationEasing="ease-out"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </AnimatedCard>
    );
};
