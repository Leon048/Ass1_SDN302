const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

// GET /api/notifications - Get user's notifications (requires auth)
router.get('/', notificationController.getNotifications);

// PATCH /api/notifications/:id/read - Mark notification as read (requires auth)
router.patch('/:id/read', notificationController.markAsRead);

// PATCH /api/notifications/read-all - Mark all notifications as read (requires auth)
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;
