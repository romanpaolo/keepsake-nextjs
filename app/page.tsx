"use client";

import { useState } from "react";
import PhotoBoothApp from "@/components/PhotoBoothApp";
import ThemeSelector from "@/components/ThemeSelector";
import { AppleTheme } from "@/lib/types";

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<AppleTheme>("classic");

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-5xl font-bold text-center mb-8"
          style={{
            fontFamily: "'Georgia', 'Playfair Display', serif",
            color: '#FFF8DC',
            textShadow: '2px 3px 6px rgba(0, 0, 0, 0.8)',
            letterSpacing: '6px',
            fontWeight: 400
          }}
        >
          KEEPSAKE
        </h1>
        
        <ThemeSelector 
          selectedTheme={selectedTheme} 
          onThemeChange={setSelectedTheme} 
        />

        <PhotoBoothApp theme={selectedTheme} />
      </div>
    </main>
  );
}