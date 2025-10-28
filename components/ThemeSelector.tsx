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
      label: "Vintage Photobooth (1970s)",
      description: "Authentic film strips with warm tones",
    },
    {
      value: "imac",
      label: "Glamour Studio",
      description: "Luxe portraits with champagne glow",
    },
  ];

  return (
    <div className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 text-center"
        style={{
          color: '#FFF8DC',
          fontFamily: "'Georgia', serif",
          letterSpacing: '2px',
          textShadow: '1px 2px 4px rgba(0, 0, 0, 0.6)'
        }}
      >
        Choose Your Era
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedTheme === theme.value
                ? theme.value === "classic"
                  ? ""
                  : theme.value === "imac"
                  ? ""
                  : ""
                : ""
            }`}
            style={
              selectedTheme === theme.value
                ? theme.value === "imac"
                  ? {
                      backgroundColor: '#F7E7CE',
                      borderColor: '#D4AF37',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                    }
                  : {
                      backgroundColor: 'rgba(128, 1, 2, 0.2)',
                      borderColor: '#800102',
                      boxShadow: '0 4px 12px rgba(128, 1, 2, 0.3)'
                    }
                : {
                    backgroundColor: 'rgba(255, 248, 220, 0.05)',
                    borderColor: 'rgba(255, 248, 220, 0.2)',
                    color: '#FFF8DC'
                  }
            }
          >
            <div
              className="text-lg font-bold mb-2"
              style={{
                color: selectedTheme === theme.value
                  ? (theme.value === "imac" ? '#704214' : '#FFF8DC')
                  : '#FFF8DC'
              }}
            >
              {theme.label}
            </div>
            <div
              className="text-sm"
              style={{
                color: selectedTheme === theme.value
                  ? (theme.value === "imac" ? '#9B8B7E' : 'rgba(255, 248, 220, 0.8)')
                  : 'rgba(255, 248, 220, 0.6)'
              }}
            >
              {theme.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;