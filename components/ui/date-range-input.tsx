"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DateRangeInputProps {
  value: string; // Format: "Jan 2023 - Déc 2024" ou "2023 - 2024"
  onChange: (value: string) => void;
  className?: string;
}

export function DateRangeInput({ value, onChange, className }: DateRangeInputProps) {
  // Parse la valeur initiale
  const parseValue = (val: string) => {
    // Si c'est déjà au format ISO ou YYYY-MM, on garde
    if (val.match(/^\d{4}-\d{2}$/)) {
      const parts = val.split(' - ');
      return {
        start: parts[0] || "",
        end: parts[1] || ""
      };
    }
    
    // Sinon on met des valeurs vides pour permettre la sélection
    return { start: "", end: "" };
  };

  const parsed = parseValue(value);
  const [startDate, setStartDate] = useState(parsed.start);
  const [endDate, setEndDate] = useState(parsed.end);
  const [isOngoing, setIsOngoing] = useState(value.toLowerCase().includes("aujourd'hui") || value.toLowerCase().includes("présent"));

  useEffect(() => {
    if (startDate) {
      const formattedStart = formatDateToDisplay(startDate);
      const formattedEnd = isOngoing ? "Aujourd'hui" : (endDate ? formatDateToDisplay(endDate) : "");
      
      if (formattedEnd) {
        onChange(`${formattedStart} - ${formattedEnd}`);
      } else {
        onChange(formattedStart);
      }
    }
  }, [startDate, endDate, isOngoing]);

  const formatDateToDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month] = isoDate.split('-');
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        {/* Date de début */}
        <div>
          <Label className="text-xs text-gray-600 mb-1.5 block">Début</Label>
          <div className="relative">
            <Input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm pr-8"
              placeholder="MM/AAAA"
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Date de fin */}
        <div>
          <Label className="text-xs text-gray-600 mb-1.5 block">Fin</Label>
          <div className="relative">
            {isOngoing ? (
              <div className="h-10 px-3 border border-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500 bg-gray-50">
                En cours
              </div>
            ) : (
              <>
                <Input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="text-sm pr-8"
                  placeholder="MM/AAAA"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkbox "En cours" */}
      <label className="flex items-center gap-2 mt-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={isOngoing}
          onChange={(e) => setIsOngoing(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-600 group-hover:text-gray-900">
          Poste en cours
        </span>
      </label>
    </div>
  );
}

