import React from "react";
import { useTheme } from "../hooks/use-theme";

const ThemeToggle: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {isDark ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
