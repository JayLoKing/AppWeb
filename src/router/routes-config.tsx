import { Navigate } from "react-router-dom";
import { PrivateRoutes } from "./private-routes";
import { LoginPage } from "../features/auth/views/LoginPage";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../features/dashboard/views/DashboardPage";
import InconsistenciasPage from "../features/comparacion/views/InconsistenciasPage";
import ActasPage from "../features/actas/views/ActasPage";
import ActaFormPage from "../features/actas/views/ActaFormPage";

export const routesConfig = [
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/auth",
        children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <LoginPage /> },
        ],
    },
    {
        element: <PrivateRoutes />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "inconsistencias", element: <InconsistenciasPage /> },
                    // { path: "actas", element: <ActasPage /> },
                    // { path: "actas/nueva", element: <ActaFormPage /> },
                    // { path: "actas/editar/:id", element: <ActaFormPage /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
    },
];
