import { useRef, useState } from "react";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";

interface Props {
    onFile: (file: File) => void;
}

const ACCEPTED = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE = 10 * 1024 * 1024;

export const FileDropzone = ({ onFile }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selected, setSelected] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validate = (file: File): string | null => {
        if (file.size > MAX_SIZE) return "El archivo supera los 10 MB.";
        const ok = /\.(pdf|jpe?g|png)$/i.test(file.name);
        if (!ok) return "Formato no permitido. Usa PDF, JPG o PNG.";
        return null;
    };

    const handleFile = (file: File | undefined | null) => {
        if (!file) return;
        const err = validate(file);
        if (err) {
            setError(err);
            setSelected(null);
            return;
        }
        setError(null);
        setSelected(file);
        onFile(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const clear = () => {
        setSelected(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-3">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                    dragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-white dark:bg-gray-800"
                }`}
            >
                <Upload className="mx-auto text-blue-500 mb-3" size={40} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Arrastra un archivo aquí o haz clic para buscar
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, JPG o PNG · máx. 10 MB</p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {selected && (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {selected.type.startsWith("image/") ? (
                            <ImageIcon className="text-blue-500 shrink-0" size={20} />
                        ) : (
                            <FileText className="text-red-500 shrink-0" size={20} />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{selected.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(selected.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clear}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};
