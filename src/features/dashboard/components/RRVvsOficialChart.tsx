import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#f97316", "#94a3b8"];

export const RRVvsOficialChart = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["rrvVsOficial"],
        queryFn: () => dashboardService.getRRVvsOficial().then((r) => r.data),
        refetchInterval: 30000,
    });

    if (isLoading) return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (isError || !data) return (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-red-500 text-sm">
            Error cargando datos RRV vs Oficial
        </div>
    );

    const chartData = data.labels.map((label, i) => ({
        name: label,
        value: data.datasets[0]?.data[i] ?? 0,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribución RRV vs Oficial</h3>
                {data.raw && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Confiabilidad: <span className="font-medium text-emerald-600 dark:text-emerald-400">{data.raw.confiabilidad_rrv.toFixed(2)}%</span>
                    </p>
                )}
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="70%"
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#fff",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => new Intl.NumberFormat("es-BO").format(Number(value))}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
