import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    FileText,
    GitCompare,
    TrendingUp,
    XCircle,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const Card = ({ title, value, icon: Icon, trend, colorClass }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    colorClass: { bg: string; text: string };
}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
            <div className={cn("p-2 rounded-lg bg-opacity-10 dark:bg-opacity-20", colorClass.bg, colorClass.text)}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {trend && (
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp size={12} /> {trend}
                </span>
            )}
        </div>
    </div>
);

export const KPICards = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["kpis"],
        queryFn: () => dashboardService.getKPIs().then((r) => r.data),
        refetchInterval: 30000,
    });

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(9)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
    );

    if (isError || !data) return (
        <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            Error cargando KPIs. Verifica la conexión con el backend.
        </div>
    );

    const fmt = (n: number) => new Intl.NumberFormat("es-BO").format(n);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card title="Actas RRV" value={fmt(data.total_actas_rrv)} icon={FileText} colorClass={{ bg: "bg-blue-500", text: "text-blue-500" }} />
            <Card title="Actas Oficial" value={fmt(data.total_actas_oficial)} icon={CheckCircle} colorClass={{ bg: "bg-green-500", text: "text-green-500" }} />
            <Card title="Actas Comparadas" value={fmt(data.total_actas_comparadas)} icon={GitCompare} colorClass={{ bg: "bg-indigo-500", text: "text-indigo-500" }} />
            <Card title="Actas Consistentes" value={fmt(data.actas_consistentes)} icon={CheckCircle} colorClass={{ bg: "bg-emerald-500", text: "text-emerald-500" }} trend="Sin diferencias" />
            <Card title="Actas Inconsistentes" value={fmt(data.actas_inconsistentes)} icon={AlertTriangle} colorClass={{ bg: "bg-red-500", text: "text-red-500" }} />
            <Card title="Solo en RRV" value={fmt(data.actas_solo_rrv)} icon={XCircle} colorClass={{ bg: "bg-orange-500", text: "text-orange-500" }} />
            <Card title="Solo en Oficial" value={fmt(data.actas_solo_oficial)} icon={XCircle} colorClass={{ bg: "bg-yellow-500", text: "text-yellow-600" }} />
            <Card title="Confiabilidad RRV" value={`${data.confiabilidad_rrv.toFixed(2)}%`} icon={Activity} colorClass={{ bg: "bg-teal-500", text: "text-teal-500" }} />
            <Card title="Diferencia Total Votos" value={fmt(data.diferencia_total_votos)} icon={Activity} colorClass={{ bg: "bg-purple-500", text: "text-purple-500" }} />
        </div>
    );
};
