import React from "react";
import { AppleTheme } from "@/lib/types";

interface ThemeSelectorProps {
  selectedTheme: AppleTheme;
  onThemeChange: (theme: AppleTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  const themes: { value: AppleTheme; label: string; description: string }[] = [
    {
      value: "classic",
      label: "Classic Mac (1984)",
      description: "Black & white pixel perfection",
    },
    {
      value: "imac",
      label: "iMac G3 (1998)",
      description: "Translucent and colorful",
    },
    {
      value: "aqua",
      label: "Mac OS X (2001)",
      description: "Aqua interface with gel buttons",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Choose Your Era</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedTheme === theme.value
                ? theme.value === "classic"
                  ? "border-black bg-gray-100"
                  : theme.value === "imac"
                  ? "border-imac-bondi-blue bg-blue-50"
                  : "border-aqua-blue bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-lg font-bold mb-2">{theme.label}</div>
            <div className="text-sm text-gray-600">{theme.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;