import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Series = "RRV" | "Oficial";

export const VotosCandidatoChart = () => {
    const [hidden, setHidden] = useState<Record<Series, boolean>>({ RRV: false, Oficial: false });
    const { data, isLoading } = useQuery({
        queryKey: ["votosCandidato"],
        queryFn: () => dashboardService.getVotosCandidato(),
    });

    if (isLoading)
        return <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />;
    if (!data) return null;

    const rrvDS = data.datasets.find((d) => d.label.toLowerCase() === "rrv");
    const ofDS = data.datasets.find((d) => d.label.toLowerCase() === "oficial");
    const chartData = data.labels.map((label, i) => ({
        candidato: label,
        RRV: Number(rrvDS?.data[i] ?? 0),
        Oficial: Number(ofDS?.data[i] ?? 0),
    }));

    const todosEnCero = chartData.every((d) => d.RRV === 0 && d.Oficial === 0);

    const handleLegendClick = (data: { dataKey?: string | number | ((obj: unknown) => unknown) }) => {
        const key = typeof data.dataKey === "string" ? (data.dataKey as Series) : null;
        if (key === "RRV" || key === "Oficial") {
            setHidden((prev) => ({ ...prev, [key]: !prev[key] }));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow h-96 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Votos por candidato — RRV vs Oficial
            </h3>
            {todosEnCero && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Los votos oficiales dependen de la transcripción/carga oficial procesada.
                </p>
            )}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                Click en la leyenda para mostrar/ocultar series.
            </p>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="candidato" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                            cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                            contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#fff", borderRadius: 8 }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => Number(value).toLocaleString("es-BO")}
                        />
                        <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: "pointer" }} />
                        <Bar
                            dataKey="RRV"
                            fill="#f97316"
                            radius={[6, 6, 0, 0]}
                            hide={hidden.RRV}
                            isAnimationActive
                            animationDuration={800}
                        />
                        <Bar
                            dataKey="Oficial"
                            fill="#3b82f6"
                            radius={[6, 6, 0, 0]}
                            hide={hidden.Oficial}
                            isAnimationActive
                            animationDuration={800}
                            animationBegin={200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
