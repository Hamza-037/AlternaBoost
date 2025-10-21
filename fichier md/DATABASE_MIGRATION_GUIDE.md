# 📦 Migration vers Base de Données - Guide Rapide

## ✅ ÉTAPE 1 TERMINÉE : Setup Base de Données

### Ce qui a été fait :

1. ✅ **Dépendances installées**
   - `@prisma/client` (6.1.0)
   - `prisma` (6.1.0)
   - `tsx` (4.19.2)

2. ✅ **Fichiers créés**
   ```
   📁 AlternaBoost/
   ├── 📄 prisma/schema.prisma (Schéma complet de la DB)
   ├── 📄 prisma/seed.ts (Données de test)
   ├── 📄 lib/db.ts (Client Prisma singleton)
   ├── 📄 .env.example (Template variables d'environnement)
   └── 📄 SUPABASE_SETUP.md (Guide détaillé)
   ```

3. ✅ **Scripts NPM ajoutés**
   ```json
   "db:generate": "prisma generate",
   "db:push": "prisma db push",
   "db:migrate": "prisma migrate dev",
   "db:seed": "tsx prisma/seed.ts",
   "db:studio": "prisma studio"
   ```

### Tables créées dans le schéma :

- 👤 **User** - Utilisateurs avec abonnements et tracking d'usage
- 📄 **CV** - CVs générés avec métadonnées
- ✉️ **Letter** - Lettres de motivation
- 📊 **UsageHistory** - Historique des actions utilisateurs
- 🔔 **WebhookEvent** - Événements webhooks (Stripe, Clerk)
- 📈 **DailyStats** - Statistiques quotidiennes

---

## 🚀 PROCHAINE ÉTAPE : Configuration Supabase

### Vous devez maintenant :

1. **Obtenir vos credentials Supabase**
   - Suivez le guide : `SUPABASE_SETUP.md`
   - Section "ÉTAPE 1 : Obtenir les URLs de connexion"

2. **Créer le fichier `.env`** (copie de `.env.example`)
   ```bash
   # Le fichier .env existe déjà, vous devez juste le remplir
   ```

3. **Remplir les URLs Supabase dans `.env`**
   ```env
   DATABASE_URL="postgresql://postgres.[VOTRE-REF]:[PASSWORD]@..."
   DIRECT_URL="postgresql://postgres.[VOTRE-REF]:[PASSWORD]@..."
   ```

4. **Initialiser la base de données**
   ```bash
   npm run db:generate  # Générer le client Prisma
   npm run db:push      # Créer les tables dans Supabase
   npm run db:seed      # Ajouter des données de test (optionnel)
   ```

---

## 📋 Checklist de Configuration

- [ ] Projet Supabase créé
- [ ] URLs de connexion copiées depuis Supabase Dashboard
- [ ] Fichier `.env` rempli avec DATABASE_URL et DIRECT_URL
- [ ] `npm run db:generate` exécuté avec succès
- [ ] `npm run db:push` exécuté avec succès
- [ ] Tables visibles dans Supabase Table Editor
- [ ] (Optionnel) `npm run db:seed` pour données de test

---

## ❓ Questions Fréquentes

### Où trouver mes URLs Supabase ?

1. Dashboard Supabase > Settings > Database
2. Copiez **Connection Pooling** (port 6543) pour DATABASE_URL
3. Copiez **Connection String** (port 5432) pour DIRECT_URL

### Que faire si j'ai oublié mon mot de passe ?

1. Dashboard Supabase > Settings > Database
2. Section "Database password"
3. Cliquez "Reset database password"
4. ⚠️ Sauvegardez le nouveau mot de passe !

### Comment vérifier que ça fonctionne ?

```bash
npm run db:studio
```

Ouvrez http://localhost:5555 - vous devriez voir vos tables vides.

---

## 🔄 APRÈS Configuration

Une fois la configuration terminée, nous passerons à :

**ÉTAPE 2 : Migration des API Routes**
- Remplacer sessionStorage par Prisma
- Implémenter le tracking d'usage réel
- Créer les API save-cv et save-letter

Consultez `AUDIT_DETAILLE_2025.md` pour le plan complet !

---

**Besoin d'aide ?** Consultez `SUPABASE_SETUP.md` pour un guide détaillé étape par étape.


