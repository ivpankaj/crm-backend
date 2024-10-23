import Notification from "../models/Notifications.js";

export const createNotification = async (req, res) => {
  try {
    const { title, message, notificationType } = req.body;
    const notification = await Notification.create({
      title,
      message,
      notificationType,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, notificationType, isDeleted } = req.body;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    notification.title = title || notification.title;
    notification.message = message || notification.message;
    notification.notificationType =
      notificationType || notification.notificationType;
    notification.isDeleted =
      isDeleted !== undefined ? isDeleted : notification.isDeleted;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    await notification.destroy();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};