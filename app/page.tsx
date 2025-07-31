"use client";

import { useState } from "react";
import PhotoBoothApp from "@/components/PhotoBoothApp";
import ThemeSelector from "@/components/ThemeSelector";
import { AppleTheme } from "@/lib/types";

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<AppleTheme>("classic");

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 font-mono">
          Retro Apple PhotoBooth
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