# 🚀 AlternaBoost

**AlternaBoost** est une plateforme innovante qui aide les étudiants et alternants à créer automatiquement des **CV professionnels** et des **lettres de motivation personnalisées** grâce à l'intelligence artificielle.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)

---

## ✨ Fonctionnalités

### MVP - Version actuelle

- ✅ **Page d'accueil moderne** avec présentation claire du service
- ✅ **Formulaire de création de CV** intuitif et complet
- ✅ **Génération automatique de CV** optimisé par l'IA (OpenAI GPT-4o-mini)
- ✅ **Export PDF professionnel** prêt à être envoyé aux recruteurs
- ✅ **Design responsive** adapté aux mobiles et tablettes
- ✅ **Validation de formulaire** avec messages d'erreur clairs

### À venir

- 🔜 **Génération de lettres de motivation**
- 🔜 **Authentification utilisateur** avec Supabase
- 🔜 **Dashboard personnel** avec historique des CV générés
- 🔜 **Analyse IA du CV** avec score et suggestions
- 🔜 **Simulation d'entretien** avec feedback intelligent

---

## 🛠️ Stack technique

| Technologie | Usage |
|------------|-------|
| **Next.js 15** | Framework React avec App Router |
| **TypeScript** | Typage statique pour plus de robustesse |
| **TailwindCSS v4** | Styling moderne et responsive |
| **Shadcn/UI** | Composants UI accessibles et personnalisables |
| **OpenAI** | Intelligence artificielle (GPT-4o-mini) |
| **React-PDF** | Génération de fichiers PDF |
| **Zod** | Validation de schémas |
| **React Hook Form** | Gestion de formulaires performante |

---

## 🚀 Installation et démarrage

### Prérequis

- **Node.js** 18+ et npm
- Une clé API **OpenAI** ([obtenir ici](https://platform.openai.com/api-keys))

### Étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-username/alternaboost.git
   cd alternaboost
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   OPENAI_API_KEY=sk-votre-cle-api-openai
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   
   Rendez-vous sur [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
alternaboost/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Page d'accueil
│   ├── layout.tsx                # Layout global
│   ├── create-cv/
│   │   └── page.tsx              # Page de création de CV
│   └── api/
│       └── generate-cv/
│           └── route.ts          # API de génération de CV
├── components/
│   ├── landing/                  # Composants de la landing page
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── cv/                       # Composants du formulaire CV
│   │   ├── CVForm.tsx
│   │   └── ExperienceFields.tsx
│   └── ui/                       # Composants Shadcn/UI
├── lib/
│   ├── openai.ts                 # Client OpenAI
│   ├── validations/
│   │   └── cv-schema.ts          # Schémas de validation Zod
│   └── pdf/
│       ├── cv-template.tsx       # Template PDF du CV
│       └── styles.ts             # Styles pour le PDF
├── types/
│   └── cv.ts                     # Types TypeScript
└── public/                       # Assets statiques
```

---

## 🎨 Design et UX

- **Palette de couleurs** : Bleu (#2563EB) et violet clair
- **Typographie** : Inter (Google Fonts)
- **Style** : Moderne, épuré, professionnel
- **Responsive** : Mobile-first design
- **Animations** : Transitions fluides et subtiles

---

## 🔧 Scripts disponibles

```bash
npm run dev      # Lancer le serveur de développement avec Turbopack
npm run build    # Compiler le projet pour la production
npm run start    # Lancer le serveur de production
npm run lint     # Vérifier le code avec ESLint
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout de fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une **Pull Request**

---

## 📝 Licence

Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

---

## 👨‍💻 Auteur

Créé avec ❤️ pour aider les étudiants et alternants à décrocher leur opportunité professionnelle.

---

## 🐛 Problèmes connus

Si vous rencontrez des problèmes :

1. Vérifiez que votre clé API OpenAI est valide
2. Assurez-vous que toutes les dépendances sont installées
3. Redémarrez le serveur de développement
4. Ouvrez une issue sur GitHub avec les détails du problème

---

## 🌟 Roadmap

- [ ] Ajout de templates de CV multiples
- [ ] Support multilingue (FR/EN)
- [ ] Intégration Supabase pour l'authentification
- [ ] Dashboard utilisateur avec historique
- [ ] Export en formats Word et LaTeX
- [ ] Suggestions de compétences basées sur le poste
- [ ] Optimisation SEO du CV pour les ATS

---

**Bonne création de CV ! 🎯**
