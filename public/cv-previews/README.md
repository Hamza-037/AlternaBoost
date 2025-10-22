# Images de Prévisualisation des CV

## 📸 Images Requises

Pour que les prévisualisations fonctionnent, vous devez ajouter des images PNG des différents templates de CV.

### Noms de fichiers requis :
- `modern-preview.png` - Template Modern
- `creative-preview.png` - Template Creative  
- `premium-preview.png` - Template Premium
- `classic-preview.png` - Template Classic
- `minimal-preview.png` - Template Minimal

### Dimensions recommandées :
- **Format** : PNG avec transparence ou fond blanc
- **Ratio** : A4 (210:297) 
- **Dimensions** : 600px × 850px (ou multiples)
- **Poids** : < 200KB par image (optimisé)

---

## 🎨 Comment générer ces images ?

### Option 1 : Screenshots manuels
1. Ouvrir `/create-cv` dans le navigateur
2. Sélectionner chaque template
3. Prendre un screenshot du rendu PDF
4. Recadrer au format A4
5. Optimiser avec TinyPNG
6. Renommer selon la convention

### Option 2 : Génération automatique (Puppeteer)
Utiliser le script `scripts/generate-cv-previews.ts` :

```bash
npm run generate-previews
```

### Option 3 : Utiliser des placeholders temporaires
Les placeholders SVG sont générés automatiquement par le composant `CVImagePreview.tsx` si les images ne sont pas trouvées.

---

## 🔄 Mise à jour

Quand vous ajoutez un nouveau template :
1. Créer `[template-name]-preview.png`
2. Placer dans ce dossier
3. Le composant détectera automatiquement l'image

---

## ✅ Status Actuel

- [ ] modern-preview.png
- [ ] creative-preview.png
- [ ] premium-preview.png
- [ ] classic-preview.png
- [ ] minimal-preview.png

**Note** : En attendant les vraies images, les placeholders SVG animés s'affichent automatiquement.

