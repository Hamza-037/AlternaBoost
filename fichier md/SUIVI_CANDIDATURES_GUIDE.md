# Guide - Module Suivi des Candidatures

## Date : 21 Octobre 2025

---

## 🎯 Fonctionnalité implémentée

Module CRUD complet permettant aux utilisateurs connectés de suivre leurs candidatures depuis le dashboard AlternaBoost.

---

## 📦 Ce qui a été créé

### 1. Base de données

#### Modèle Prisma `Application`
**Fichier** : `prisma/schema.prisma`

```prisma
model Application {
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName       String
  position          String
  status            String    @default("en_attente")
  appliedDate       DateTime
  lastContactDate   DateTime?
  contactPerson     String?
  notes             String?   @db.Text
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([userId, appliedDate(sort: Desc)])
  @@index([status])
}
```

#### Migration SQL
**Fichier** : `prisma/migrations/002_add_applications_table.sql`

---

### 2. Types TypeScript

**Fichier** : `types/application.ts`

Définit :
- `ApplicationStatus` : Type union des statuts possibles
- `Application` : Interface complète
- `CreateApplicationInput` / `UpdateApplicationInput` : Types pour les mutations
- `APPLICATION_STATUS_LABELS` : Labels affichables en français
- `APPLICATION_STATUS_COLORS` : Configuration des couleurs par statut

**Statuts disponibles :**
- `en_attente` 🟡 - En attente
- `entretien` 🔵 - Entretien
- `offre` 🟢 - Offre reçue
- `refus` 🔴 - Refusé
- `sans_reponse` ⚪ - Sans réponse

---

### 3. Validation

**Fichier** : `lib/validations/application-schema.ts`

Schema Zod pour valider :
- Entreprise (requis, max 100 caractères)
- Poste (requis, max 100 caractères)
- Statut (enum strict)
- Date de candidature (requise)
- Dernier contact (optionnel)
- Personne de contact (optionnel, max 100 caractères)
- Notes (optionnel, max 1000 caractères)

---

### 4. API Routes

#### GET `/api/applications`
**Fichier** : `app/api/applications/route.ts`

- Récupère toutes les candidatures de l'utilisateur connecté
- Tri par date de candidature (plus récent en premier)
- Requiert authentification Clerk

#### POST `/api/applications`
**Fichier** : `app/api/applications/route.ts`

- Crée une nouvelle candidature
- Validation Zod automatique
- Génère un ID unique avec nanoid
- Requiert authentification Clerk

#### GET `/api/applications/[id]`
**Fichier** : `app/api/applications/[id]/route.ts`

- Récupère une candidature spécifique
- Vérifie que la candidature appartient à l'utilisateur
- Retourne 403 si accès non autorisé

#### PUT `/api/applications/[id]`
**Fichier** : `app/api/applications/[id]/route.ts`

- Met à jour une candidature existante
- Validation Zod automatique
- Vérifie la propriété avant modification
- Met à jour `updatedAt` automatiquement

#### DELETE `/api/applications/[id]`
**Fichier** : `app/api/applications/[id]/route.ts`

- Supprime une candidature
- Vérifie la propriété avant suppression
- Retourne un message de confirmation

---

### 5. Interface utilisateur

#### Page principale
**Fichier** : `app/dashboard/applications/page.tsx`

**Fonctionnalités :**
- ✅ Dashboard avec stats rapides (Total, En attente, Entretiens, Offres, Refus)
- ✅ Barre de recherche (par entreprise ou poste)
- ✅ Filtre par statut
- ✅ Liste des candidatures avec animations
- ✅ Bouton "Nouvelle candidature"
- ✅ Actions : Éditer / Supprimer
- ✅ État vide élégant
- ✅ Loading states
- ✅ Responsive design

#### Dialog formulaire
**Fichier** : `components/applications/ApplicationFormDialog.tsx`

**Fonctionnalités :**
- ✅ Mode création / édition
- ✅ Tous les champs du modèle
- ✅ Validation en temps réel
- ✅ Select pour le statut
- ✅ Date pickers
- ✅ Textarea pour les notes
- ✅ Loading state pendant soumission
- ✅ Messages toast de succès/erreur

#### Dialog de suppression
**Fichier** : `components/applications/DeleteConfirmDialog.tsx`

**Fonctionnalités :**
- ✅ Confirmation avant suppression
- ✅ Message explicite
- ✅ Bouton rouge "Supprimer"

---

### 6. Intégration Dashboard

**Fichier** : `app/dashboard/DashboardClient.tsx`

Ajout d'une nouvelle card "Mes Candidatures" dans les actions rapides :
- Badge "NOUVEAU"
- Icône Briefcase
- Couleur verte (from-green-500 to-emerald-600)
- Lien vers `/dashboard/applications`

---

## 🎨 Design & UX

### Palette de couleurs

| Statut | Couleur | Badge | Icône |
|--------|---------|-------|-------|
| En attente | Jaune | `bg-yellow-100 text-yellow-800` | 🟡 |
| Entretien | Bleu | `bg-blue-100 text-blue-800` | 🔵 |
| Offre | Vert | `bg-green-100 text-green-800` | 🟢 |
| Refusé | Rouge | `bg-red-100 text-red-800` | 🔴 |
| Sans réponse | Gris | `bg-gray-100 text-gray-800` | ⚪ |

### Animations

- Framer Motion pour toutes les animations
- Transitions fluides (duration: 0.3s)
- Hover effects sur les cards
- AnimatePresence pour les listes

### Responsivité

- Mobile-first approach
- Grille adaptative (1 col mobile, 2 md, 5 lg pour les stats)
- Dialog plein écran sur mobile

---

## 🔧 Installation & Déploiement

### 1. Installer les dépendances

```bash
npm install nanoid
```

### 2. Générer le client Prisma

```bash
npm run db:generate
```

### 3. Créer la table dans Supabase

Option A : Via Prisma (si connexion directe fonctionne)
```bash
npm run db:push
```

Option B : Via SQL Editor Supabase
Copier le contenu de `prisma/migrations/002_add_applications_table.sql` dans le SQL Editor de Supabase et exécuter.

### 4. Variables d'environnement

Assurez-vous que `.env` contient :
```env
DATABASE_URL="..."
DIRECT_URL="..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
```

---

## 📊 Utilisation

### Pour l'utilisateur

1. **Se connecter** au dashboard
2. **Cliquer** sur "Mes Candidatures" (badge NOUVEAU)
3. **Ajouter** une candidature avec le bouton "+"
4. **Remplir** le formulaire :
   - Entreprise (requis)
   - Poste (requis)
   - Statut (requis)
   - Date de candidature (requis)
   - Dernier contact (optionnel)
   - Personne de contact (optionnel)
   - Notes (optionnel)
5. **Enregistrer** → Toast de confirmation
6. **Modifier** une candidature avec le bouton crayon
7. **Supprimer** avec le bouton poubelle (+ confirmation)
8. **Filtrer** par statut ou rechercher par nom

### Pour le développeur

#### Récupérer les candidatures d'un user
```typescript
const response = await fetch('/api/applications');
const applications = await response.json();
```

#### Créer une candidature
```typescript
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName: "Google",
    position: "Développeur Full Stack",
    status: "en_attente",
    appliedDate: "2025-01-15",
    notes: "Candidature via LinkedIn"
  })
});
```

#### Mettre à jour une candidature
```typescript
const response = await fetch(`/api/applications/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: "entretien",
    lastContactDate: "2025-01-20",
    contactPerson: "Marie Dupont (RH)"
  })
});
```

#### Supprimer une candidature
```typescript
await fetch(`/api/applications/${id}`, {
  method: 'DELETE'
});
```

---

## 🚀 Évolutions futures

### Phase 2 (à venir)
- [ ] Calendrier des entretiens
- [ ] Rappels automatiques
- [ ] Statistiques avancées (taux de réponse, délai moyen, etc.)
- [ ] Export CSV/PDF du suivi
- [ ] Timeline par candidature
- [ ] Notes attachées par date
- [ ] Lien vers CV/Lettre utilisés pour la candidature

### Phase 3 (avec IA)
- [ ] IA suggère le statut selon les notes
- [ ] IA génère un résumé des candidatures
- [ ] IA détecte les relances à faire
- [ ] IA analyse les patterns de succès
- [ ] Recommandations personnalisées

---

## 🐛 Troubleshooting

### Erreur : "Non autorisé"
→ Vérifier que l'utilisateur est connecté via Clerk

### Erreur : "Prisma Client not generated"
→ Exécuter `npm run db:generate`

### Erreur : "Table does not exist"
→ Exécuter la migration SQL dans Supabase

### Les candidatures ne s'affichent pas
→ Vérifier la console navigateur pour les erreurs API
→ Vérifier que `DATABASE_URL` est correcte dans `.env`

---

## ✅ Checklist de test

- [ ] Créer une candidature
- [ ] Voir la liste des candidatures
- [ ] Modifier une candidature
- [ ] Changer le statut d'une candidature
- [ ] Supprimer une candidature (avec confirmation)
- [ ] Filtrer par statut
- [ ] Rechercher par nom d'entreprise
- [ ] Rechercher par poste
- [ ] Vérifier les stats rapides
- [ ] Tester sur mobile
- [ ] Vérifier les animations
- [ ] Vérifier les messages toast

---

**Module créé le 21 octobre 2025**
**Status : Implémenté et fonctionnel ✅**
**Prêt pour tests utilisateurs**

