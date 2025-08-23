const Notification = require('../models/notificationModel');

// Créer une nouvelle notification
module.exports.createNotification = async (notificationData) => {
  const newNotification = new Notification(notificationData);
  return await newNotification.save();
};

// Récupérer toutes les notifications d'un utilisateur
module.exports.getUserNotifications = async (userId, options = {}) => {
  const { page = 1, limit = 20, isRead, type, priority } = options;
  const skip = (page - 1) * limit;
  
  const filter = {
    recipient: userId,
    isDeleted: false
  };
  
  if (isRead !== undefined) filter.isRead = isRead;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  
  const notifications = await Notification.find(filter)
    .populate('sender', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Notification.countDocuments(filter);
  
  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Récupérer les notifications non lues
module.exports.getUnreadNotifications = async (userId) => {
  return await Notification.getUnreadNotifications(userId)
    .populate('sender', 'name email');
};

// Récupérer les notifications lues
module.exports.getReadNotifications = async (userId, limit = 50) => {
  return await Notification.getReadNotifications(userId, limit)
    .populate('sender', 'name email');
};

// Récupérer une notification par ID
module.exports.getNotificationById = async (id, userId) => {
  const notification = await Notification.findOne({
    _id: id,
    recipient: userId,
    isDeleted: false
  }).populate('sender', 'name email');
  
  if (!notification) {
    throw new Error('Notification non trouvée');
  }
  
  return notification;
};

// Marquer une notification comme lue
module.exports.markAsRead = async (id, userId) => {
  const notification = await Notification.findOne({
    _id: id,
    recipient: userId,
    isDeleted: false
  });
  
  if (!notification) {
    throw new Error('Notification non trouvée');
  }
  
  if (notification.isRead) {
    throw new Error('Notification déjà lue');
  }
  
  return await notification.markAsRead();
};

// Marquer plusieurs notifications comme lues
module.exports.markMultipleAsRead = async (ids, userId) => {
  const result = await Notification.updateMany(
    {
      _id: { $in: ids },
      recipient: userId,
      isDeleted: false,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
  
  return result;
};

// Marquer toutes les notifications comme lues
module.exports.markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    {
      recipient: userId,
      isDeleted: false,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
  
  return result;
};

// Supprimer une notification (marquer comme supprimée)
module.exports.deleteNotification = async (id, userId) => {
  const notification = await Notification.findOne({
    _id: id,
    recipient: userId,
    isDeleted: false
  });
  
  if (!notification) {
    throw new Error('Notification non trouvée');
  }
  
  return await notification.markAsDeleted();
};

// Supprimer plusieurs notifications
module.exports.deleteMultipleNotifications = async (ids, userId) => {
  const result = await Notification.updateMany(
    {
      _id: { $in: ids },
      recipient: userId,
      isDeleted: false
    },
    {
      isDeleted: true
    }
  );
  
  return result;
};

// Supprimer toutes les notifications d'un utilisateur
module.exports.deleteAllUserNotifications = async (userId) => {
  const result = await Notification.updateMany(
    {
      recipient: userId,
      isDeleted: false
    },
    {
      isDeleted: true
    }
  );
  
  return result;
};

// Rechercher des notifications
module.exports.searchNotifications = async (userId, searchParams) => {
  const { query, type, priority, isRead, startDate, endDate } = searchParams;
  
  const filter = {
    recipient: userId,
    isDeleted: false
  };
  
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } }
    ];
  }
  
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (isRead !== undefined) filter.isRead = isRead;
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  
  return await Notification.find(filter)
    .populate('sender', 'name email')
    .sort({ createdAt: -1 });
};

// Statistiques des notifications
module.exports.getNotificationStats = async (userId) => {
  const total = await Notification.countDocuments({
    recipient: userId,
    isDeleted: false
  });
  
  const unread = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
    isDeleted: false
  });
  
  const byType = await Notification.aggregate([
    {
      $match: {
        recipient: mongoose.Types.ObjectId(userId),
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  const byPriority = await Notification.aggregate([
    {
      $match: {
        recipient: mongoose.Types.ObjectId(userId),
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return {
    total,
    unread,
    read: total - unread,
    byType,
    byPriority
  };
};

// Créer une notification pour plusieurs utilisateurs
module.exports.createBulkNotifications = async (recipients, notificationData) => {
  const notifications = recipients.map(recipientId => ({
    ...notificationData,
    recipient: recipientId
  }));
  
  return await Notification.insertMany(notifications);
};

// Nettoyer les anciennes notifications
module.exports.cleanupOldNotifications = async (daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const result = await Notification.updateMany(
    {
      isRead: true,
      isDeleted: false,
      readAt: { $lt: cutoffDate }
    },
    {
      isDeleted: true
    }
  );
  
  return result;
};


