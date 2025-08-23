const express = require('express');
const router = express.Router();
const {
  sendRealtimeNotification,
  sendBulkRealtimeNotifications,
  getSocketStats,
  checkUserConnection,
  sendCustomMessage,
  broadcastMessage,
  sendSystemNotification
} = require('../controllers/socketNotificationController');

// Routes pour les notifications Socket.IO

// Envoyer une notification en temps réel
router.post('/send', sendRealtimeNotification);

// Envoyer des notifications en masse en temps réel
router.post('/send-bulk', sendBulkRealtimeNotifications);

// Obtenir les statistiques des connexions Socket.IO
router.get('/stats', getSocketStats);

// Vérifier si un utilisateur est connecté
router.get('/check-connection/:userId', checkUserConnection);

// Envoyer un message personnalisé à un utilisateur
router.post('/send-custom', sendCustomMessage);

// Diffuser un message à tous les utilisateurs
router.post('/broadcast', broadcastMessage);

// Envoyer une notification système
router.post('/system', sendSystemNotification);

module.exports = router;


