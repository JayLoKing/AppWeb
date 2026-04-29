import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { Lock, User, AlertCircle } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import { LoginAsync } from "../services/auth.service";
import type { AuthErrorResponse } from "../models/response/success-post-auth";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthStore();
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);
        const { call } = LoginAsync({ usuario, contrasena });
        try {
            const response = await call;
            setAuthUser(response.data, usuario);
            navigate("/dashboard");
        } catch (err) {
            const ax = err as AxiosError<AuthErrorResponse>;
            const backendMsg = ax.response?.data?.error;
            setErrorMsg(
                backendMsg ||
                    (ax.response?.status === 401
                        ? "Credenciales inválidas"
                        : ax.message || "No se pudo iniciar sesión"),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        CE
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cómputo Electoral</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Ingresa tus credenciales para acceder al sistema</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                required
                                autoComplete="username"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="admin"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                autoComplete="current-password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-3 flex items-start gap-2 text-sm text-red-800 dark:text-red-300">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none flex justify-center items-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <span className="animate-pulse">Verificando...</span> : "Ingresar al Sistema"}
                    </button>
                </form>
            </div>
        </div>
    );
};
