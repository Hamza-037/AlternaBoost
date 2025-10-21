"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { 
  SectionType, 
  Project, 
  Certification, 
  Publication, 
  Reference, 
  Achievement, 
  Volunteering 
} from "@/types/custom-sections";

interface DynamicSectionFormProps {
  type: SectionType;
  data: any[];
  onUpdate: (data: any[]) => void;
}

export function DynamicSectionForm({ type, data, onUpdate }: DynamicSectionFormProps) {
  const renderProjectForm = () => {
    const [newProject, setNewProject] = useState<Partial<Project>>({
      title: "",
      technologies: [],
      description: "",
      link: "",
      date: ""
    });
    const [newTech, setNewTech] = useState("");

    const addProject = () => {
      if (newProject.title && newProject.description) {
        onUpdate([...data, { ...newProject, id: Date.now().toString() }]);
        setNewProject({ title: "", technologies: [], description: "", link: "", date: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Titre du projet"
          value={newProject.title || ""}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <div className="flex gap-2">
          <Input
            placeholder="Technologie (ex: React)"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTech) {
                setNewProject({ 
                  ...newProject, 
                  technologies: [...(newProject.technologies || []), newTech] 
                });
                setNewTech("");
              }
            }}
            className="bg-white border-gray-300"
          />
          <Button
            onClick={() => {
              if (newTech) {
                setNewProject({ 
                  ...newProject, 
                  technologies: [...(newProject.technologies || []), newTech] 
                });
                setNewTech("");
              }
            }}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {newProject.technologies && newProject.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newProject.technologies.map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {tech}
                <button
                  onClick={() => setNewProject({
                    ...newProject,
                    technologies: newProject.technologies?.filter((_, idx) => idx !== i)
                  })}
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        <Textarea
          placeholder="Description du projet..."
          value={newProject.description || ""}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          rows={3}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Lien (optionnel)"
          value={newProject.link || ""}
          onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          type="month"
          placeholder="Date"
          value={newProject.date || ""}
          onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addProject}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter le projet
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((project: Project, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{project.title}</p>
                    <p className="text-xs text-gray-600">{project.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCertificationForm = () => {
    const [newCert, setNewCert] = useState<Partial<Certification>>({
      name: "",
      organization: "",
      date: "",
      credentialId: ""
    });

    const addCert = () => {
      if (newCert.name && newCert.organization) {
        onUpdate([...data, { ...newCert, id: Date.now().toString() }]);
        setNewCert({ name: "", organization: "", date: "", credentialId: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Nom de la certification"
          value={newCert.name || ""}
          onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Organisme délivrant"
          value={newCert.organization || ""}
          onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          type="month"
          placeholder="Date d'obtention"
          value={newCert.date || ""}
          onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="ID de certification (optionnel)"
          value={newCert.credentialId || ""}
          onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addCert}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la certification
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((cert: Certification, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.organization} - {cert.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPublicationForm = () => {
    const [newPub, setNewPub] = useState<Partial<Publication>>({
      title: "",
      publisher: "",
      date: "",
      link: ""
    });

    const addPub = () => {
      if (newPub.title && newPub.publisher) {
        onUpdate([...data, { ...newPub, id: Date.now().toString() }]);
        setNewPub({ title: "", publisher: "", date: "", link: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Titre de la publication"
          value={newPub.title || ""}
          onChange={(e) => setNewPub({ ...newPub, title: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Éditeur/Revue"
          value={newPub.publisher || ""}
          onChange={(e) => setNewPub({ ...newPub, publisher: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          type="month"
          placeholder="Date de publication"
          value={newPub.date || ""}
          onChange={(e) => setNewPub({ ...newPub, date: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Lien (optionnel)"
          value={newPub.link || ""}
          onChange={(e) => setNewPub({ ...newPub, link: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addPub}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la publication
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((pub: Publication, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{pub.title}</p>
                    <p className="text-xs text-gray-600">{pub.publisher} - {pub.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderReferenceForm = () => {
    const [newRef, setNewRef] = useState<Partial<Reference>>({
      name: "",
      position: "",
      company: "",
      email: "",
      phone: ""
    });

    const addRef = () => {
      if (newRef.name && newRef.position) {
        onUpdate([...data, { ...newRef, id: Date.now().toString() }]);
        setNewRef({ name: "", position: "", company: "", email: "", phone: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Nom complet"
          value={newRef.name || ""}
          onChange={(e) => setNewRef({ ...newRef, name: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Poste occupé"
          value={newRef.position || ""}
          onChange={(e) => setNewRef({ ...newRef, position: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Entreprise"
          value={newRef.company || ""}
          onChange={(e) => setNewRef({ ...newRef, company: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Email (optionnel)"
          type="email"
          value={newRef.email || ""}
          onChange={(e) => setNewRef({ ...newRef, email: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Téléphone (optionnel)"
          type="tel"
          value={newRef.phone || ""}
          onChange={(e) => setNewRef({ ...newRef, phone: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addRef}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la référence
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((ref: Reference, index) => (
              <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{ref.name}</p>
                    <p className="text-xs text-gray-600">{ref.position} - {ref.company}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAchievementForm = () => {
    const [newAch, setNewAch] = useState<Partial<Achievement>>({
      title: "",
      description: "",
      date: ""
    });

    const addAch = () => {
      if (newAch.title && newAch.description) {
        onUpdate([...data, { ...newAch, id: Date.now().toString() }]);
        setNewAch({ title: "", description: "", date: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Titre de la réalisation"
          value={newAch.title || ""}
          onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Textarea
          placeholder="Description..."
          value={newAch.description || ""}
          onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
          rows={3}
          className="bg-white border-gray-300"
        />
        
        <Input
          type="month"
          placeholder="Date (optionnel)"
          value={newAch.date || ""}
          onChange={(e) => setNewAch({ ...newAch, date: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addAch}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la réalisation
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((ach: Achievement, index) => (
              <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{ach.title}</p>
                    <p className="text-xs text-gray-600">{ach.date}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderVolunteeringForm = () => {
    const [newVol, setNewVol] = useState<Partial<Volunteering>>({
      organization: "",
      role: "",
      period: "",
      description: ""
    });

    const addVol = () => {
      if (newVol.organization && newVol.role) {
        onUpdate([...data, { ...newVol, id: Date.now().toString() }]);
        setNewVol({ organization: "", role: "", period: "", description: "" });
      }
    };

    return (
      <div className="space-y-4">
        <Input
          placeholder="Organisation"
          value={newVol.organization || ""}
          onChange={(e) => setNewVol({ ...newVol, organization: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Rôle/Fonction"
          value={newVol.role || ""}
          onChange={(e) => setNewVol({ ...newVol, role: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Input
          placeholder="Période (ex: 2022 - 2023)"
          value={newVol.period || ""}
          onChange={(e) => setNewVol({ ...newVol, period: e.target.value })}
          className="bg-white border-gray-300"
        />
        
        <Textarea
          placeholder="Description de votre contribution..."
          value={newVol.description || ""}
          onChange={(e) => setNewVol({ ...newVol, description: e.target.value })}
          rows={3}
          className="bg-white border-gray-300"
        />
        
        <Button
          onClick={addVol}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter le bénévolat
        </Button>
        
        {data.length > 0 && (
          <div className="space-y-2 mt-4">
            {data.map((vol: Volunteering, index) => (
              <div key={index} className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{vol.role}</p>
                    <p className="text-xs text-gray-600">{vol.organization} - {vol.period}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdate(data.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render based on type
  switch (type) {
    case "projects":
      return renderProjectForm();
    case "certifications":
      return renderCertificationForm();
    case "publications":
      return renderPublicationForm();
    case "references":
      return renderReferenceForm();
    case "achievements":
      return renderAchievementForm();
    case "volunteering":
      return renderVolunteeringForm();
    default:
      return <p className="text-sm text-gray-500">Formulaire en cours de développement...</p>;
  }
}

