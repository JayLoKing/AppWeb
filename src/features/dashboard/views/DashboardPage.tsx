import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
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
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries();
        setLastUpdate(new Date().toLocaleTimeString());
        setTimeout(() => setRefreshing(false), 800);
    };

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-5">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                >
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Dashboard Electoral
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Actualizado: {lastUpdate}
                        </p>
                    </div>
                    <motion.button
                        onClick={refresh}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        <motion.span
                            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                            transition={refreshing ? { duration: 0.8, ease: "linear", repeat: Infinity } : { duration: 0.2 }}
                            className="inline-flex"
                        >
                            <RefreshCcw size={14} />
                        </motion.span>
                        Actualizar
                    </motion.button>
                </motion.div>

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
