const NotificationService = require('../service/notificationService');

// CREATE - Créer une nouvelle notification
module.exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipient, sender, expiresAt, metadata } = req.body;
    
    const savedNotification = await NotificationService.createNotification({
      title,
      message,
      type,
      priority,
      recipient,
      sender,
      expiresAt,
      metadata
    });
    
    res.status(201).json({
      success: true,
      message: 'Notification créée avec succès',
      data: savedNotification
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la notification',
      error: error.message
    });
  }
};

// READ - Récupérer toutes les notifications d'un utilisateur
module.exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const { page, limit, isRead, type, priority } = req.query;
    
    const result = await NotificationService.getUserNotifications(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      type,
      priority
    });
    
    res.status(200).json({
      success: true,
      message: 'Notifications récupérées avec succès',
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
      error: error.message
    });
  }
};

// READ - Récupérer les notifications non lues
module.exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const notifications = await NotificationService.getUnreadNotifications(userId);
    
    res.status(200).json({
      success: true,
      message: 'Notifications non lues récupérées avec succès',
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications non lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications non lues',
      error: error.message
    });
  }
};

// READ - Récupérer les notifications lues
module.exports.getReadNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const { limit } = req.query;
    
    const notifications = await NotificationService.getReadNotifications(userId, parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'Notifications lues récupérées avec succès',
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications lues',
      error: error.message
    });
  }
};

// READ - Récupérer une notification par ID
module.exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.params.userId || req.user?.id;
    
    const notification = await NotificationService.getNotificationById(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Notification récupérée avec succès',
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la notification:', error);
    if (error.message === 'Notification non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la notification',
      error: error.message
    });
  }
};

// UPDATE - Marquer une notification comme lue
module.exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.params.userId || req.user?.id;
    
    const notification = await NotificationService.markAsRead(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue',
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    if (error.message === 'Notification non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    if (error.message === 'Notification déjà lue') {
      return res.status(400).json({
        success: false,
        message: 'Notification déjà lue'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification',
      error: error.message
    });
  }
};

// UPDATE - Marquer plusieurs notifications comme lues
module.exports.markMultipleAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.params.userId || req.user?.id;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Liste d\'IDs requise'
      });
    }
    
    const result = await NotificationService.markMultipleAsRead(ids, userId);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marquée(s) comme lue(s)`,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors du marquage multiple des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage multiple des notifications',
      error: error.message
    });
  }
};

// UPDATE - Marquer toutes les notifications comme lues
module.exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const result = await NotificationService.markAllAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marquée(s) comme lue(s)`,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de toutes les notifications',
      error: error.message
    });
  }
};

// DELETE - Supprimer une notification
module.exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.params.userId || req.user?.id;
    
    const notification = await NotificationService.deleteNotification(id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Notification supprimée avec succès',
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    if (error.message === 'Notification non trouvée') {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification',
      error: error.message
    });
  }
};

// DELETE - Supprimer plusieurs notifications
module.exports.deleteMultipleNotifications = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.params.userId || req.user?.id;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Liste d\'IDs requise'
      });
    }
    
    const result = await NotificationService.deleteMultipleNotifications(ids, userId);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) supprimée(s)`,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la suppression multiple des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression multiple des notifications',
      error: error.message
    });
  }
};

// DELETE - Supprimer toutes les notifications d'un utilisateur
module.exports.deleteAllUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const result = await NotificationService.deleteAllUserNotifications(userId);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) supprimée(s)`,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de toutes les notifications',
      error: error.message
    });
  }
};

// SEARCH - Rechercher des notifications
module.exports.searchNotifications = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const { query, type, priority, isRead, startDate, endDate } = req.query;
    
    const notifications = await NotificationService.searchNotifications(userId, {
      query,
      type,
      priority,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      startDate,
      endDate
    });
    
    res.status(200).json({
      success: true,
      message: 'Recherche effectuée avec succès',
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des notifications',
      error: error.message
    });
  }
};

// GET - Statistiques des notifications
module.exports.getNotificationStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    
    const stats = await NotificationService.getNotificationStats(userId);
    
    res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// CREATE - Créer des notifications en masse
module.exports.createBulkNotifications = async (req, res) => {
  try {
    const { recipients, title, message, type, priority, sender, expiresAt, metadata } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste des destinataires requise'
      });
    }
    
    const notifications = await NotificationService.createBulkNotifications(recipients, {
      title,
      message,
      type,
      priority,
      sender,
      expiresAt,
      metadata
    });
    
    res.status(201).json({
      success: true,
      message: `${notifications.length} notification(s) créée(s) avec succès`,
      data: notifications
    });
  } catch (error) {
    console.error('Erreur lors de la création des notifications en masse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création des notifications en masse',
      error: error.message
    });
  }
};

// POST - Nettoyer les anciennes notifications
module.exports.cleanupOldNotifications = async (req, res) => {
  try {
    const { daysOld } = req.body;
    
    const result = await NotificationService.cleanupOldNotifications(daysOld);
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} ancienne(s) notification(s) nettoyée(s)`,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciennes notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du nettoyage des anciennes notifications',
      error: error.message
    });
  }
};


