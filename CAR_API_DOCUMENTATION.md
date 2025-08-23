# API Documentation - Gestion des Voitures

## Vue d'ensemble

Cette API permet de gérer un système de voitures avec toutes les opérations CRUD (Create, Read, Update, Delete) et utilise une architecture en couches (Service + Controller).

## Modèle de données

```javascript
{
  brand: String,           // Marque de la voiture
  matricule: String,       // Matricule (format: 9999TUN999)
  color: String,           // Couleur (défaut: "#0000")
  model: String,           // Modèle de la voiture
  year: Number,            // Année de fabrication
  createdAt: Date,         // Date de création (automatique)
  updatedAt: Date          // Date de modification (automatique)
}
```

## Endpoints

### 1. Créer une nouvelle voiture
- **URL:** `POST /api/cars`
- **Description:** Crée une nouvelle voiture
- **Body:**
```json
{
  "brand": "Renault",
  "matricule": "2024TUN001",
  "color": "Rouge",
  "model": "Clio",
  "year": 2024
}
```
- **Réponse:**
```json
{
  "success": true,
  "message": "Voiture créée avec succès",
  "data": {
    "_id": "...",
    "brand": "Renault",
    "matricule": "2024TUN001",
    "color": "Rouge",
    "model": "Clio",
    "year": 2024,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Récupérer toutes les voitures
- **URL:** `GET /api/cars`
- **Description:** Récupère la liste de toutes les voitures
- **Réponse:**
```json
{
  "success": true,
  "message": "Voitures récupérées avec succès",
  "count": 2,
  "data": [
    {
      "_id": "...",
      "brand": "Renault",
      "matricule": "2024TUN001",
      "color": "Rouge",
      "model": "Clio",
      "year": 2024,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Statistiques des voitures
- **URL:** `GET /api/cars/stats`
- **Description:** Récupère les statistiques des voitures (total, par marque, par année)
- **Réponse:**
```json
{
  "success": true,
  "message": "Statistiques récupérées avec succès",
  "data": {
    "totalCars": 5,
    "carsByBrand": [
      { "_id": "Renault", "count": 2 },
      { "_id": "Peugeot", "count": 2 },
      { "_id": "Citroën", "count": 1 }
    ],
    "carsByYear": [
      { "_id": 2024, "count": 3 },
      { "_id": 2023, "count": 2 }
    ]
  }
}
```

### 4. Récupérer une voiture par ID
- **URL:** `GET /api/cars/:id`
- **Description:** Récupère une voiture spécifique par son ID
- **Paramètres:** `id` - ID de la voiture
- **Réponse:**
```json
{
  "success": true,
  "message": "Voiture récupérée avec succès",
  "data": {
    "_id": "...",
    "brand": "Renault",
    "matricule": "2024TUN001",
    "color": "Rouge",
    "model": "Clio",
    "year": 2024,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Rechercher des voitures
- **URL:** `GET /api/cars/search`
- **Description:** Recherche des voitures par critères
- **Paramètres de requête:**
  - `brand` - Marque (recherche insensible à la casse)
  - `model` - Modèle (recherche insensible à la casse)
  - `year` - Année exacte
  - `color` - Couleur (recherche insensible à la casse)
- **Exemple:** `GET /api/cars/search?brand=renault&year=2024`
- **Réponse:**
```json
{
  "success": true,
  "message": "Recherche effectuée avec succès",
  "count": 1,
  "data": [
    {
      "_id": "...",
      "brand": "Renault",
      "matricule": "2024TUN001",
      "color": "Rouge",
      "model": "Clio",
      "year": 2024,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6. Mettre à jour une voiture
- **URL:** `PUT /api/cars/:id`
- **Description:** Met à jour une voiture existante
- **Paramètres:** `id` - ID de la voiture
- **Body:**
```json
{
  "brand": "Renault",
  "matricule": "2024TUN001",
  "color": "Bleu",
  "model": "Clio",
  "year": 2024
}
```
- **Réponse:**
```json
{
  "success": true,
  "message": "Voiture mise à jour avec succès",
  "data": {
    "_id": "...",
    "brand": "Renault",
    "matricule": "2024TUN001",
    "color": "Bleu",
    "model": "Clio",
    "year": 2024,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 7. Supprimer une voiture
- **URL:** `DELETE /api/cars/:id`
- **Description:** Supprime une voiture spécifique
- **Paramètres:** `id` - ID de la voiture
- **Réponse:**
```json
{
  "success": true,
  "message": "Voiture supprimée avec succès",
  "data": {
    "_id": "...",
    "brand": "Renault",
    "matricule": "2024TUN001",
    "color": "Bleu",
    "model": "Clio",
    "year": 2024
  }
}
```

### 8. Supprimer toutes les voitures
- **URL:** `DELETE /api/cars`
- **Description:** Supprime toutes les voitures (⚠️ Attention!)
- **Réponse:**
```json
{
  "success": true,
  "message": "Toutes les voitures ont été supprimées avec succès",
  "count": 5
}
```

## Architecture

L'API utilise une architecture en couches :

1. **Routes** (`routes/carRouter.js`) - Définition des endpoints
2. **Controllers** (`controllers/carController.js`) - Gestion des requêtes HTTP
3. **Services** (`service/carService.js`) - Logique métier
4. **Modèles** (`models/carModel.js`) - Définition des données

## Codes d'erreur

- **400** - Données invalides ou matricule déjà existant
- **404** - Voiture non trouvée
- **500** - Erreur serveur

## Validation

- Le matricule doit être unique et suivre le format: `9999TUN999`
- Tous les champs sont optionnels sauf le matricule
- La couleur a une valeur par défaut: `#0000`

## Exemples d'utilisation avec cURL

### Créer une voiture
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Renault",
    "matricule": "2024TUN001",
    "color": "Rouge",
    "model": "Clio",
    "year": 2024
  }'
```

### Récupérer toutes les voitures
```bash
curl -X GET http://localhost:3000/api/cars
```

### Récupérer les statistiques
```bash
curl -X GET http://localhost:3000/api/cars/stats
```

### Rechercher des voitures
```bash
curl -X GET "http://localhost:3000/api/cars/search?brand=renault&year=2024"
```

### Mettre à jour une voiture
```bash
curl -X PUT http://localhost:3000/api/cars/CAR_ID \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Bleu"
  }'
```

### Supprimer une voiture
```bash
curl -X DELETE http://localhost:3000/api/cars/CAR_ID
```
