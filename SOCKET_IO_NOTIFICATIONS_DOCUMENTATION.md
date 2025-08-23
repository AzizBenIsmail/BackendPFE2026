# Documentation - Système de Notifications Socket.IO

## Vue d'ensemble

Ce système de notifications en temps réel utilise Socket.IO pour fournir des notifications instantanées aux utilisateurs connectés. Il s'intègre parfaitement avec le système de notifications existant et offre des fonctionnalités avancées de communication bidirectionnelle.

## Architecture

```
Client ←→ Socket.IO ←→ Notification Service ←→ Database
```

## Installation et Configuration

### 1. Dépendances
```bash
npm install socket.io
```

### 2. Initialisation dans app.js
```javascript
const socketService = require('./service/socketService');
const server = http.createServer(app);

// Initialiser Socket.IO avec le serveur HTTP
socketService.initialize(server);
```

## Service Socket.IO

### `service/socketService.js`

Le service principal qui gère toutes les communications Socket.IO.

#### Fonctionnalités principales :

- **Authentification des utilisateurs**
- **Gestion des connexions/déconnexions**
- **Envoi de notifications en temps réel**
- **Gestion des rooms par utilisateur**
- **Statistiques des connexions**

#### Méthodes principales :

```javascript
// Initialiser Socket.IO
socketService.initialize(server)

// Envoyer une notification
await socketService.sendNotification(notificationData)

// Envoyer des notifications en masse
await socketService.sendBulkNotifications(recipients, notificationData)

// Vérifier si un utilisateur est connecté
socketService.isUserConnected(userId)

// Envoyer un message personnalisé
socketService.sendToUser(userId, event, data)

// Diffuser à tous les utilisateurs
socketService.broadcastToAll(event, data)
```

## Événements Socket.IO

### Événements côté client → serveur

#### 1. Authentification
```javascript
socket.emit('authenticate', {
  userId: 'user_id',
  token: 'jwt_token' // optionnel
});
```

#### 2. Marquer comme lu
```javascript
socket.emit('mark_as_read', {
  notificationId: 'notification_id',
  userId: 'user_id'
});
```

#### 3. Marquer plusieurs comme lues
```javascript
socket.emit('mark_multiple_as_read', {
  notificationIds: ['id1', 'id2', 'id3'],
  userId: 'user_id'
});
```

#### 4. Marquer toutes comme lues
```javascript
socket.emit('mark_all_as_read', {
  userId: 'user_id'
});
```

#### 5. Supprimer une notification
```javascript
socket.emit('delete_notification', {
  notificationId: 'notification_id',
  userId: 'user_id'
});
```

#### 6. Récupérer les notifications
```javascript
socket.emit('get_notifications', {
  userId: 'user_id',
  options: {
    page: 1,
    limit: 20,
    isRead: false,
    type: 'info'
  }
});
```

#### 7. Rechercher des notifications
```javascript
socket.emit('search_notifications', {
  userId: 'user_id',
  searchParams: {
    query: 'voiture',
    type: 'info',
    priority: 'high',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
});
```

### Événements côté serveur → client

#### 1. Authentification
```javascript
socket.on('authenticated', (data) => {
  console.log('Authentification réussie:', data);
  // data: { success: true, message: '...', userId: '...' }
});

socket.on('authentication_error', (data) => {
  console.error('Erreur d\'authentification:', data);
  // data: { success: false, message: '...' }
});
```

#### 2. Nouvelles notifications
```javascript
socket.on('new_notification', (data) => {
  console.log('Nouvelle notification:', data.notification);
  // data: { notification: { ... } }
});
```

#### 3. Notifications non lues
```javascript
socket.on('unread_notifications', (data) => {
  console.log('Notifications non lues:', data);
  // data: { count: 5, notifications: [...] }
});
```

#### 4. Statistiques
```javascript
socket.on('notification_stats', (data) => {
  console.log('Statistiques:', data);
  // data: { total: 25, unread: 5, read: 20, byType: [...], byPriority: [...] }
});
```

#### 5. Mises à jour
```javascript
socket.on('notification_updated', (data) => {
  console.log('Notification mise à jour:', data);
  // data: { type: 'marked_as_read', notification: { ... } }
});

socket.on('notifications_updated', (data) => {
  console.log('Notifications mises à jour:', data);
  // data: { type: 'marked_multiple_as_read', count: 3 }
});
```

#### 6. Suppression
```javascript
socket.on('notification_deleted', (data) => {
  console.log('Notification supprimée:', data);
  // data: { notificationId: '...', notification: { ... } }
});
```

#### 7. Liste des notifications
```javascript
socket.on('notifications_list', (data) => {
  console.log('Liste des notifications:', data);
  // data: { notifications: [...], pagination: { ... } }
});
```

#### 8. Résultats de recherche
```javascript
socket.on('search_results', (data) => {
  console.log('Résultats de recherche:', data);
  // data: { count: 3, notifications: [...] }
});
```

#### 9. Erreurs
```javascript
socket.on('error', (data) => {
  console.error('Erreur Socket.IO:', data);
  // data: { message: '...' }
});
```

## API REST pour Socket.IO

### Endpoints disponibles

#### 1. Envoyer une notification en temps réel
```http
POST /api/socket-notifications/send
Content-Type: application/json

{
  "title": "Nouvelle voiture",
  "message": "Une nouvelle voiture a été ajoutée",
  "type": "info",
  "priority": "medium",
  "recipient": "user_id",
  "sender": "sender_id",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "metadata": { "carId": "..." }
}
```

#### 2. Envoyer des notifications en masse
```http
POST /api/socket-notifications/send-bulk
Content-Type: application/json

{
  "recipients": ["user1", "user2", "user3"],
  "title": "Maintenance prévue",
  "message": "Le système sera en maintenance",
  "type": "warning",
  "priority": "high"
}
```

#### 3. Statistiques des connexions
```http
GET /api/socket-notifications/stats
```

#### 4. Vérifier la connexion d'un utilisateur
```http
GET /api/socket-notifications/check-connection/:userId
```

#### 5. Envoyer un message personnalisé
```http
POST /api/socket-notifications/send-custom
Content-Type: application/json

{
  "userId": "user_id",
  "event": "custom_event",
  "data": { "message": "Message personnalisé" }
}
```

#### 6. Diffuser un message
```http
POST /api/socket-notifications/broadcast
Content-Type: application/json

{
  "event": "system_alert",
  "data": { "message": "Message pour tous" }
}
```

#### 7. Notification système
```http
POST /api/socket-notifications/system
Content-Type: application/json

{
  "title": "Maintenance système",
  "message": "Maintenance prévue",
  "type": "warning",
  "priority": "high",
  "recipients": ["user1", "user2"] // optionnel, sinon tous les connectés
}
```

## Exemple d'utilisation côté client

### Connexion et authentification
```javascript
const socket = io();

socket.on('connect', () => {
  console.log('Connecté au serveur');
  
  // S'authentifier
  socket.emit('authenticate', { userId: 'user123' });
});

socket.on('authenticated', (data) => {
  console.log('Authentification réussie:', data);
});
```

### Écouter les nouvelles notifications
```javascript
socket.on('new_notification', (data) => {
  const notification = data.notification;
  
  // Afficher la notification
  showNotification(notification.title, notification.message, notification.type);
  
  // Mettre à jour le compteur
  updateNotificationCount();
});
```

### Marquer comme lu
```javascript
function markAsRead(notificationId) {
  socket.emit('mark_as_read', {
    notificationId: notificationId,
    userId: currentUserId
  });
}
```

### Récupérer les notifications
```javascript
function loadNotifications() {
  socket.emit('get_notifications', {
    userId: currentUserId,
    options: {
      page: 1,
      limit: 20,
      isRead: false
    }
  });
}

socket.on('notifications_list', (data) => {
  displayNotifications(data.notifications);
});
```

## Page de test

Une page de test complète est disponible à l'adresse :
```
http://localhost:5000/socket-test.html
```

Cette page permet de :
- Se connecter avec un ID utilisateur
- Envoyer des notifications de test
- Voir les notifications en temps réel
- Tester toutes les fonctionnalités Socket.IO

## Sécurité

### Authentification
- Chaque utilisateur doit s'authentifier avec son ID
- Les actions sont vérifiées contre l'utilisateur connecté
- Possibilité d'ajouter une validation JWT

### Validation
- Vérification des permissions utilisateur
- Validation des données reçues
- Protection contre les actions non autorisées

## Performance

### Optimisations
- Utilisation de rooms par utilisateur
- Index de base de données optimisés
- Gestion efficace des connexions/déconnexions

### Monitoring
- Statistiques des connexions en temps réel
- Logs détaillés des événements
- Métriques de performance

## Cas d'usage

### 1. Notifications système
```javascript
// Envoyer une notification système à tous les utilisateurs connectés
await socketService.sendSystemNotification({
  title: "Maintenance prévue",
  message: "Le système sera en maintenance de 2h à 4h",
  type: "warning",
  priority: "high"
});
```

### 2. Notifications personnalisées
```javascript
// Envoyer une notification à un utilisateur spécifique
await socketService.sendNotification({
  title: "Nouvelle voiture ajoutée",
  message: "Une Renault Clio a été ajoutée",
  recipient: "user123",
  type: "info",
  priority: "medium"
});
```

### 3. Notifications en masse
```javascript
// Envoyer à plusieurs utilisateurs
await socketService.sendBulkNotifications(
  ["user1", "user2", "user3"],
  {
    title: "Nouvelle fonctionnalité",
    message: "Une nouvelle fonctionnalité est disponible",
    type: "success",
    priority: "medium"
  }
);
```

### 4. Messages personnalisés
```javascript
// Envoyer un message personnalisé
socketService.sendToUser("user123", "custom_event", {
  message: "Message personnalisé",
  data: { key: "value" }
});
```

## Intégration avec l'application

### Dans les contrôleurs existants
```javascript
const socketService = require('../service/socketService');

// Après avoir créé une voiture, envoyer une notification
const car = await CarService.createCar(carData);

// Envoyer une notification en temps réel
await socketService.sendNotification({
  title: "Nouvelle voiture ajoutée",
  message: `La voiture ${car.brand} ${car.model} a été ajoutée`,
  recipient: car.owner,
  type: "success",
  priority: "medium",
  metadata: { carId: car._id }
});
```

### Dans les middlewares
```javascript
// Middleware pour envoyer des notifications automatiques
const notificationMiddleware = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Si l'action a réussi, envoyer une notification
    if (res.statusCode === 200 || res.statusCode === 201) {
      // Logique de notification
    }
    
    originalSend.call(this, data);
  };
  
  next();
};
```

## Déploiement

### Variables d'environnement
```env
# Configuration Socket.IO
SOCKET_CORS_ORIGIN=*
SOCKET_PING_TIMEOUT=60000
SOCKET_PING_INTERVAL=25000
```

### Production
- Utiliser un proxy inverse (nginx)
- Configurer les timeouts appropriés
- Monitorer les connexions
- Implémenter la reconnexion automatique

## Dépannage

### Problèmes courants

1. **Connexion échoue**
   - Vérifier que le serveur Socket.IO est initialisé
   - Vérifier les paramètres CORS
   - Vérifier les logs du serveur

2. **Notifications non reçues**
   - Vérifier l'authentification
   - Vérifier que l'utilisateur est dans la bonne room
   - Vérifier les logs côté client

3. **Performance**
   - Monitorer le nombre de connexions
   - Vérifier l'utilisation mémoire
   - Optimiser les requêtes de base de données

## Support

Pour toute question ou problème :
1. Vérifier les logs du serveur
2. Utiliser la page de test
3. Consulter la documentation Socket.IO officielle
4. Vérifier la configuration réseau


