/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from 'mongoose';
export interface INotification extends Document {
  userId: string;
  event: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
}
