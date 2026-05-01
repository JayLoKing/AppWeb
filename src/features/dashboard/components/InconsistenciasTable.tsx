import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import type { ActaComparada } from "../models/dashboard.types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const SEVERITY_COLORS = {
    ALTA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    MEDIA: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    BAJA: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const ESTADO_COLORS: Record<string, string> = {
    INCONSISTENTE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    SOLO_RRV: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    SOLO_OFICIAL: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    CONSISTENTE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const ActaDetalleModal = ({ actaId, onClose }: { actaId: string; onClose: () => void }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["acta-detalle", actaId],
        queryFn: () => dashboardService.getActaDetalle(actaId).then((r) => r.data),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detalle Acta: {actaId}</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {isLoading && (
                        <div className="space-y-3 animate-pulse">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                        </div>
                    )}

                    {isError && (
                        <p className="text-red-500 text-sm">Error cargando el detalle del acta.</p>
                    )}

                    {data && (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ["Departamento", data.departamento],
                                    ["Provincia", data.provincia],
                                    ["Municipio", data.municipio],
                                    ["Recinto", data.recinto],
                                    ["Mesa", data.mesa],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p>
                                    </div>
                                ))}
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-400 mb-0.5">Estado</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ESTADO_COLORS[data.estado_comparacion] ?? ""}`}>
                                        {data.estado_comparacion}
                                    </span>
                                </div>
                            </div>

                            {data.diferencias && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Diferencias</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Total votos: <span className="font-bold">{data.diferencias.diferencia_total_votos}</span> ·
                                        Nulos: <span className="font-bold">{data.diferencias.diferencia_votos_nulos}</span> ·
                                        Blancos: <span className="font-bold">{data.diferencias.diferencia_votos_blancos}</span>
                                    </p>
                                    {data.diferencias.diferencia_por_candidato && data.diferencias.diferencia_por_candidato.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            {data.diferencias.diferencia_por_candidato.map((c) => (
                                                <div key={c.candidato_id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                                    <span>{c.nombre}</span>
                                                    <span>RRV: {c.votos_rrv} · Oficial: {c.votos_oficial} · Δ {c.diferencia}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {data.inconsistencias && data.inconsistencias.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Inconsistencias detectadas</h4>
                                    {data.inconsistencias.map((inc, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${SEVERITY_COLORS[inc.severidad]}`}>
                                                {inc.severidad}
                                            </span>
                                            <p className="text-gray-600 dark:text-gray-400">{inc.descripcion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const InconsistenciasTable = () => {
    const [page, setPage] = useState(1);
    const [selectedActa, setSelectedActa] = useState<string | null>(null);
    const limit = 20;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["inconsistencias", page],
        queryFn: () => dashboardService.getInconsistencias(page, limit).then((r) => r.data),
        refetchInterval: 30000,
    });

    const totalPages = data ? Math.ceil(data.total / limit) : 1;
    const items: ActaComparada[] = data?.inconsistencias ?? [];

    return (
        <>
            {selectedActa && (
                <ActaDetalleModal actaId={selectedActa} onClose={() => setSelectedActa(null)} />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Actas Inconsistentes
                        {data && <span className="ml-2 text-sm font-normal text-gray-400">({data.total} total)</span>}
                    </h3>
                    {data?.resumen && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            Confiabilidad: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{data.resumen.confiabilidad_rrv.toFixed(2)}%</span>
                        </span>
                    )}
                </div>

                {isLoading && (
                    <div className="p-6 space-y-2 animate-pulse">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                    </div>
                )}

                {isError && (
                    <p className="p-6 text-red-500 text-sm">Error cargando inconsistencias</p>
                )}

                {!isLoading && !isError && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-5 py-3">Acta ID</th>
                                        <th className="px-5 py-3">Departamento</th>
                                        <th className="px-5 py-3">Municipio</th>
                                        <th className="px-5 py-3">Recinto</th>
                                        <th className="px-5 py-3">Estado</th>
                                        <th className="px-5 py-3">Δ Votos</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                                                No hay inconsistencias registradas
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr
                                                key={item.acta_id}
                                                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <td className="px-5 py-3 font-mono text-xs text-gray-900 dark:text-white">{item.acta_id}</td>
                                                <td className="px-5 py-3">{item.departamento}</td>
                                                <td className="px-5 py-3">{item.municipio}</td>
                                                <td className="px-5 py-3 max-w-[150px] truncate">{item.recinto}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLORS[item.estado_comparacion] ?? ""}`}>
                                                        {item.estado_comparacion}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {item.diferencias != null ? (
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            item.diferencias.diferencia_total_votos !== 0
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                        }`}>
                                                            {item.diferencias.diferencia_total_votos > 0 ? "+" : ""}
                                                            {item.diferencias.diferencia_total_votos}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <button
                                                        onClick={() => setSelectedActa(item.acta_id)}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                    >
                                                        Ver detalle
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Página {page} de {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
