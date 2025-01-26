import React, { useState } from "react";
// import ThemeToggle from "./theme-toggle";
import FileUploader from "./file-uploader";

interface NavBarProps {
  onFileUpload: (file: File) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onFileUpload }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Análise de Fatura</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Carregar Fatura
              </button>
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsDialogOpen(false)}
            />
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <FileUploader
                  onFileUpload={(file) => {
                    onFileUpload(file);
                    setIsDialogOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
