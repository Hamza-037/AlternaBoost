"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React from "react";

interface CharacterCounterProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxChars?: number;
  minChars?: number;
  showProgressBar?: boolean;
  helperText?: string;
}

export const CharacterCounter = React.forwardRef<
  HTMLTextAreaElement,
  CharacterCounterProps
>(
  (
    {
      label,
      maxChars = 500,
      minChars = 0,
      showProgressBar = true,
      helperText,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const progress = maxChars > 0 ? (charCount / maxChars) * 100 : 0;

    const getCounterColor = () => {
      if (charCount < minChars) return "text-orange-600";
      if (charCount > maxChars) return "text-red-600";
      return "text-green-600";
    };

    const getProgressColor = () => {
      if (charCount < minChars) return "bg-orange-500";
      if (charCount > maxChars) return "bg-red-500";
      return "bg-green-500";
    };

    const getMessage = () => {
      if (charCount === 0) return "Commencez à écrire";
      if (charCount < minChars) return `Encore ${minChars - charCount} caractères minimum`;
      if (charCount > maxChars) return `${charCount - maxChars} caractères en trop`;
      return "Longueur appropriée";
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
        )}
        
        <Textarea ref={ref} id={id} value={value} {...props} />

        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getCounterColor()}`}>
            {charCount} / {maxChars} caractères
          </span>
          <span className="text-gray-500">{getMessage()}</span>
        </div>

        {showProgressBar && (
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        )}

        {helperText && (
          <p className="text-xs text-gray-500 flex items-start gap-1">
            <svg
              className="w-3 h-3 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{helperText}</span>
          </p>
        )}
      </div>
    );
  }
);

CharacterCounter.displayName = "CharacterCounter";

