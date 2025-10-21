"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, X } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  type?: 'cv' | 'letter';
  current?: number;
  limit?: number;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  message, 
  type = 'cv',
  current,
  limit 
}: UpgradeModalProps) {
  const itemName = type === 'cv' ? 'CV' : 'lettre de motivation';
  const defaultMessage = `Vous avez atteint votre limite de ${limit} ${itemName}${limit && limit > 1 ? 's' : ''} par mois.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]"></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="w-8 h-8" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Limite atteinte
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-base">
              {message || defaultMessage}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Stats actuelles */}
          {current !== undefined && limit !== undefined && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Utilisation ce mois</span>
                <span className="text-sm font-semibold text-gray-900">
                  {current} / {limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-gray-700 mb-6">
            Passez à un plan supérieur pour continuer à créer des {type === 'cv' ? 'CVs' : 'lettres'} professionnels sans limite.
          </p>

          {/* Plans recommandés */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Plan Starter - 5,99€/mois</h4>
                <p className="text-xs text-blue-700">15 CVs + 5 lettres par mois</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex-shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 text-sm flex items-center gap-2">
                  Plan Pro - 10,99€/mois
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] rounded-full">POPULAIRE</span>
                </h4>
                <p className="text-xs text-purple-700">CVs et lettres ILLIMITÉS</p>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold text-gray-700 uppercase">Inclus dans tous les plans payants :</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>7 jours d'essai gratuit</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>IA optimisée pour vos documents</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Templates premium</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Plus tard
            </Button>
            <Link href="/pricing" className="flex-1">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Voir les offres
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

