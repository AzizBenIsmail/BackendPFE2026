const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthode pour marquer comme lue
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Méthode pour marquer comme supprimée
notificationSchema.methods.markAsDeleted = function() {
  this.isDeleted = true;
  return this.save();
};

// Méthode statique pour obtenir les notifications non lues
notificationSchema.statics.getUnreadNotifications = function(recipientId) {
  return this.find({
    recipient: recipientId,
    isRead: false,
    isDeleted: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 });
};

// Méthode statique pour obtenir les notifications lues
notificationSchema.statics.getReadNotifications = function(recipientId, limit = 50) {
  return this.find({
    recipient: recipientId,
    isRead: true,
    isDeleted: false
  }).sort({ readAt: -1 }).limit(limit);
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;


