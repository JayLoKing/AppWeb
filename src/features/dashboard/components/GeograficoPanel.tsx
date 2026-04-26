import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import { MapPin } from "lucide-react";

export const GeograficoPanel = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['geografico'],
        queryFn: async () => {
            const { call } = dashboardService.getGeografico();
            const res = await call;
            return res.data;
        }
    });

    if (isLoading) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avance Geográfico</h3>
            </div>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.id}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{item.departamento}</span>
                            <span className="text-gray-500 dark:text-gray-400">{item.avance}% ({item.actasComputadas} actas)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: `${item.avance}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
