import { useQuery } from "@tanstack/react-query";
import { dashboardService, type ResumenComparacion } from "../services/dashboardService";

type CardConfig = {
    key: keyof ResumenComparacion;
    label: string;
    color: string;
    valueColor: string;
    format?: "pct" | "num";
};

const CARDS: CardConfig[] = [
    { key: "total_actas_rrv", label: "Total Actas RRV", color: "border-orange-500", valueColor: "text-orange-500" },
    { key: "total_actas_oficial", label: "Total Actas Oficial", color: "border-blue-500", valueColor: "text-blue-500" },
    { key: "actas_consistentes", label: "Consistentes", color: "border-green-500", valueColor: "text-green-500" },
    { key: "actas_inconsistentes", label: "Inconsistentes", color: "border-red-500", valueColor: "text-red-500" },
    { key: "actas_solo_rrv", label: "Solo RRV", color: "border-orange-500", valueColor: "text-orange-500" },
    { key: "actas_solo_oficial", label: "Solo Oficial", color: "border-slate-400", valueColor: "text-slate-500" },
    { key: "confiabilidad_rrv", label: "Confiabilidad RRV (%)", color: "border-gray-900", valueColor: "text-gray-900 dark:text-white", format: "pct" },
    { key: "diferencia_total_votos", label: "Diferencia Total Votos", color: "border-purple-500", valueColor: "text-purple-500" },
];

export const KPICards = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["kpis"],
        queryFn: () => dashboardService.getKPIs(),
    });

    if (isLoading)
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                ))}
            </div>
        );

    if (isError || !data)
        return <div className="text-red-500 p-4 bg-red-50 rounded-xl">Error cargando KPIs</div>;

    const fmt = (raw: number | undefined, format?: "pct" | "num") => {
        if (raw == null) return "—";
        if (format === "pct") return `${Number(raw).toFixed(1)}%`;
        return Number(raw).toLocaleString("es-BO");
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {CARDS.map(({ key, label, color, valueColor, format }) => (
                <div
                    key={key}
                    className={`bg-white dark:bg-gray-800 rounded-xl px-5 py-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-l-4 ${color} border-y border-r border-gray-200 dark:border-gray-700 cursor-default`}
                >
                    <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                        {label}
                    </div>
                    <div className={`text-3xl font-extrabold ${valueColor}`}>
                        {fmt(data[key] as number, format)}
                    </div>
                </div>
            ))}
        </div>
    );
};
