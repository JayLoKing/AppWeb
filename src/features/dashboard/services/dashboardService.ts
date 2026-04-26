import { httpClient } from "../../../config/axios";
import { loadAbort } from "../../../config/load-abort";
import type { UseApiCall } from "../../../config/useApicall";

// Mock Data
export const mocks = {
    kpis: {
        totalRrv: 3500000,
        totalOficial: 3495000,
        diferencia: 5000,
        actasRecibidas: 35000,
        actasProcesadas: 34500,
        actasPendientes: 500,
        actasInconsistentes: 120,
        confiabilidad: 99.8,
        participacion: 85.4,
        margenVictoria: 5.2
    },
    votosCandidato: [
        { candidato: "Candidato A", rrv: 1500000, oficial: 1498000 },
        { candidato: "Candidato B", rrv: 1300000, oficial: 1295000 },
        { candidato: "Candidato C", rrv: 700000, oficial: 702000 }
    ],
    participacion: [
        { departamento: "La Paz", porcentaje: 88.5 },
        { departamento: "Santa Cruz", porcentaje: 82.1 },
        { departamento: "Cochabamba", porcentaje: 86.4 }
    ],
    inconsistencias: [
        { id: 1, departamento: "La Paz", recinto: "Unidad Educativa A", acta: "00123", diferencia: 15, estado: "Pendiente Revisión" },
        { id: 2, departamento: "Santa Cruz", recinto: "Colegio B", acta: "00456", diferencia: -8, estado: "Resuelto" }
    ],
    rrvVsOficial: [
        { hora: "08:00", rrv: 1000, oficial: 950 },
        { hora: "10:00", rrv: 5000, oficial: 4900 },
        { hora: "12:00", rrv: 15000, oficial: 14800 },
        { hora: "14:00", rrv: 25000, oficial: 24900 },
        { hora: "16:00", rrv: 35000, oficial: 34500 }
    ],
    geografico: [
        { id: 1, departamento: "La Paz", actasComputadas: 8500, avance: 95 },
        { id: 2, departamento: "Santa Cruz", actasComputadas: 9200, avance: 88 },
        { id: 3, departamento: "Cochabamba", actasComputadas: 6100, avance: 92 }
    ],
    tecnico: {
        latenciaSms: 2.4, // segundos
        latenciaDb: 45, // ms
        erroresApi: 0.05, // porcentaje
        uptime: 99.99
    }
};

// Services
export const dashboardService = {
    getKPIs: (): UseApiCall<typeof mocks.kpis> => {
        const controller = loadAbort();
        // Simular petición
        const call = new Promise<{data: typeof mocks.kpis}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.kpis }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getVotosCandidato: (): UseApiCall<typeof mocks.votosCandidato> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.votosCandidato}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.votosCandidato }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getParticipacion: (): UseApiCall<typeof mocks.participacion> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.participacion}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.participacion }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getInconsistencias: (): UseApiCall<typeof mocks.inconsistencias> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.inconsistencias}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.inconsistencias }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getRRVvsOficial: (): UseApiCall<typeof mocks.rrvVsOficial> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.rrvVsOficial}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.rrvVsOficial }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getGeografico: (): UseApiCall<typeof mocks.geografico> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.geografico}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.geografico }), 800);
        });
        return { call: call as Promise<any>, controller };
    },
    getTecnico: (): UseApiCall<typeof mocks.tecnico> => {
        const controller = loadAbort();
        const call = new Promise<{data: typeof mocks.tecnico}>((resolve) => {
            setTimeout(() => resolve({ data: mocks.tecnico }), 800);
        });
        return { call: call as Promise<any>, controller };
    }
};
