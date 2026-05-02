import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { dashboardService, type ResumenComparacion } from "../services/dashboardService";

type CardConfig = {
    key: keyof ResumenComparacion;
    label: string;
    border: string;
    valueColor: string;
    format?: "pct" | "num";
};

const CARDS: CardConfig[] = [
    { key: "total_actas_rrv", label: "Total Actas RRV", border: "border-orange-500", valueColor: "text-orange-500" },
    { key: "total_actas_oficial", label: "Total Actas Oficial", border: "border-blue-500", valueColor: "text-blue-500" },
    { key: "actas_consistentes", label: "Consistentes", border: "border-green-500", valueColor: "text-green-500" },
    { key: "actas_inconsistentes", label: "Inconsistentes", border: "border-red-500", valueColor: "text-red-500" },
    { key: "actas_solo_rrv", label: "Solo RRV", border: "border-orange-500", valueColor: "text-orange-500" },
    { key: "actas_solo_oficial", label: "Solo Oficial", border: "border-slate-400", valueColor: "text-slate-500" },
    { key: "confiabilidad_rrv", label: "Confiabilidad RRV (%)", border: "border-gray-900", valueColor: "text-gray-900 dark:text-white", format: "pct" },
    { key: "diferencia_total_votos", label: "Diferencia Total Votos", border: "border-purple-500", valueColor: "text-purple-500" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

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

    return (
        <motion.div
            className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {CARDS.map(({ key, label, border, valueColor, format }) => {
                const raw = Number(data[key] ?? 0);
                return (
                    <motion.div
                        key={key}
                        variants={item}
                        whileHover={{ y: -3, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl px-5 py-4 shadow-sm hover:shadow-lg border-l-4 ${border} border-y border-r border-gray-200 dark:border-gray-700 cursor-default`}
                    >
                        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                            {label}
                        </div>
                        <div className={`text-3xl font-extrabold ${valueColor}`}>
                            <CountUp
                                end={raw}
                                duration={1.4}
                                separator="."
                                decimals={format === "pct" ? 1 : 0}
                                suffix={format === "pct" ? "%" : ""}
                                preserveValue
                            />
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};
