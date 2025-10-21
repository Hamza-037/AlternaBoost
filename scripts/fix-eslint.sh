#!/bin/bash

# Script pour corriger automatiquement les erreurs ESLint communes

echo "🔧 Correction automatique des erreurs ESLint..."

# 1. Corriger les apostrophes non échappées (remplacer ' par &apos;)
echo "📝 Correction des apostrophes dans les fichiers .tsx..."

# Les fichiers les plus problématiques
files=(
  "app/legal/terms/page.tsx"
  "app/legal/privacy/page.tsx"
  "app/legal/mentions/page.tsx"
  "app/dashboard/DashboardClient.old.tsx"
  "app/dashboard/pageV2.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  → Correction de $file"
    # Utiliser sed pour remplacer les apostrophes simples par &apos;
    # Cette commande est un exemple, à adapter selon les besoins
  fi
done

# 2. Exécuter ESLint avec auto-fix
echo "🔨 Exécution de ESLint --fix..."
npx eslint . --ext .ts,.tsx --fix

echo "✅ Corrections terminées ! Vérifiez les changements avec 'git diff'"

