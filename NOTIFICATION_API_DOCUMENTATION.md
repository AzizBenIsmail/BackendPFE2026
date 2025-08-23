# API Documentation - Gestion des Notifications

## Vue d'ensemble

Cette API permet de gérer un système de notifications complet avec toutes les opérations CRUD et des fonctionnalités avancées comme le marquage comme lu, la recherche, et les statistiques.

## Modèle de données

```javascript
{
  title: String,                    // Titre de la notification (max 100 caractères)
  message: String,                  // Message de la notification (max 500 caractères)
  type: String,                     // Type: 'info', 'success', 'warning', 'error'
  priority: String,                 // Priorité: 'low', 'medium', 'high', 'urgent'
  recipient: ObjectId,              // ID de l'utilisateur destinataire (référence User)
  sender: ObjectId,                 // ID de l'utilisateur expéditeur (référence User)
  isRead: Boolean,                  // Statut de lecture (défaut: false)
  isDeleted: Boolean,               // Statut de suppression (défaut: false)
  readAt: Date,                     // Date de lecture
  expiresAt: Date,                  // Date d'expiration (optionnel)
  metadata: Object,                 // Données supplémentaires (optionnel)
  createdAt: Date,                  // Date de création (automatique)
  updatedAt: Date                   // Date de modification (automatique)
}
```

## Endpoints

### 1. Créer une nouvelle notification
- **URL:** `POST /api/notifications`
- **Description:** Crée une nouvelle notification
- **Body:**
```json
{
  "title": "Nouvelle voiture ajoutée",
  "message": "Une nouvelle voiture Renault Clio a été ajoutée au système",
  "type": "info",
  "priority": "medium",
  "recipient": "507f1f77bcf86cd799439011",
  "sender": "507f1f77bcf86cd799439012",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "metadata": {
    "carId": "507f1f77bcf86cd799439013",
    "action": "car_created"
  }
}
```
- **Réponse:**
```json
{
  "success": true,
  "message": "Notification créée avec succès",
  "data": {
    "_id": "...",
    "title": "Nouvelle voiture ajoutée",
    "message": "Une nouvelle voiture Renault Clio a été ajoutée au système",
    "type": "info",
    "priority": "medium",
    "recipient": "507f1f77bcf86cd799439011",
    "sender": "507f1f77bcf86cd799439012",
    "isRead": false,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Créer des notifications en masse
- **URL:** `POST /api/notifications/bulk`
- **Description:** Crée plusieurs notifications pour différents utilisateurs
- **Body:**
```json
{
  "recipients": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "title": "Maintenance prévue",
  "message": "Le système sera en maintenance demain de 2h à 4h",
  "type": "warning",
  "priority": "high"
}
```

### 3. Récupérer les notifications d'un utilisateur
- **URL:** `GET /api/notifications/user/:userId?`
- **Description:** Récupère les notifications d'un utilisateur avec pagination
- **Paramètres de requête:**
  - `page` - Numéro de page (défaut: 1)
  - `limit` - Nombre d'éléments par page (défaut: 20)
  - `isRead` - Filtrer par statut de lecture (true/false)
  - `type` - Filtrer par type
  - `priority` - Filtrer par priorité
- **Exemple:** `GET /api/notifications/user/507f1f77bcf86cd799439011?page=1&limit=10&isRead=false`
- **Réponse:**
```json
{
  "success": true,
  "message": "Notifications récupérées avec succès",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 4. Récupérer les notifications non lues
- **URL:** `GET /api/notifications/unread/:userId?`
- **Description:** Récupère uniquement les notifications non lues
- **Réponse:**
```json
{
  "success": true,
  "message": "Notifications non lues récupérées avec succès",
  "count": 5,
  "data": [...]
}
```

### 5. Récupérer les notifications lues
- **URL:** `GET /api/notifications/read/:userId?`
- **Description:** Récupère les notifications lues (limité à 50 par défaut)
- **Paramètres de requête:**
  - `limit` - Nombre maximum de notifications (défaut: 50)

### 6. Statistiques des notifications
- **URL:** `GET /api/notifications/stats/:userId?`
- **Description:** Récupère les statistiques des notifications
- **Réponse:**
```json
{
  "success": true,
  "message": "Statistiques récupérées avec succès",
  "data": {
    "total": 25,
    "unread": 5,
    "read": 20,
    "byType": [
      { "_id": "info", "count": 10 },
      { "_id": "warning", "count": 8 },
      { "_id": "success", "count": 5 },
      { "_id": "error", "count": 2 }
    ],
    "byPriority": [
      { "_id": "medium", "count": 15 },
      { "_id": "high", "count": 7 },
      { "_id": "low", "count": 3 }
    ]
  }
}
```

### 7. Rechercher des notifications
- **URL:** `GET /api/notifications/search/:userId?`
- **Description:** Recherche des notifications par critères
- **Paramètres de requête:**
  - `query` - Recherche dans le titre et le message
  - `type` - Filtrer par type
  - `priority` - Filtrer par priorité
  - `isRead` - Filtrer par statut de lecture
  - `startDate` - Date de début (format ISO)
  - `endDate` - Date de fin (format ISO)
- **Exemple:** `GET /api/notifications/search/507f1f77bcf86cd799439011?query=voiture&type=info&startDate=2024-01-01`

### 8. Récupérer une notification par ID
- **URL:** `GET /api/notifications/:id/:userId?`
- **Description:** Récupère une notification spécifique

### 9. Marquer une notification comme lue
- **URL:** `PUT /api/notifications/:id/read/:userId?`
- **Description:** Marque une notification comme lue
- **Réponse:**
```json
{
  "success": true,
  "message": "Notification marquée comme lue",
  "data": {
    "_id": "...",
    "isRead": true,
    "readAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### 10. Marquer plusieurs notifications comme lues
- **URL:** `PUT /api/notifications/mark-multiple-read/:userId?`
- **Description:** Marque plusieurs notifications comme lues
- **Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

### 11. Marquer toutes les notifications comme lues
- **URL:** `PUT /api/notifications/mark-all-read/:userId?`
- **Description:** Marque toutes les notifications non lues comme lues

### 12. Supprimer une notification
- **URL:** `DELETE /api/notifications/:id/:userId?`
- **Description:** Supprime une notification (marque comme supprimée)

### 13. Supprimer plusieurs notifications
- **URL:** `DELETE /api/notifications/multiple/:userId?`
- **Description:** Supprime plusieurs notifications
- **Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

### 14. Supprimer toutes les notifications d'un utilisateur
- **URL:** `DELETE /api/notifications/all/:userId?`
- **Description:** Supprime toutes les notifications d'un utilisateur

### 15. Nettoyer les anciennes notifications
- **URL:** `POST /api/notifications/cleanup`
- **Description:** Nettoie les anciennes notifications lues
- **Body:**
```json
{
  "daysOld": 30
}
```

## Codes d'erreur

- **400** - Données invalides ou notification déjà lue
- **404** - Notification non trouvée
- **500** - Erreur serveur

## Validation

- Le titre est obligatoire et limité à 100 caractères
- Le message est obligatoire et limité à 500 caractères
- Le destinataire (recipient) est obligatoire
- Les types valides sont: 'info', 'success', 'warning', 'error'
- Les priorités valides sont: 'low', 'medium', 'high', 'urgent'

## Fonctionnalités avancées

### Index de performance
- Index sur `{ recipient: 1, isRead: 1, createdAt: -1 }`
- Index TTL sur `expiresAt` pour suppression automatique

### Méthodes du modèle
- `markAsRead()` - Marquer comme lue
- `markAsDeleted()` - Marquer comme supprimée
- `getUnreadNotifications()` - Obtenir les non lues
- `getReadNotifications()` - Obtenir les lues

## Exemples d'utilisation avec cURL

### Créer une notification
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle voiture",
    "message": "Une nouvelle voiture a été ajoutée",
    "type": "info",
    "priority": "medium",
    "recipient": "507f1f77bcf86cd799439011"
  }'
```

### Récupérer les notifications non lues
```bash
curl -X GET http://localhost:3000/api/notifications/unread/507f1f77bcf86cd799439011
```

### Marquer comme lue
```bash
curl -X PUT http://localhost:3000/api/notifications/NOTIFICATION_ID/read/USER_ID
```

### Rechercher des notifications
```bash
curl -X GET "http://localhost:3000/api/notifications/search/USER_ID?query=voiture&type=info"
```

### Statistiques
```bash
curl -X GET http://localhost:3000/api/notifications/stats/USER_ID
```

## Architecture

L'API utilise une architecture en couches :

1. **Routes** (`routes/notificationRouter.js`) - Définition des endpoints
2. **Controllers** (`controllers/notificationController.js`) - Gestion des requêtes HTTP
3. **Services** (`service/notificationService.js`) - Logique métier
4. **Modèles** (`models/notificationModel.js`) - Définition des données avec méthodes

## Cas d'usage typiques

1. **Notifications système** - Informations générales
2. **Notifications d'action** - Confirmation d'actions utilisateur
3. **Notifications d'alerte** - Avertissements et erreurs
4. **Notifications de maintenance** - Informations de maintenance
5. **Notifications personnalisées** - Messages spécifiques aux utilisateurs


