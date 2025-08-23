const socketService = require('../service/socketService');

// Envoyer une notification en temps réel
module.exports.sendRealtimeNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipient, sender, expiresAt, metadata } = req.body;
    
    const notification = await socketService.sendNotification({
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
      message: 'Notification envoyée en temps réel avec succès',
      data: notification,
      recipientConnected: socketService.isUserConnected(recipient)
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification en temps réel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de notification en temps réel',
      error: error.message
    });
  }
};

// Envoyer des notifications en masse en temps réel
module.exports.sendBulkRealtimeNotifications = async (req, res) => {
  try {
    const { recipients, title, message, type, priority, sender, expiresAt, metadata } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste des destinataires requise'
      });
    }
    
    const notifications = await socketService.sendBulkNotifications(recipients, {
      title,
      message,
      type,
      priority,
      sender,
      expiresAt,
      metadata
    });
    
    // Calculer combien de destinataires sont connectés
    const connectedRecipients = recipients.filter(recipient => 
      socketService.isUserConnected(recipient)
    );
    
    res.status(201).json({
      success: true,
      message: `${notifications.length} notification(s) envoyée(s) en temps réel`,
      data: notifications,
      stats: {
        totalRecipients: recipients.length,
        connectedRecipients: connectedRecipients.length,
        offlineRecipients: recipients.length - connectedRecipients.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi en masse en temps réel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi en masse en temps réel',
      error: error.message
    });
  }
};

// Obtenir les statistiques des connexions Socket.IO
module.exports.getSocketStats = async (req, res) => {
  try {
    const stats = {
      connectedUsers: socketService.getConnectedUsersCount(),
      connectedUserIds: socketService.getConnectedUsers(),
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      message: 'Statistiques Socket.IO récupérées avec succès',
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques Socket.IO:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques Socket.IO',
      error: error.message
    });
  }
};

// Vérifier si un utilisateur est connecté
module.exports.checkUserConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const isConnected = socketService.isUserConnected(userId);
    
    res.status(200).json({
      success: true,
      message: 'Statut de connexion vérifié',
      data: {
        userId: userId,
        isConnected: isConnected,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de connexion',
      error: error.message
    });
  }
};

// Envoyer un message personnalisé à un utilisateur
module.exports.sendCustomMessage = async (req, res) => {
  try {
    const { userId, event, data } = req.body;
    
    if (!userId || !event) {
      return res.status(400).json({
        success: false,
        message: 'UserId et event sont requis'
      });
    }
    
    socketService.sendToUser(userId, event, data);
    
    res.status(200).json({
      success: true,
      message: 'Message personnalisé envoyé avec succès',
      data: {
        userId: userId,
        event: event,
        data: data,
        recipientConnected: socketService.isUserConnected(userId),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de message personnalisé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de message personnalisé',
      error: error.message
    });
  }
};

// Diffuser un message à tous les utilisateurs
module.exports.broadcastMessage = async (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'Event est requis'
      });
    }
    
    socketService.broadcastToAll(event, data);
    
    res.status(200).json({
      success: true,
      message: 'Message diffusé avec succès',
      data: {
        event: event,
        data: data,
        connectedUsers: socketService.getConnectedUsersCount(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la diffusion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la diffusion',
      error: error.message
    });
  }
};

// Notification système (pour les administrateurs)
module.exports.sendSystemNotification = async (req, res) => {
  try {
    const { title, message, type = 'info', priority = 'medium', recipients } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Titre et message sont requis'
      });
    }
    
    let notificationData = {
      title,
      message,
      type,
      priority,
      sender: null, // Notification système
      metadata: {
        isSystemNotification: true,
        sentBy: req.user?.id || 'system'
      }
    };
    
    let result;
    
    if (recipients && Array.isArray(recipients) && recipients.length > 0) {
      // Envoyer à des utilisateurs spécifiques
      result = await socketService.sendBulkNotifications(recipients, notificationData);
    } else {
      // Envoyer à tous les utilisateurs connectés
      const connectedUsers = socketService.getConnectedUsers();
      if (connectedUsers.length > 0) {
        result = await socketService.sendBulkNotifications(connectedUsers, notificationData);
      } else {
        result = [];
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification système envoyée avec succès',
      data: {
        notificationsSent: result.length,
        recipients: recipients || 'all_connected',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification système:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de notification système',
      error: error.message
    });
  }
};


