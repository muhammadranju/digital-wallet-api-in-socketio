import mongoose, { Schema } from 'mongoose';
import { INotification } from './notification.interface';

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true },
    event: { type: String, required: true },
    data: { type: Object, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);



export default mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
