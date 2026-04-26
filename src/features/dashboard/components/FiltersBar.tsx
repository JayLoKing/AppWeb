import React from 'react';
import { Filter } from 'lucide-react';

export const FiltersBar = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                <Filter size={18} />
                <span>Filtros:</span>
            </div>
            
            <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full">
                <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Departamento (Todos)</option>
                    <option value="LP">La Paz</option>
                    <option value="SCZ">Santa Cruz</option>
                    <option value="CBBA">Cochabamba</option>
                </select>

                <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Municipio (Todos)</option>
                </select>

                <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Recinto (Todos)</option>
                </select>

                <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Fuente (Comparación)</option>
                    <option value="RRV">Solo RRV</option>
                    <option value="OFICIAL">Solo Oficial</option>
                </select>

                <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Estado Acta (Todos)</option>
                    <option value="VALIDA">Válida</option>
                    <option value="INCONSISTENTE">Inconsistente</option>
                    <option value="ANULADA">Anulada</option>
                </select>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors whitespace-nowrap">
                Aplicar
            </button>
        </div>
    );
};
