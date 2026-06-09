const Notification = require('../models/Notification');

// GET /api/notifications - Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const { user_id, is_read } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    let query = { user_id };

    if (is_read !== undefined) {
      query.is_read = is_read === 'true';
    }

    const notifications = await Notification.find(query).sort({ created_at: -1 });

    const unreadCount = await Notification.countDocuments({
      user_id,
      is_read: false
    });

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      unreadCount,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications', error: error.message });
  }
};

// PATCH /api/notifications/:id/read - Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// PATCH /api/notifications/read-all - Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    await Notification.updateMany(
      { user_id, is_read: false },
      { is_read: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};
