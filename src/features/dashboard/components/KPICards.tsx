import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    Percent,
    TrendingUp,
    Users,
    Vote,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const Card = ({ title, value, icon: Icon, trend, colorClass }: any) => (
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
        queryFn: () => dashboardService.getKPIs(),
    });

    if (isLoading)
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl" />
                ))}
            </div>
        );

    if (isError || !data) return <div className="text-red-500 p-4 bg-red-50 rounded-xl">Error cargando KPIs</div>;

    const formatNumber = (num: number) => new Intl.NumberFormat("es-BO").format(num);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Card title="Actas RRV (Mongo)" value={formatNumber(data.totalRrv)} icon={Vote} colorClass={{ bg: "bg-blue-500", text: "text-blue-500" }} />
            <Card title="Actas Oficial (PG)" value={formatNumber(data.totalOficial)} icon={CheckCircle} colorClass={{ bg: "bg-green-500", text: "text-green-500" }} />
            <Card title="Diferencia Votos" value={formatNumber(data.diferencia)} icon={Activity} colorClass={{ bg: "bg-yellow-500", text: "text-yellow-600" }} />
            <Card title="Actas Comparadas" value={formatNumber(data.actasRecibidas)} icon={FileText} colorClass={{ bg: "bg-purple-500", text: "text-purple-500" }} />
            <Card title="Actas Procesadas" value={formatNumber(data.actasProcesadas)} icon={Activity} colorClass={{ bg: "bg-indigo-500", text: "text-indigo-500" }} />
            <Card title="Actas Pendientes" value={formatNumber(data.actasPendientes)} icon={Clock} colorClass={{ bg: "bg-orange-500", text: "text-orange-500" }} />
            <Card title="Actas Inconsistentes" value={formatNumber(data.actasInconsistentes)} icon={AlertTriangle} colorClass={{ bg: "bg-red-500", text: "text-red-500" }} />
            <Card title="Confiabilidad RRV" value={`${data.confiabilidad}%`} icon={CheckCircle} colorClass={{ bg: "bg-emerald-500", text: "text-emerald-500" }} />
            <Card title="Participación" value={`${data.participacion}%`} icon={Users} colorClass={{ bg: "bg-teal-500", text: "text-teal-500" }} />
            <Card title="Margen Victoria" value={`${data.margenVictoria}%`} icon={Percent} colorClass={{ bg: "bg-cyan-500", text: "text-cyan-500" }} />
        </div>
    );
};
