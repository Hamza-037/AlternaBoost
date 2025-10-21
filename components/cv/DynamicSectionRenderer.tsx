"use client";

import React from "react";
import { 
  Folder, 
  Award, 
  BookOpen, 
  Users, 
  Trophy, 
  Heart,
  Link as LinkIcon,
  Mail,
  Phone
} from "lucide-react";
import { 
  SectionType, 
  Project, 
  Certification, 
  Publication, 
  Reference, 
  Achievement, 
  Volunteering,
  CustomSection
} from "@/types/custom-sections";

interface DynamicSectionRendererProps {
  sections: CustomSection[];
  primaryColor: string;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({ sections, primaryColor }) => {
  
  const renderProjectsSection = (data: Project[]) => (
    <div className="space-y-4">
      {data.map((project, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {project.title}
              </h3>
            </div>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.technologies.map((tech, i) => (
                  <span 
                    key={i}
                    className="px-2 py-0.5 text-white text-xs rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            {project.description && (
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {project.description}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {project.date && <span>{project.date}</span>}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: primaryColor }}>
                  <LinkIcon className="w-3 h-3" />
                  Voir le projet
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertificationsSection = (data: Certification[]) => (
    <div className="space-y-4">
      {data.map((cert, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {cert.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 text-white text-xs rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                {cert.organization}
              </span>
              {cert.date && (
                <span className="text-xs italic text-gray-500">
                  {cert.date}
                </span>
              )}
            </div>
            
            {cert.credentialId && (
              <p className="text-xs text-gray-600">
                ID: {cert.credentialId}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPublicationsSection = (data: Publication[]) => (
    <div className="space-y-4">
      {data.map((pub, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {pub.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 text-white text-xs rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                {pub.publisher}
              </span>
              {pub.date && (
                <span className="text-xs italic text-gray-500">
                  {pub.date}
                </span>
              )}
            </div>
            
            {pub.link && (
              <a href={pub.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:underline" style={{ color: primaryColor }}>
                <LinkIcon className="w-3 h-3" />
                Lire la publication
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderReferencesSection = (data: Reference[]) => (
    <div className="space-y-4">
      {data.map((ref, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {ref.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 text-white text-xs rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                {ref.position}
              </span>
              <span className="text-xs italic text-gray-500">
                {ref.company}
              </span>
            </div>
            
            <div className="flex flex-col gap-1 text-xs text-gray-600">
              {ref.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" style={{ color: primaryColor }} />
                  {ref.email}
                </div>
              )}
              {ref.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" style={{ color: primaryColor }} />
                  {ref.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAchievementsSection = (data: Achievement[]) => (
    <div className="space-y-4">
      {data.map((ach, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {ach.title}
              </h3>
            </div>
            
            {ach.date && (
              <span className="text-xs italic text-gray-500 mb-2 block">
                {ach.date}
              </span>
            )}
            
            {ach.description && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {ach.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderVolunteeringSection = (data: Volunteering[]) => (
    <div className="space-y-4">
      {data.map((vol, index) => (
        <div key={index} className="relative pl-8" style={{ borderLeft: `2px solid ${primaryColor}` }}>
          <div 
            className="absolute -left-4 top-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-gray-600" />
              <h3 className="uppercase font-bold text-sm text-gray-800">
                {vol.role}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 text-white text-xs rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                {vol.organization}
              </span>
              {vol.period && (
                <span className="text-xs italic text-gray-500">
                  {vol.period}
                </span>
              )}
            </div>
            
            {vol.description && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {vol.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSection = (section: CustomSection) => {
    if (!section.enabled || section.data.length === 0) return null;

    let content;
    switch (section.type) {
      case "projects":
        content = renderProjectsSection(section.data as Project[]);
        break;
      case "certifications":
        content = renderCertificationsSection(section.data as Certification[]);
        break;
      case "publications":
        content = renderPublicationsSection(section.data as Publication[]);
        break;
      case "references":
        content = renderReferencesSection(section.data as Reference[]);
        break;
      case "achievements":
        content = renderAchievementsSection(section.data as Achievement[]);
        break;
      case "volunteering":
        content = renderVolunteeringSection(section.data as Volunteering[]);
        break;
      default:
        return null;
    }

    return (
      <div key={section.id} className="mb-8">
        <h2 className="uppercase font-bold text-sm mb-4 text-gray-800">
          {section.type === "projects" && "Projets"}
          {section.type === "certifications" && "Certifications"}
          {section.type === "publications" && "Publications"}
          {section.type === "references" && "Références"}
          {section.type === "achievements" && "Réalisations"}
          {section.type === "volunteering" && "Bénévolat"}
        </h2>
        {content}
      </div>
    );
  };

  return (
    <>
      {sections.map(section => renderSection(section))}
    </>
  );
};

