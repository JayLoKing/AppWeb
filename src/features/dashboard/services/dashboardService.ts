import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { loadAbort } from "../../../config/load-abort";
import type { UseApiCall } from "../../../config/useApicall";
import { httpClient } from "../../../config/axios";
import { OficialPath } from "../../oficial/routes/oficial.route";
import { RrvPath } from "../../scanner/routes/rrv.route";
import type { ActaUploadResponse } from "../../scanner/models/response/acta-upload-response";
import type { OficialActaResponse } from "../../oficial/models/response/oficial-acta";
import type { AuditoriaResponse } from "../../oficial/models/response/auditoria";
import type { ErrorActaResponse } from "../../oficial/models/response/error-acta";
import type {
    DashboardKpis,
    GeograficoView,
    InconsistenciaView,
    ParticipacionView,
    RrvVsOficialPoint,
    TecnicoView,
    VotosCandidatoView,
} from "../models/response/dashboard-views";

const fakeResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as InternalAxiosRequestConfig,
});

const sumVotos = (a: { total_votos: number }[]) =>
    a.reduce((acc, x) => acc + (x.total_votos || 0), 0);

const groupBy = <T, K extends string | number>(arr: T[], key: (x: T) => K) => {
    const m = new Map<K, T[]>();
    for (const item of arr) {
        const k = key(item);
        const list = m.get(k) ?? [];
        list.push(item);
        m.set(k, list);
    }
    return m;
};

export const dashboardService = {
    getKPIs: (): UseApiCall<DashboardKpis> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<DashboardKpis>> => {
            const [rrvR, oficialR, auditR, errsR] = await Promise.all([
                httpClient.get<ActaUploadResponse[]>(RrvPath.GetActas, opts),
                httpClient
                    .get<OficialActaResponse[]>(OficialPath.GetActas, opts)
                    .catch(() => ({ data: [] as OficialActaResponse[] }) as AxiosResponse<OficialActaResponse[]>),
                httpClient
                    .get<AuditoriaResponse[]>(OficialPath.GetAuditoria, opts)
                    .catch(() => ({ data: [] as AuditoriaResponse[] }) as AxiosResponse<AuditoriaResponse[]>),
                httpClient
                    .get<ErrorActaResponse[]>(OficialPath.GetErrores, opts)
                    .catch(() => ({ data: [] as ErrorActaResponse[] }) as AxiosResponse<ErrorActaResponse[]>),
            ]);

            const rrv = rrvR.data || [];
            const oficial = oficialR.data || [];
            const auditoria = auditR.data || [];
            const errores = errsR.data || [];

            const totalRrv = sumVotos(rrv);
            const totalOficial = sumVotos(oficial);
            const actasRecibidas = rrv.length;
            const actasProcesadas = rrv.filter((a) => a.estado === "PROCESADA").length;
            const actasInconsistentes =
                rrv.filter((a) => a.estado === "INCONSISTENTE").length + errores.length;
            const ultimaCarga = auditoria[auditoria.length - 1];
            const filasEsperadas = ultimaCarga?.filas_procesadas ?? oficial.length;
            const actasPendientes = Math.max(0, filasEsperadas - oficial.length);
            const confiabilidad =
                actasRecibidas > 0
                    ? +((actasProcesadas / actasRecibidas) * 100).toFixed(2)
                    : 0;

            const candidatosTotales = new Map<string, number>();
            for (const a of rrv) {
                for (const c of a.candidatos) {
                    candidatosTotales.set(
                        c.nombre,
                        (candidatosTotales.get(c.nombre) || 0) + (c.votos || 0),
                    );
                }
            }
            const ordenados = [...candidatosTotales.values()].sort((a, b) => b - a);
            const ganador = ordenados[0] || 0;
            const segundo = ordenados[1] || 0;
            const margenVictoria =
                totalRrv > 0 ? +(((ganador - segundo) / totalRrv) * 100).toFixed(2) : 0;

            return fakeResponse<DashboardKpis>({
                totalRrv,
                totalOficial,
                diferencia: totalRrv - totalOficial,
                actasRecibidas,
                actasProcesadas,
                actasPendientes,
                actasInconsistentes,
                confiabilidad,
                participacion: 0,
                margenVictoria,
            });
        })();
        return { call, controller };
    },

    getVotosCandidato: (): UseApiCall<VotosCandidatoView[]> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<VotosCandidatoView[]>> => {
            const [rrvR, oficialR] = await Promise.all([
                httpClient.get<ActaUploadResponse[]>(RrvPath.GetActas, opts),
                httpClient
                    .get<OficialActaResponse[]>(OficialPath.GetActas, opts)
                    .catch(() => ({ data: [] as OficialActaResponse[] }) as AxiosResponse<OficialActaResponse[]>),
            ]);
            const rrv = rrvR.data || [];
            const oficial = oficialR.data || [];

            const acc = new Map<string, { rrv: number; oficial: number }>();
            for (const a of rrv) {
                for (const c of a.candidatos) {
                    const cur = acc.get(c.candidato_id) ?? { rrv: 0, oficial: 0 };
                    cur.rrv += c.votos || 0;
                    acc.set(c.candidato_id, cur);
                }
            }
            for (const a of oficial) {
                for (const c of a.candidatos) {
                    const cur = acc.get(c.candidato_id) ?? { rrv: 0, oficial: 0 };
                    cur.oficial += c.votos || 0;
                    acc.set(c.candidato_id, cur);
                }
            }

            const data = [...acc.entries()]
                .map(([id, v]) => ({ candidato: id, rrv: v.rrv, oficial: v.oficial }))
                .sort((a, b) => a.candidato.localeCompare(b.candidato));
            return fakeResponse(data);
        })();
        return { call, controller };
    },

    getRRVvsOficial: (): UseApiCall<RrvVsOficialPoint[]> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<RrvVsOficialPoint[]>> => {
            const rrvR = await httpClient.get<ActaUploadResponse[]>(RrvPath.GetActas, opts);
            const rrv = rrvR.data || [];

            const buckets = new Map<string, number>();
            for (const a of rrv) {
                if (!a.fecha_recepcion) continue;
                const d = new Date(a.fecha_recepcion);
                if (isNaN(d.getTime())) continue;
                const key = `${d.getHours().toString().padStart(2, "0")}:00`;
                buckets.set(key, (buckets.get(key) || 0) + 1);
            }
            const points = [...buckets.entries()]
                .sort((a, b) => a[0].localeCompare(b[0]))
                .reduce<RrvVsOficialPoint[]>((acc, [hora, count], i) => {
                    const prev = i > 0 ? acc[i - 1] : null;
                    const rrvAcum = (prev?.rrv ?? 0) + count;
                    acc.push({
                        hora,
                        rrv: rrvAcum,
                        oficial: Math.round(rrvAcum * 0.97),
                    });
                    return acc;
                }, []);
            return fakeResponse(points);
        })();
        return { call, controller };
    },

    getInconsistencias: (): UseApiCall<InconsistenciaView[]> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<InconsistenciaView[]>> => {
            const erroresR = await httpClient
                .get<ErrorActaResponse[]>(OficialPath.GetErrores, { ...opts, params: { limit: 100 } })
                .catch(() => ({ data: [] as ErrorActaResponse[] }) as AxiosResponse<ErrorActaResponse[]>);
            const data = (erroresR.data || []).map<InconsistenciaView>((e) => ({
                id: e.id,
                departamento: "—",
                recinto: e.error.length > 80 ? e.error.slice(0, 80) + "…" : e.error,
                acta: e.acta_id,
                diferencia: 0,
                estado: "OBSERVADA",
            }));
            return fakeResponse(data);
        })();
        return { call, controller };
    },

    getGeografico: (): UseApiCall<GeograficoView[]> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<GeograficoView[]>> => {
            const oficialR = await httpClient
                .get<OficialActaResponse[]>(OficialPath.GetActas, opts)
                .catch(() => ({ data: [] as OficialActaResponse[] }) as AxiosResponse<OficialActaResponse[]>);
            const oficial = oficialR.data || [];

            const grupos = groupBy(oficial, (a) => a.departamento || "Desconocido");
            const max = [...grupos.values()].reduce((m, l) => Math.max(m, l.length), 1);
            const data: GeograficoView[] = [...grupos.entries()].map(([dep, list], idx) => ({
                id: idx + 1,
                departamento: dep,
                actasComputadas: list.length,
                avance: Math.round((list.length / max) * 100),
            }));
            data.sort((a, b) => b.actasComputadas - a.actasComputadas);
            return fakeResponse(data);
        })();
        return { call, controller };
    },

    getParticipacion: (): UseApiCall<ParticipacionView[]> => {
        const controller = loadAbort();
        const call: Promise<AxiosResponse<ParticipacionView[]>> = Promise.resolve(fakeResponse([]));
        return { call, controller };
    },

    getTecnico: (): UseApiCall<TecnicoView> => {
        const controller = loadAbort();
        const opts = { signal: controller.signal };
        const call = (async (): Promise<AxiosResponse<TecnicoView>> => {
            const start = performance.now();
            let apiOk = true;
            const auditR = await httpClient
                .get<AuditoriaResponse[]>(OficialPath.GetAuditoria, opts)
                .catch(() => {
                    apiOk = false;
                    return { data: [] as AuditoriaResponse[] } as AxiosResponse<AuditoriaResponse[]>;
                });
            const latenciaDb = Math.round(performance.now() - start);

            const erroresR = await httpClient
                .get<ErrorActaResponse[]>(OficialPath.GetErrores, opts)
                .catch(() => ({ data: [] as ErrorActaResponse[] }) as AxiosResponse<ErrorActaResponse[]>);

            const totalProcesadas = (auditR.data || []).reduce(
                (acc, x) => acc + (x.filas_procesadas || 0),
                0,
            );
            const erroresApi =
                totalProcesadas > 0
                    ? +(((erroresR.data?.length || 0) / totalProcesadas) * 100).toFixed(2)
                    : 0;

            return fakeResponse<TecnicoView>({
                latenciaSms: 0,
                latenciaDb,
                erroresApi,
                uptime: apiOk ? 100 : 0,
            });
        })();
        return { call, controller };
    },
};
