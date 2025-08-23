const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  getUnreadNotifications,
  getReadNotifications,
  getNotificationById,
  markAsRead,
  markMultipleAsRead,
  markAllAsRead,
  deleteNotification,
  deleteMultipleNotifications,
  deleteAllUserNotifications,
  searchNotifications,
  getNotificationStats,
  createBulkNotifications,
  cleanupOldNotifications
} = require('../controllers/notificationController');

// Routes pour les notifications

// CREATE - Créer une nouvelle notification
router.post('/', createNotification);

// CREATE - Créer des notifications en masse
router.post('/bulk', createBulkNotifications);

// READ - Récupérer toutes les notifications d'un utilisateur
router.get('/user/:userId?', getUserNotifications);

// READ - Récupérer les notifications non lues
router.get('/unread/:userId?', getUnreadNotifications);

// READ - Récupérer les notifications lues
router.get('/read/:userId?', getReadNotifications);

// READ - Statistiques des notifications
router.get('/stats/:userId?', getNotificationStats);

// READ - Rechercher des notifications
router.get('/search/:userId?', searchNotifications);

// READ - Récupérer une notification par ID
router.get('/:id/:userId?', getNotificationById);

// UPDATE - Marquer une notification comme lue
router.put('/:id/read/:userId?', markAsRead);

// UPDATE - Marquer plusieurs notifications comme lues
router.put('/mark-multiple-read/:userId?', markMultipleAsRead);

// UPDATE - Marquer toutes les notifications comme lues
router.put('/mark-all-read/:userId?', markAllAsRead);

// DELETE - Supprimer une notification
router.delete('/:id/:userId?', deleteNotification);

// DELETE - Supprimer plusieurs notifications
router.delete('/multiple/:userId?', deleteMultipleNotifications);

// DELETE - Supprimer toutes les notifications d'un utilisateur
router.delete('/all/:userId?', deleteAllUserNotifications);

// POST - Nettoyer les anciennes notifications
router.post('/cleanup', cleanupOldNotifications);

module.exports = router;
