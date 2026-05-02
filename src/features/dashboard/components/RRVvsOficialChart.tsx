import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import { AnimatedCard } from "../../../components/AnimatedCard";

const COLOR_BY_LABEL: Record<string, string> = {
    Consistentes: "#22c55e",
    Inconsistentes: "#ef4444",
    "Solo RRV": "#f97316",
    "Solo Oficial": "#94a3b8",
};
const FALLBACK_COLORS = ["#22c55e", "#ef4444", "#f97316", "#94a3b8"];

// Sector con efecto pop al hacer hover
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 8} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" style={{ fontSize: 13, fontWeight: 700 }}>
                {payload.name}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: 12 }}>
                {value} ({(percent * 100).toFixed(1)}%)
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

export const RRVvsOficialChart = () => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
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
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, idx) => setActiveIndex(idx)}
                            onMouseLeave={() => setActiveIndex(undefined)}
                            isAnimationActive
                            animationBegin={150}
                            animationDuration={900}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={entry.name}
                                    fill={COLOR_BY_LABEL[entry.name] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: 8 }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </AnimatedCard>
    );
};
