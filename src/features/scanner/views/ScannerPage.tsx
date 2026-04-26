import { Settings, Camera } from "lucide-react";

export const ScannerPage = () => {
    return (
        <div className="p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Escanear Acta</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Digitalización y transmisión al sistema RRV</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                        <Settings className="text-blue-500 animate-[spin_3s_linear_infinite]" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Módulo en Desarrollo</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                        Estamos trabajando en la integración con las cámaras y procesamiento de imágenes.
                        Pronto podrás escanear y subir actas desde esta pantalla.
                    </p>

                    <button disabled className="bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium rounded-lg px-6 py-3 flex items-center gap-2 cursor-not-allowed">
                        <Camera size={20} />
                        Activar Cámara
                    </button>
                </div>
            </div>
        </div>
    );
};
