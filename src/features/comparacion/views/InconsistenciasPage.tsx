import { useEffect, useState } from "react";
import { FiltersBar } from "../components/FiltersBar";
import { InconsistenciasTable } from "../components/InconsistenciasTable";
import {
    comparacionService,
    type ComparacionListParams,
    type ComparacionListResponse,
} from "../services/comparacionService";

const INITIAL: ComparacionListParams = {
    estado: "",
    departamento: "",
    municipio: "",
    recinto: "",
    pagina: 1,
    por_pagina: 20,
};

const Chip = ({ value, color }: { value: string; color: string }) => (
    <span
        className="inline-block px-3 py-1 rounded-full text-xs font-bold border"
        style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
    >
        {value}
    </span>
);

export const InconsistenciasPage = () => {
    const [filters, setFilters] = useState<ComparacionListParams>(INITIAL);
    const [data, setData] = useState<ComparacionListResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = async (f: ComparacionListParams) => {
        setLoading(true);
        setError(null);
        try {
            const params: ComparacionListParams = {};
            if (f.estado) params.estado = f.estado;
            if (f.departamento) params.departamento = f.departamento;
            if (f.municipio) params.municipio = f.municipio;
            if (f.recinto) params.recinto = f.recinto;
            params.pagina = f.pagina ?? 1;
            params.por_pagina = f.por_pagina ?? 20;

            const res = await comparacionService.list(params);
            setData(res);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Error al cargar datos.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(INITIAL);
    }, []);

    const resumen = data?.resumen;
    const rows = data?.actas ?? [];

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-5">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Inconsistencias — Comparación RRV vs Oficial
                </h1>

                {resumen && (
                    <div className="flex flex-wrap gap-3 items-center">
                        <Chip value={`Consistentes: ${resumen.actas_consistentes}`} color="#22c55e" />
                        <Chip value={`Inconsistentes: ${resumen.actas_inconsistentes}`} color="#ef4444" />
                        <Chip value={`Solo RRV: ${resumen.actas_solo_rrv}`} color="#f97316" />
                        <Chip value={`Solo Oficial: ${resumen.actas_solo_oficial}`} color="#94a3b8" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            Confiabilidad RRV: {resumen.confiabilidad_rrv?.toFixed(1)}%
                        </span>
                    </div>
                )}

                <FiltersBar
                    filters={filters}
                    onChange={setFilters}
                    onApply={() => load(filters)}
                    onClear={() => {
                        setFilters(INITIAL);
                        load(INITIAL);
                    }}
                />

                {loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center text-gray-500">
                        Cargando comparaciones...
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl p-4 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <InconsistenciasTable
                        rows={rows}
                        total={data?.total ?? 0}
                        pagina={data?.pagina ?? 1}
                        porPagina={data?.por_pagina ?? 20}
                        onPageChange={(p) => {
                            const updated = { ...filters, pagina: p };
                            setFilters(updated);
                            load(updated);
                        }}
                        onVerDetalle={(id) => alert(`Ver detalle de acta: ${id}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default InconsistenciasPage;
