import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setFileName(acceptedFiles[0].name);
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-base font-medium text-white">Upload de Fatura</h2>
          <p className="text-purple-100 text-xs mt-0.5">Formato aceito: PDF (máx. 10MB)</p>
        </div>

        <div className="p-4">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out ${
              isDragActive
                ? "border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            }`}
          >
            <input {...getInputProps()} />

            <div className="p-3 text-center">
              <div className="mb-2">
                <div className="mx-auto w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? "Solte o arquivo aqui" : "Arraste sua fatura aqui"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">ou</p>
                <button className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
                  selecione um arquivo
                </button>
              </div>
            </div>
          </div>

          {fileName && (
            <div className="mt-3 flex items-center p-2 bg-purple-50 rounded-md border border-purple-100">
              <div className="flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-2 flex-1">
                <p className="text-xs font-medium text-purple-900 truncate">{fileName}</p>
                <p className="text-[10px] text-purple-500">PDF selecionado</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName(null);
                }}
                className="ml-2 flex-shrink-0 text-purple-600 hover:text-purple-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
