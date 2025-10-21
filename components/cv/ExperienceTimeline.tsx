"use client";

import React from "react";
import { Briefcase, Calendar } from "lucide-react";

type Experience = {
  poste: string;
  entreprise: string;
  periode: string;
  description: string;
};

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune expérience ajoutée</p>
      </div>
    );
  }

  return (
    <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
      {experiences.map((exp, index) => (
        <li key={index}>
          {index > 0 && <hr className="bg-blue-200" />}
          <div className="timeline-middle">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className={`${index % 2 === 0 ? 'timeline-start' : 'timeline-end'} mb-10`}>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{exp.poste}</h4>
                  <p className="text-blue-600 font-medium text-sm">{exp.entreprise}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar className="w-3 h-3" />
                <span>{exp.periode}</span>
              </div>
              {exp.description && (
                <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
          {index < experiences.length - 1 && <hr className="bg-blue-200" />}
        </li>
      ))}
    </ul>
  );
}

