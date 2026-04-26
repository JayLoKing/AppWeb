import { Navigate } from "react-router-dom";
import { PrivateRoutes } from "./private-routes";
import { LoginPage } from "../features/auth/views/LoginPage";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../features/dashboard/views/DashboardPage";
import { ScannerPage } from "../features/scanner/views/ScannerPage";

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
        ]
    },
    {
        element: <PrivateRoutes />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "scanner", element: <ScannerPage /> },
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
];
