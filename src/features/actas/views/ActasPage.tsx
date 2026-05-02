import { useEffect, useRef, useState } from "react";
import { actasService, type Acta, type ActaEstado } from "../services/actasService";

const ESTADO_COLOR: Record<ActaEstado, string> = {
    impresa: "#d4800a",
    transcrita: "#27ae60",
    observada: "#c0392b",
};
const ESTADO_LABEL: Record<ActaEstado, string> = {
    impresa: "Impresa",
    transcrita: "Transcrita",
    observada: "Observada",
};

const PAGE_SIZE = 20;

const StateBadge = ({ estado }: { estado: ActaEstado }) => {
    const color = ESTADO_COLOR[estado] ?? "#888";
    return (
        <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${color}20`, color }}
        >
            {ESTADO_LABEL[estado] ?? estado}
        </span>
    );
};

const Chip = ({ value, color }: { value: string; color: string }) => (
    <span
        className="inline-block px-3 py-1 rounded-full text-xs font-bold border"
        style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
    >
        {value}
    </span>
);

export const ActasPage = () => {
    const [actas, setActas] = useState<Acta[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [msg, setMsg] = useState<{ texto: string; ok: boolean } | null>(null);
    const [simulando, setSimulando] = useState(false);
    const [fallbackBtn, setFallbackBtn] = useState(false);
    const pollRef = useRef<number | null>(null);

    const loadActas = async () => {
        try {
            const data = await actasService.list();
            setActas(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActas();
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const total = actas.length;
    const transcrita = actas.filter((a) => a.estado === "transcrita").length;
    const observada = actas.filter((a) => a.estado === "observada").length;
    const progresoPct = total > 0 ? Math.round(((transcrita + observada) / total) * 100) : 0;

    const filtered = actas.filter(
        (a) =>
            !search ||
            String(a.codigoActa).includes(search) ||
            String(a.codigoRecinto).includes(search),
    );
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSimular = async (fallback = false) => {
        setMsg(null);
        setFallbackBtn(false);
        setSimulando(true);
        try {
            const snapshot = {
                transcrita,
                observada,
            };
            const res = await actasService.simular(fallback);
            if (!res.success) {
                const detalle = [res.message, res.hint].filter(Boolean).join(". ");
                setMsg({ texto: detalle || "n8n no disponible.", ok: false });
                setFallbackBtn(true);
                setSimulando(false);
                return;
            }
            if (res.estado === "COMPLETADO") {
                setMsg({
                    texto: `Completado (${res.source === "backend_fallback" ? "fallback directo" : "n8n"}): ${res.actualizadas ?? 0} transcritas, ${res.observadas ?? 0} observadas.`,
                    ok: true,
                });
                loadActas();
                setSimulando(false);
                return;
            }

            setMsg({
                texto: "Flujo iniciado en n8n. Las actas se actualizarán automáticamente...",
                ok: true,
            });
            let ticks = 0;
            const MAX = 60;
            pollRef.current = window.setInterval(async () => {
                ticks++;
                try {
                    const data = await actasService.list();
                    setActas(data);
                    const t = data.filter((a) => a.estado === "transcrita").length;
                    const o = data.filter((a) => a.estado === "observada").length;
                    const i = data.filter((a) => a.estado === "impresa").length;
                    const stable =
                        i === 0 && (t !== snapshot.transcrita || o !== snapshot.observada);
                    if (stable || ticks >= MAX) {
                        if (pollRef.current) clearInterval(pollRef.current);
                        setSimulando(false);
                        setMsg({
                            texto: `Transcripción completada. ${t} transcritas, ${o} observadas.`,
                            ok: true,
                        });
                    }
                } catch {
                    /* ignore */
                }
            }, 2000);
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : "Error desconocido.";
            setMsg({ texto: `Error: ${errMsg}`, ok: false });
            setFallbackBtn(true);
            setSimulando(false);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex-1">
                        Actas
                    </h1>
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Buscar por código..."
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-56"
                    />
                    <button
                        disabled
                        className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-5 py-2 rounded-md disabled:opacity-50"
                        title="Próximamente"
                    >
                        + Nueva acta
                    </button>
                    <button
                        onClick={() => handleSimular(false)}
                        disabled={simulando}
                        className={`text-sm font-semibold px-5 py-2 rounded-md border ${
                            simulando
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-green-50 text-green-700 border-green-500 hover:bg-green-100"
                        }`}
                    >
                        {simulando ? "Simulando..." : "Simular transcripción con n8n"}
                    </button>
                    {fallbackBtn && (
                        <button
                            onClick={() => handleSimular(true)}
                            disabled={simulando}
                            className="bg-orange-50 text-orange-700 border border-orange-500 hover:bg-orange-100 text-sm font-semibold px-5 py-2 rounded-md"
                        >
                            Simular sin n8n (fallback)
                        </button>
                    )}
                </div>

                {/* Counters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <Chip value={`Transcritas: ${transcrita}`} color="#27ae60" />
                    <Chip value={`Observadas: ${observada}`} color="#c0392b" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total: {total}</span>
                </div>

                {/* Progress */}
                {(simulando || progresoPct > 0) && (
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {progresoPct}% procesado
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-md h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-gray-900 transition-all duration-500"
                                style={{ width: `${progresoPct}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Message */}
                {msg && (
                    <div
                        className={`rounded-md px-4 py-2 text-sm ${
                            msg.ok
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        }`}
                    >
                        {msg.texto}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    <th className="px-4 py-3 text-left font-bold">Código Acta</th>
                                    <th className="px-4 py-3 text-left font-bold">Cód. Recinto</th>
                                    <th className="px-4 py-3 text-left font-bold">Mesa</th>
                                    <th className="px-4 py-3 text-left font-bold">Estado</th>
                                    <th className="px-4 py-3 text-left font-bold">P1</th>
                                    <th className="px-4 py-3 text-left font-bold">P2</th>
                                    <th className="px-4 py-3 text-left font-bold">P3</th>
                                    <th className="px-4 py-3 text-left font-bold">P4</th>
                                    <th className="px-4 py-3 text-left font-bold">Válidos</th>
                                    <th className="px-4 py-3 text-left font-bold">Nulos</th>
                                    <th className="px-4 py-3 text-left font-bold">Blancos</th>
                                    <th className="px-4 py-3 text-left font-bold">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={12} className="px-4 py-8 text-center text-gray-400">
                                            Cargando...
                                        </td>
                                    </tr>
                                )}
                                {!loading && slice.length === 0 && (
                                    <tr>
                                        <td colSpan={12} className="px-4 py-8 text-center text-gray-400">
                                            Sin resultados
                                        </td>
                                    </tr>
                                )}
                                {!loading &&
                                    slice.map((a) => (
                                        <tr
                                            key={a.id}
                                            className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                        >
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                                {a.codigoActa}
                                            </td>
                                            <td className="px-4 py-3">{a.codigoRecinto}</td>
                                            <td className="px-4 py-3">{a.nroMesa}</td>
                                            <td className="px-4 py-3">
                                                <StateBadge estado={a.estado} />
                                            </td>
                                            <td className="px-4 py-3">{a.p1}</td>
                                            <td className="px-4 py-3">{a.p2}</td>
                                            <td className="px-4 py-3">{a.p3}</td>
                                            <td className="px-4 py-3">{a.p4}</td>
                                            <td className="px-4 py-3">{a.votosValidos}</td>
                                            <td className="px-4 py-3">{a.votosNulos}</td>
                                            <td className="px-4 py-3">{a.votosBlanco}</td>
                                            <td className="px-4 py-3">{a.observaciones || "—"}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {pages > 1 && (
                        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                {filtered.length} actas — página {page} de {pages}
                            </span>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                            >
                                ‹
                            </button>
                            {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-1 rounded-md border text-sm ${
                                        p === page
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={page >= pages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActasPage;
