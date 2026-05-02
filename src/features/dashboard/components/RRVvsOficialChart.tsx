import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AnimatedCard } from "../../../components/AnimatedCard";

const COLOR_BY_LABEL: Record<string, string> = {
    Consistentes: "#22c55e",
    Inconsistentes: "#ef4444",
    "Solo RRV": "#f97316",
    "Solo Oficial": "#94a3b8",
};
const FALLBACK_COLORS = ["#22c55e", "#ef4444", "#f97316", "#94a3b8"];

export const RRVvsOficialChart = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["rrvVsOficial"],
        queryFn: () => dashboardService.getRRVvsOficial(),
    });

    if (isLoading)
        return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (!data) return null;

    const counts = data.datasets[0]?.data ?? [];
    const chartData = data.labels.map((label, i) => ({
        name: label,
        value: Number(counts[i] ?? 0),
    }));

    return (
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                RRV vs Oficial — Distribución de estados
            </h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius="55%"
                            outerRadius="85%"
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            isAnimationActive
                            animationBegin={150}
                            animationDuration={900}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={entry.name}
                                    fill={COLOR_BY_LABEL[entry.name] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: 8 }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value, name) => [`${Number(value).toLocaleString("es-BO")} actas`, name]}
                        />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </AnimatedCard>
    );
};
