import express from 'express';
import { createNotification, deleteNotification, getAllNotifications, getNotificationById, updateNotification } from "../controllers/notifications.js";


const router = express.Router();

router.post('/notifications/create', createNotification);
router.get('/notifications/getall', getAllNotifications);
router.get('/notifications/get/:id', getNotificationById);
router.put('/notifications/update/:id', updateNotification);
router.delete('/notifications/delete/:id', deleteNotification);

export default router;
 