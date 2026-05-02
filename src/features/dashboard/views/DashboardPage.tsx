import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { KPICards } from "../components/KPICards";
import { VotosCandidatoChart } from "../components/VotosCandidatoChart";
import { RRVvsOficialChart } from "../components/RRVvsOficialChart";
import { GeograficoPanel } from "../components/GeograficoPanel";
import { TecnicoPanel } from "../components/TecnicoPanel";
import { ParticipacionChart } from "../components/ParticipacionChart";
import { ResultadosOficialesPanel } from "../components/ResultadosOficialesPanel";
import { AuditoriaOficialPanel } from "../components/AuditoriaOficialPanel";
import { EventosRRVPanel } from "../components/EventosRRVPanel";

export const DashboardPage = () => {
    const queryClient = useQueryClient();
    const [lastUpdate, setLastUpdate] = useState<string>(() => new Date().toLocaleTimeString());

    const refresh = () => {
        queryClient.invalidateQueries();
        setLastUpdate(new Date().toLocaleTimeString());
    };

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Dashboard Electoral
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Actualizado: {lastUpdate}
                        </p>
                    </div>
                    <button
                        onClick={refresh}
                        className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCcw size={14} /> Actualizar
                    </button>
                </div>

                {/* KPIs */}
                <KPICards />

                {/* RRV vs Oficial + Votos por candidato */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RRVvsOficialChart />
                    <VotosCandidatoChart />
                </div>

                {/* Participación + Técnico */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ParticipacionChart />
                    <TecnicoPanel />
                </div>

                {/* Geográfico full width */}
                <GeograficoPanel />

                {/* Resultados oficiales + Auditoría oficial */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ResultadosOficialesPanel />
                    <AuditoriaOficialPanel />
                </div>

                {/* Eventos RRV full width */}
                <EventosRRVPanel />
            </div>
        </div>
    );
};

export default DashboardPage;
