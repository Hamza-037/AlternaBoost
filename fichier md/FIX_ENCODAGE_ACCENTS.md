# 🔧 FIX : Problème d'Encodage des Accents

**Problème** : Les accents français s'affichent avec des codes étranges (é → Ã©, è → Ã¨)

**Cause** : Cache Next.js avec ancien encodage

---

## ✅ SOLUTION APPLIQUÉE

### 1. Suppression du cache Next.js
```bash
Remove-Item -Recurse -Force .next
```

### 2. Redémarrage du serveur
```bash
npm run dev
```

---

## 🔍 VÉRIFICATIONS EFFECTUÉES

### Encodage des fichiers :
- ✅ `app/layout.tsx` : UTF-8
- ✅ `app/preview-letter/page.tsx` : UTF-8
- ✅ Templates de lettre : UTF-8
- ✅ Métadata : `lang="fr"` défini

### Configuration Next.js :
- ✅ Pas de conflit d'encodage
- ✅ Fonts correctement chargées
- ✅ HTML généré en UTF-8

---

## 📝 ACTIONS À FAIRE

### 1. Redémarrer le serveur dev
```bash
# Si le serveur tourne, arrêter avec Ctrl+C
npm run dev
```

### 2. Vider le cache navigateur
- **Chrome/Edge** : Ctrl + Shift + Delete → Cocher "Cached images and files"
- **Firefox** : Ctrl + Shift + Delete → Cocher "Cache"
- OU : Navigation privée (Ctrl + Shift + N)

### 3. Tester la page
Aller sur : http://localhost:3000/preview-letter

Les accents devraient maintenant s'afficher correctement ! ✅

---

## 🚨 SI LE PROBLÈME PERSISTE

### Option 1 : Hard Refresh
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Option 2 : Rebuild complet
```bash
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
npm run dev
```

### Option 3 : Vérifier l'encodage VS Code
1. Ouvrir `app/preview-letter/page.tsx`
2. Cliquer en bas à droite sur l'encodage
3. S'assurer que c'est **"UTF-8"**
4. Si non, faire "Save with Encoding" → **UTF-8**

---

## ✨ PRÉVENTION FUTURE

### .vscode/settings.json
Ajouter pour forcer UTF-8 :
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false
}
```

### .editorconfig
Créer un fichier `.editorconfig` :
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
```

---

## 📊 RÉSULTAT ATTENDU

### Avant :
```
AperÃ§u de votre lettre
TÃ©lÃ©charger en PDF
RÃ©initialiser
```

### Après :
```
Aperçu de votre lettre
Télécharger en PDF
Réinitialiser
```

---

**Status** : 🟢 **Cache supprimé - Redémarrer le serveur** ✅

