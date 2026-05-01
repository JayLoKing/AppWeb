import { KPICards } from "../components/KPICards";
import { VotosCandidatoChart } from "../components/VotosCandidatoChart";
import { InconsistenciasTable } from "../components/InconsistenciasTable";
import { FiltersBar } from "../components/FiltersBar";
import { RRVvsOficialChart } from "../components/RRVvsOficialChart";
import { GeograficoPanel } from "../components/GeograficoPanel";
import { TecnicoPanel } from "../components/TecnicoPanel";
import { ParticipacionPanel } from "../components/ParticipacionPanel";

export const DashboardPage = () => {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Cómputo Electoral</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Comparación RRV vs Oficial en tiempo real</p>
                    </div>
                </div>

                <FiltersBar />

                <KPICards />

                <ParticipacionPanel />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <VotosCandidatoChart />
                    <RRVvsOficialChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <InconsistenciasTable />
                    </div>
                    <div className="flex flex-col gap-8">
                        <GeograficoPanel />
                        <TecnicoPanel />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
