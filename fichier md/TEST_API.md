# 🧪 Tests d'API avec curl

## Test du Rate Limiting

### 1. Tester la génération de CV (limite: 5 req/min)

```bash
# Créer un fichier de test avec des données minimales
cat > test-cv.json << 'EOF'
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "telephone": "0612345678",
  "formation": "Master Informatique",
  "ecole": "Université Paris",
  "anneeFormation": "2023-2025",
  "experiences": [
    {
      "poste": "Développeur Web",
      "entreprise": "TechCorp",
      "periode": "2023-2024",
      "description": "Développement d'applications web modernes"
    }
  ],
  "competences": "JavaScript, React, Node.js, TypeScript",
  "objectif": "Recherche un poste de développeur full-stack dans une startup innovante",
  "entrepriseCiblee": "Google"
}
EOF

# Envoyer 7 requêtes pour tester la limite (5)
echo "Envoi de 7 requêtes..."
for i in {1..7}; do
  echo -e "\n🔄 Requête $i"
  curl -X POST http://localhost:3000/api/generate-cv-data \
    -H "Content-Type: application/json" \
    -d @test-cv.json \
    -w "\nStatus: %{http_code}\n" \
    -s -o response-$i.json
  
  # Afficher le résultat
  cat response-$i.json | jq '.'
  
  # Petit délai entre les requêtes
  sleep 0.5
done

echo -e "\n✅ Test terminé ! Vérifiez que les requêtes 6 et 7 sont bloquées (429)"
```

### 2. Tester avec des IPs différentes

```bash
# Simuler différentes IPs en utilisant un header
for i in {1..3}; do
  echo -e "\n🔄 Test IP $i"
  curl -X POST http://localhost:3000/api/generate-cv-data \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 192.168.1.$i" \
    -d @test-cv.json \
    -w "\nStatus: %{http_code}\n"
done
```

### 3. Vérifier les headers de rate limiting

```bash
curl -X POST http://localhost:3000/api/generate-cv-data \
  -H "Content-Type: application/json" \
  -d @test-cv.json \
  -v 2>&1 | grep -i "x-ratelimit"
```

Devrait afficher :
```
< X-RateLimit-Limit: 5
< X-RateLimit-Remaining: 4
< X-RateLimit-Reset: 1729432200000
```

---

## Test de la Gestion d'Erreurs

### 1. Erreur de validation (champ manquant)

```bash
curl -X POST http://localhost:3000/api/generate-cv-data \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean"
  }' \
  | jq '.'
```

Réponse attendue :
```json
{
  "error": "ValidationError",
  "message": "Les données fournies sont invalides",
  "type": "VALIDATION_ERROR",
  "statusCode": 400,
  "context": {
    "validationErrors": [...]
  }
}
```

### 2. Erreur avec email invalide

```bash
curl -X POST http://localhost:3000/api/generate-cv-data \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "not-an-email",
    "telephone": "0612345678",
    "formation": "Master",
    "ecole": "Paris",
    "anneeFormation": "2025",
    "experiences": [{
      "poste": "Dev",
      "entreprise": "Corp",
      "periode": "2024",
      "description": "Développement web"
    }],
    "competences": "JavaScript",
    "objectif": "Trouver un stage",
    "entrepriseCiblee": "Google"
  }' \
  | jq '.'
```

### 3. Tester l'analyse de CV

```bash
# Créer un fichier avec un CV complet
cat > test-cv-full.json << 'EOF'
{
  "nom": "Martin",
  "prenom": "Sophie",
  "email": "sophie.martin@example.com",
  "telephone": "0698765432",
  "formation": "Master Marketing Digital",
  "ecole": "ESSEC Business School",
  "anneeFormation": "2023-2025",
  "experiences": [
    {
      "poste": "Chef de projet digital",
      "entreprise": "Agence Créative",
      "periode": "Jan 2023 - Juin 2024",
      "description": "Gestion de campagnes publicitaires digitales pour des clients grands comptes"
    }
  ],
  "competences": "Marketing digital, SEO, Google Ads, Analytics",
  "objectif": "Rejoindre une équipe marketing dynamique",
  "entrepriseCiblee": "L'Oréal",
  "objectifAmeliore": "Passionnée par le marketing digital...",
  "experiencesAmeliorees": [
    {
      "poste": "Chef de projet digital",
      "entreprise": "Agence Créative",
      "periode": "Jan 2023 - Juin 2024",
      "description": "Gestion de campagnes publicitaires"
    }
  ],
  "competencesAmeliorees": ["Marketing", "SEO", "Ads"],
  "pitchPersonnalise": "Expert en marketing digital",
  "recommandationsIA": ["Améliorer...", "Ajouter..."]
}
EOF

# Envoyer 12 requêtes (limite: 10)
echo "Test de l'analyse de CV (limite: 10 req/min)"
for i in {1..12}; do
  echo -e "\n🔄 Analyse $i"
  curl -X POST http://localhost:3000/api/analyze-cv \
    -H "Content-Type: application/json" \
    -d @test-cv-full.json \
    -w "\nStatus: %{http_code}\n" \
    -s | head -n 5
  sleep 0.5
done
```

---

## Tests de Performance

### 1. Mesurer le temps de réponse

```bash
curl -X POST http://localhost:3000/api/generate-cv-data \
  -H "Content-Type: application/json" \
  -d @test-cv.json \
  -w "\nTemps total: %{time_total}s\n" \
  -o /dev/null -s
```

### 2. Test de charge (avec Apache Bench)

```bash
# Installer Apache Bench si nécessaire
# sudo apt-get install apache2-utils

# Envoyer 50 requêtes avec 10 en parallèle
ab -n 50 -c 10 -p test-cv.json -T application/json \
  http://localhost:3000/api/generate-cv-data
```

---

## PowerShell (Windows)

### Test simple

```powershell
# Créer les données de test
$body = @{
  nom = "Dupont"
  prenom = "Jean"
  email = "jean.dupont@example.com"
  telephone = "0612345678"
  formation = "Master Informatique"
  ecole = "Université Paris"
  anneeFormation = "2023-2025"
  experiences = @(
    @{
      poste = "Développeur"
      entreprise = "TechCorp"
      periode = "2023-2024"
      description = "Développement web"
    }
  )
  competences = "JavaScript, React"
  objectif = "Recherche un poste de développeur"
  entrepriseCiblee = "Google"
} | ConvertTo-Json

# Envoyer la requête
Invoke-RestMethod -Uri "http://localhost:3000/api/generate-cv-data" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Test du rate limiting

```powershell
# Envoyer 7 requêtes
1..7 | ForEach-Object {
  Write-Host "`nRequête $_"
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/generate-cv-data" `
      -Method Post `
      -ContentType "application/json" `
      -Body $body
    Write-Host "✅ Status: $($response.StatusCode)"
    Write-Host "Remaining: $($response.Headers['X-RateLimit-Remaining'])"
  } catch {
    Write-Host "❌ Erreur: $($_.Exception.Response.StatusCode)"
    $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json
  }
  Start-Sleep -Milliseconds 500
}
```

---

## Nettoyage

```bash
# Supprimer les fichiers de test
rm -f test-cv.json test-cv-full.json response-*.json
```

---

## 📝 Notes

- Les limites sont par défaut à **5 requêtes/minute** pour les routes OpenAI
- Les tests doivent être exécutés avec le serveur dev en cours (`npm run dev`)
- Pour tester en production, remplacez `localhost:3000` par votre URL de production
- Les headers `X-RateLimit-*` sont visibles avec l'option `-v` (verbose) de curl

**Bon test ! 🚀**
