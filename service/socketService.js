const { Server } = require('socket.io');
const NotificationService = require('./notificationService');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Map pour stocker les utilisateurs connectés
  }

  // Initialiser Socket.IO avec le serveur HTTP
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // À configurer selon vos besoins
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
    console.log('Socket.IO initialisé avec succès');
  }

  // Configurer les gestionnaires d'événements
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Utilisateur connecté: ${socket.id}`);

      // Authentification de l'utilisateur
      socket.on('authenticate', async (data) => {
        try {
          const { userId, token } = data;
          
          // Ici vous pouvez ajouter la validation du token JWT
          // Pour l'instant, on accepte directement l'userId
          
          if (userId) {
            // Stocker l'utilisateur connecté
            this.connectedUsers.set(socket.id, userId);
            
            // Rejoindre la room de l'utilisateur
            socket.join(`user_${userId}`);
            
            // Envoyer les notifications non lues
            const unreadNotifications = await NotificationService.getUnreadNotifications(userId);
            socket.emit('unread_notifications', {
              count: unreadNotifications.length,
              notifications: unreadNotifications
            });

            // Envoyer les statistiques
            const stats = await NotificationService.getNotificationStats(userId);
            socket.emit('notification_stats', stats);

            socket.emit('authenticated', { 
              success: true, 
              message: 'Authentification réussie',
              userId: userId
            });

            console.log(`Utilisateur ${userId} authentifié sur socket ${socket.id}`);
          } else {
            socket.emit('authentication_error', { 
              success: false, 
              message: 'UserId requis' 
            });
          }
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          socket.emit('authentication_error', { 
            success: false, 
            message: 'Erreur d\'authentification' 
          });
        }
      });

      // Marquer une notification comme lue
      socket.on('mark_as_read', async (data) => {
        try {
          const { notificationId, userId } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const notification = await NotificationService.markAsRead(notificationId, userId);
          
          // Émettre la mise à jour à tous les clients de l'utilisateur
          this.io.to(`user_${userId}`).emit('notification_updated', {
            type: 'marked_as_read',
            notification: notification
          });

          // Mettre à jour les statistiques
          const stats = await NotificationService.getNotificationStats(userId);
          this.io.to(`user_${userId}`).emit('notification_stats', stats);

        } catch (error) {
          console.error('Erreur lors du marquage comme lu:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Marquer plusieurs notifications comme lues
      socket.on('mark_multiple_as_read', async (data) => {
        try {
          const { notificationIds, userId } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const result = await NotificationService.markMultipleAsRead(notificationIds, userId);
          
          // Émettre la mise à jour
          this.io.to(`user_${userId}`).emit('notifications_updated', {
            type: 'marked_multiple_as_read',
            count: result.modifiedCount
          });

          // Mettre à jour les statistiques
          const stats = await NotificationService.getNotificationStats(userId);
          this.io.to(`user_${userId}`).emit('notification_stats', stats);

        } catch (error) {
          console.error('Erreur lors du marquage multiple:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Marquer toutes les notifications comme lues
      socket.on('mark_all_as_read', async (data) => {
        try {
          const { userId } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const result = await NotificationService.markAllAsRead(userId);
          
          // Émettre la mise à jour
          this.io.to(`user_${userId}`).emit('notifications_updated', {
            type: 'marked_all_as_read',
            count: result.modifiedCount
          });

          // Mettre à jour les statistiques
          const stats = await NotificationService.getNotificationStats(userId);
          this.io.to(`user_${userId}`).emit('notification_stats', stats);

        } catch (error) {
          console.error('Erreur lors du marquage de toutes:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Supprimer une notification
      socket.on('delete_notification', async (data) => {
        try {
          const { notificationId, userId } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const notification = await NotificationService.deleteNotification(notificationId, userId);
          
          // Émettre la mise à jour
          this.io.to(`user_${userId}`).emit('notification_deleted', {
            notificationId: notificationId,
            notification: notification
          });

          // Mettre à jour les statistiques
          const stats = await NotificationService.getNotificationStats(userId);
          this.io.to(`user_${userId}`).emit('notification_stats', stats);

        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Demander les notifications
      socket.on('get_notifications', async (data) => {
        try {
          const { userId, options = {} } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const result = await NotificationService.getUserNotifications(userId, options);
          socket.emit('notifications_list', result);

        } catch (error) {
          console.error('Erreur lors de la récupération des notifications:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Rechercher des notifications
      socket.on('search_notifications', async (data) => {
        try {
          const { userId, searchParams } = data;
          const userIdFromSocket = this.connectedUsers.get(socket.id);
          
          if (userIdFromSocket !== userId) {
            socket.emit('error', { message: 'Non autorisé' });
            return;
          }

          const notifications = await NotificationService.searchNotifications(userId, searchParams);
          socket.emit('search_results', {
            count: notifications.length,
            notifications: notifications
          });

        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Déconnexion
      socket.on('disconnect', () => {
        const userId = this.connectedUsers.get(socket.id);
        if (userId) {
          console.log(`Utilisateur ${userId} déconnecté: ${socket.id}`);
          this.connectedUsers.delete(socket.id);
        } else {
          console.log(`Client déconnecté: ${socket.id}`);
        }
      });
    });
  }

  // Envoyer une notification en temps réel
  async sendNotification(notificationData) {
    try {
      const notification = await NotificationService.createNotification(notificationData);
      
      // Émettre la notification au destinataire
      this.io.to(`user_${notification.recipient}`).emit('new_notification', {
        notification: notification
      });

      // Mettre à jour les statistiques du destinataire
      const stats = await NotificationService.getNotificationStats(notification.recipient);
      this.io.to(`user_${notification.recipient}`).emit('notification_stats', stats);

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
      throw error;
    }
  }

  // Envoyer des notifications en masse
  async sendBulkNotifications(recipients, notificationData) {
    try {
      const notifications = await NotificationService.createBulkNotifications(recipients, notificationData);
      
      // Émettre les notifications à chaque destinataire
      notifications.forEach(notification => {
        this.io.to(`user_${notification.recipient}`).emit('new_notification', {
          notification: notification
        });
      });

      // Mettre à jour les statistiques pour chaque destinataire
      for (const recipient of recipients) {
        const stats = await NotificationService.getNotificationStats(recipient);
        this.io.to(`user_${recipient}`).emit('notification_stats', stats);
      }

      return notifications;
    } catch (error) {
      console.error('Erreur lors de l\'envoi en masse:', error);
      throw error;
    }
  }

  // Obtenir le nombre d'utilisateurs connectés
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Obtenir la liste des utilisateurs connectés
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  // Vérifier si un utilisateur est connecté
  isUserConnected(userId) {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }

  // Envoyer un message personnalisé à un utilisateur
  sendToUser(userId, event, data) {
    this.io.to(`user_${userId}`).emit(event, data);
  }

  // Envoyer un message à tous les utilisateurs
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  // Envoyer un message à tous les utilisateurs sauf l'émetteur
  broadcastToOthers(socketId, event, data) {
    this.io.to(socketId).emit(event, data);
  }
}

// Instance singleton
const socketService = new SocketService();
module.exports = socketService;


